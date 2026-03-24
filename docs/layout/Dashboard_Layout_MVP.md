# FinFlow Dashboard (MVP) — Widget List + Field Spec

Goal: let users understand (1) current position, (2) recent activity, (3) immediate actions in <30 seconds.

---

## 1) KPI Strip (Top Summary)
**Purpose:** instant “where am I” snapshot.

**Display (4 tiles recommended):**
- **Total Cash** = sum of (checking + savings) available/current balance
- **Month-to-Date Spending** = sum of expense transactions in current month
- **Month-to-Date Income** = sum of income transactions in current month
- **Net Cashflow (MTD)** = Income (MTD) − Spending (MTD)

**Fields needed:**
- `balanceCurrent`, `balanceAvailable`, `currency`, `asOfTimestamp`
- `txn.amount`, `txn.currency`, `txn.datePosted`, `txn.type` (income/expense/transfer), `txn.status`

**UX notes:**
- Show **% change vs last month** only if you can compute reliably.
- Show **Last refreshed** time somewhere on the strip or header.

---

## 2) Accounts Overview (Balances Card)
**Purpose:** confirm linked accounts + current balances (trust + control).

**Display:**
- List top **3–6 accounts** (or all if user has few)
- Each row: `Institution + Account Nickname`, `Account Type`, `Current/Available Balance`
- CTA: **Manage accounts** / **View all accounts**

**Fields needed:**
- `accountId`, `institutionName`, `accountNickname`, `accountType`
- `balanceCurrent`, `balanceAvailable`, `currency`, `asOfTimestamp`
- `syncStatus` (ok / delayed / error)

**UX notes:**
- If `syncStatus != ok`, surface a small badge: “Needs attention”.

---

## 3) Recent Transactions (Cross-Account Feed)
**Purpose:** “what just happened” across all accounts.

**Display:**
- Default **All accounts** feed, sorted by `effectiveTimestamp` desc
- Show **8 items (web)** / **5 items (mobile)**
- Each row: `Merchant/Payee`, `Amount`, `Date (Today/Yesterday/…)`, `Account pill`, `Pending badge`
- CTA: **View all transactions**

**Fields needed:**
- `transactionId`, `accountId`
- `merchantName/payeeName`, `amount`, `currency`
- `postedAt`, `authorizedAt` (optional), `status` (PENDING/POSTED)
- `category` (optional for widget; required for drilldown page)

**Logic notes:**
- `effectiveTimestamp = postedAt ?? authorizedAt`
- If you can detect internal transfers, optionally label them “Transfer”.

---

## 4) Spending Summary (MTD + Trend)
**Purpose:** quick spend awareness without deep analytics.

**Display:**
- **MTD total spend**
- Comparison: **vs last month MTD** (or full last month) if available
- Mini breakdown: top **1–3 categories** this month

**Fields needed:**
- Transactions filtered to `type=EXPENSE`, month window
- `categoryId/categoryName`

**UX notes:**
- Keep chart minimal: one number + small bars (avoid “chart soup” in MVP).

---

## 5) Budget Status (Simple Monthly Budgets)
**Purpose:** “am I on track” + next action.

**Display:**
- Headline: **On track / At risk / Over budget**
- Show top **3–5 budgets** with progress bars:
  - `Category`, `Spent`, `Limit`, `Remaining`
- CTA: **View budgets**

**Fields needed:**
- `budgetId`, `period=MONTHLY`, `categoryId`
- `limitAmount`, `spentAmount` (computed), `currency`

**Logic notes:**
- `spentAmount = sum(expense txns in category within month)`
- Status:
  - On track: spent <= 70%
  - At risk: 70–100%
  - Over: >100% (tune thresholds later)

---

## 6) Alerts / Data Health (MVP Trust Widget)
**Purpose:** build confidence + reduce confusion when data is incomplete.

**Display (only show when relevant):**
- “Sync delayed for SMBC Checking”
- “3 transactions need categorization”
- “Potential duplicate pending transaction” (optional)

**Fields needed:**
- `syncStatus`, `lastSyncAt`, `errorCode/errorMessage` (sanitized)
- `uncategorizedTxnCount`, `pendingTxnCount`

**UX notes:**
- Keep tone cautious: “May be delayed”, “Needs review”.

---

## MVP Navigation CTAs (not widgets, but required links)
- **View all transactions** (with filters/search)
- **Manage accounts** (link/unlink/rename)
- **Budgets** (create/edit)
- **Settings** (currency, preferences)

---

## Recommended Default Ordering (Web)
1. KPI Strip
2. Accounts Overview (left) + Budget Status (right)
3. Spending Summary (left) + Alerts/Data Health (right, conditional)
4. Recent Transactions (full width or main column)