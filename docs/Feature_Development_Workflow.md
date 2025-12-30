# Feature Development Workflow

This document describes the **feature development workflow** used in the FinFlow project.

The goal of this workflow is to ensure:
- clean Git history
- safe, incremental development
- clear separation between features
- easy review and rollback
- production-oriented engineering discipline

This workflow is intentionally simple and scalable.

---

## Guiding Principles

- **One feature per branch**
- **Small, focused commits**
- **Main branch is always stable**
- **Features are merged via Pull Requests**
- **No direct commits to `main`**

---

## Branch Structure Overview

```text
main        → stable, production-ready code
  ↑
dev         → integration & validation branch
  ↑
feature/*   → isolated feature development
```

---

## Branch Roles

### main

- Always stable
- Represents the best-known working state
- Never broken intentionally
- No direct commits

### dev

- Based on main
- Used to integrate completed features
- May be temporarily unstable
- Acts as a buffer before merging into main

### feature/*

- Short-lived branches
- One feature per branch
- Created from dev

---

## Branch Creation Rules

### Initial Setup (One-Time)

Create dev from main:

```bash
git checkout main
git pull origin main
git checkout -b dev
git push -u origin dev
```

---

## Feature Development Lifecycle (Solo)

### 1. Start From dev

Before starting any feature:

```bash
git checkout dev
git pull origin dev
```

This ensures your feature is based on the latest integrated work.

### 2. Create a Feature Branch

```bash
git checkout -b feature/transaction-model
```

**Naming convention:**

```
feature/<short-description>
```

**Examples:**

- `feature/account-entity`
- `feature/transaction-flow`
- `feature/frontend-dashboard`

### 3. Develop Incrementally

While working on the feature:

- Commit small, logical changes
- Avoid mixing unrelated work
- Treat each commit as reviewable

**Example commits:**

- `feat: add transaction entity`
- `feat: add source and destination account fields`
- `feat: add transaction repository`

**Commands:**

```bash
git add .
git commit -m "feat: add transaction entity"
```

### 4. Merge Feature Into dev

Once the feature is complete and locally tested:

```bash
git checkout dev
git merge feature/transaction-model
```

Resolve conflicts here, not in main.

Push dev:

```bash
git push origin dev
```

Then delete the feature branch:

```bash
git branch -d feature/transaction-model
git push origin --delete feature/transaction-model
```

### 5. Stabilize on dev

After merging features into dev:

- Run the application
- Verify core flows
- Ensure nothing critical is broken

dev is allowed to be imperfect temporarily, but it should converge back to stability.

### 6. Merge dev Into main

When dev is stable and ready:

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

This merge should be:

- low-risk
- predictable
- conflict-free

After merging, re-sync dev:

```bash
git checkout dev
git merge main
git push origin dev
```

This keeps dev aligned with main.

---

## Commit Message Conventions

FinFlow uses a lightweight convention inspired by Conventional Commits.

| Prefix | Meaning |
|--------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Internal code improvement |
| `docs` | Documentation |
| `chore` | Tooling / config |

**Examples:**

- `feat: add account entity`
- `fix: correct transaction ownership check`
- `docs: add feature workflow documentation`
- `chore: update docker compose config`

---

## Hotfixes (Solo)

For urgent fixes to production code:

```bash
git checkout main
git checkout -b fix/transaction-query-bug
```

Fix → merge into dev → test → merge into main.

This ensures even hotfixes go through the safety layer.

---

## Why Use dev as a Solo Developer?

Using dev provides:

- a rollback point
- conflict isolation
- confidence when merging to main
- a workflow that scales naturally to teams

It prevents:

- accidental breaking of main
- rushed or untested merges
- tangled feature histories

This is intentional discipline, not over-engineering.

---

## Summary

- main is always stable
- dev is the integration layer
- features branch from dev
- features merge into dev
- dev merges into main only when stable

This workflow balances safety, clarity, and solo efficiency.
