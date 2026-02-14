#!/usr/bin/env python3
"""Generate an idempotent Flyway seed SQL script for a currencies table.

This script is designed for a schema with columns:
  - code (CHAR(3) / VARCHAR(3), PRIMARY KEY)
  - name (TEXT)
  - decimal_scale (SMALLINT)  # number of fractional decimal digits for the currency
  - active (BOOLEAN)

Expected CSV columns:
  - code,name,decimal_scale,active

Output:
  - R__seed_currencies.sql (repeatable Flyway migration)
"""

from __future__ import annotations
import csv
import argparse
from pathlib import Path

def escape_sql_string(s: str) -> str:
    return s.replace("'", "''")

def parse_bool(raw: str) -> bool:
    return (raw or "").strip().lower() in {"true", "1", "yes", "y", "t"}

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--csv", required=True, help="Path to input CSV")
    p.add_argument("--out", default="R__seed_currencies.sql", help="Path to output SQL file")
    p.add_argument("--table", default="currencies", help="Target table name")
    args = p.parse_args()

    csv_path = Path(args.csv)
    out_path = Path(args.out)

    rows: list[tuple[str, str, int, bool]] = []
    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required = {"code", "name", "decimal_scale", "active"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise SystemExit(f"CSV missing columns: {sorted(missing)}")

        for r in reader:
            code = (r.get("code") or "").strip().upper()
            name = (r.get("name") or "").strip()
            try:
                decimal_scale = int((r.get("decimal_scale") or "2").strip())
            except ValueError:
                decimal_scale = 2
            active = parse_bool(r.get("active") or "false")

            # Basic sanity checks
            if len(code) != 3 or not code.isalpha():
                continue
            if decimal_scale < 0 or decimal_scale > 6:
                # You can loosen this range if you want, but most ISO currencies fit 0-3.
                continue
            if not name:
                continue

            rows.append((code, name, decimal_scale, active))

    header = f"""    -- Generated from {csv_path.name}
-- Flyway *repeatable* migration (R__*.sql). Idempotent via ON CONFLICT.
--
-- Expected schema (minimal):
--   CREATE TABLE {args.table} (
--     code CHAR(3) PRIMARY KEY,
--     name TEXT NOT NULL,
--     decimal_scale SMALLINT NOT NULL,
--     active BOOLEAN NOT NULL DEFAULT TRUE
--   );
"""

    lines = [header, f"INSERT INTO {args.table} (code, name, decimal_scale, active) VALUES"]
    values: list[str] = []
    for code, name, decimal_scale, active in rows:
        values.append(
            f"  ('{code}', '{escape_sql_string(name)}', {decimal_scale}, {'TRUE' if active else 'FALSE'})"
        )
    lines.append(",\n".join(values))
    lines.append(
        "ON CONFLICT (code) DO UPDATE SET\n"
        "  name = EXCLUDED.name,\n"
        "  decimal_scale = EXCLUDED.decimal_scale,\n"
        "  active = EXCLUDED.active;\n"
    )

    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out_path} ({len(rows)} rows)")

if __name__ == "__main__":
    main()
