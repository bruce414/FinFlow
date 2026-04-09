# FinFlow – System Architecture

## 1. Overview

FinFlow is a personal finance visualisation platform designed to help users understand their money flow across accounts, transactions, budgets, and goals through a secure, scalable, and maintainable system.

This document describes:
- Overall system architecture
- Backend and frontend structure
- Data and security architecture
- Configuration, environments, and deployment
- Development workflow and architectural principles

This document intentionally avoids domain-level details, which are defined separately in `DOMAIN_MODEL.md`.

---

## 2. Architectural Goals

The architecture is designed to achieve the following:

- **Security by default**: strict user data isolation and secure authentication
- **Maintainability**: clear layering and separation of concerns
- **Scalability**: ability to evolve toward larger datasets and integrations
- **Production realism**: aligned with real-world fintech/backend practices
- **Solo-developer friendly**: pragmatic, not over-engineered

---

## 3. High-Level System Architecture

### 3.1 System Context

```text
+---------------------+        HTTPS        +--------------------------+
|  Web Client         | <----------------> |  Backend API             |
|  React + Vite       |                    |  Spring Boot             |
|  Tailwind CSS       |                    |  REST + Security         |
+---------------------+                    +--------------------------+
                                                     |
                                                     | JPA / JDBC
                                                     v
                                          +---------------------------+
                                          | PostgreSQL                |
                                          | Flyway-managed schema     |
                                          +---------------------------+
```

### 3.2 Key Characteristics

- Stateless backend API
- RESTful JSON communication
- Relational database as the system of record
- Database schema versioned through migrations

---

## 4. Backend Architecture (Spring Boot)

### 4.1 Layered Architecture

The backend follows a classic layered architecture, which is widely used in enterprise Java systems.

```
Controller Layer  →  Service Layer  →  Repository Layer  →  Database
```

#### Controller Layer

- Handles HTTP requests and responses
- Performs request validation
- Extracts authenticated user context
- Maps between DTOs and service calls
- Contains no business logic

#### Service Layer

- Implements business use cases
- Coordinates multiple repositories if needed
- Enforces authorization and ownership rules
- Defines transactional boundaries (`@Transactional`)
- Contains application-level logic

#### Repository Layer

- Abstracts persistence logic
- Uses Spring Data JPA
- Exposes user-scoped queries only
- Never contains business logic

### 4.2 Package Structure (Recommended)

```
com.finflow
 ├── FinflowApplication.java
 ├── config/
 │   ├── SecurityConfig.java
 │   ├── CorsConfig.java
 │   └── OpenApiConfig.java
 ├── auth/
 │   ├── JwtService.java
 │   ├── UserPrincipal.java
 │   ├── CurrentUser.java
 │   └── OAuth2SuccessHandler.java
 ├── common/
 │   ├── exception/
 │   ├── api/
 │   └── util/
 ├── domain/
 ├── repository/
 ├── service/
 └── web/
     ├── controller/
     └── dto/
```

This structure:

- Keeps framework concerns isolated
- Makes business logic easy to locate
- Scales well as the project grows

---

## 5. API Architecture

### 5.1 API Style

- RESTful endpoints
- JSON request/response bodies
- Versioned API paths: `/api/v1/...`
- Pagination for list endpoints
- Consistent error response format

### 5.2 Example Endpoints

```
GET    /api/v1/accounts
POST   /api/v1/accounts
GET    /api/v1/transactions
POST   /api/v1/transactions
GET    /api/v1/budgets
```

### 5.3 DTO Boundary

- Controllers accept and return DTOs only
- JPA entities are never exposed directly
- Prevents accidental data leakage
- Allows internal domain evolution without breaking clients

---

## 6. Data Architecture

### 6.1 Database

- PostgreSQL as primary datastore
- Strong consistency guarantees
- Suitable for financial data integrity

### 6.2 Schema Management

- Flyway manages all schema changes
- Versioned SQL migrations:

```
V1__init.sql
V2__add_transactions.sql
V3__add_budgets.sql
```

- Database schema is code, not an afterthought

### 6.3 Transaction Management

- All write operations occur inside transactions
- Multi-step operations are atomic
- Read-only queries use non-transactional boundaries where appropriate

---

## 7. Security Architecture

### 7.1 Authentication

**Supported approach:**

- OAuth2 login (e.g. Google)
- Backend issues JWT access token after successful login

**JWT characteristics:**

- Short-lived access token
- Signed with server secret
- Contains user identifier and minimal claims

### 7.2 Authorization

Authorization is ownership-based:

- Every request is tied to an authenticated user
- All data access is scoped by `userId`
- Repository methods enforce ownership:

```java
findByIdAndUserId(...)
```

This prevents:

- Horizontal privilege escalation
- Accidental data leaks
- Over-reliance on controller-level checks

### 7.3 Sensitive Data Handling

- No raw bank account numbers stored
- Masked identifiers only
- Secrets loaded via environment variables
- No credentials committed to source control

---

## 8. Frontend Architecture

### 8.1 Technology Stack

- React (Vite)
- JavaScript (or TypeScript later)
- Tailwind CSS
- REST API integration

### 8.2 Suggested Structure

```
src/
 ├── api/         // API clients
 ├── components/  // Reusable UI components
 ├── pages/       // Route-level components
 ├── features/    // Domain-based modules
 ├── hooks/       // Custom React hooks
 ├── utils/
 └── types/
```

### 8.3 Responsibilities

- UI state management
- API orchestration
- Client-side validation
- Data visualization

All business rules remain on the backend.

---

## 9. Configuration and Environments

### 9.1 Backend Configuration

- `application.yml` (base)
- `application-local.yml`
- `application-prod.yml`

Configured via environment variables:

```
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MIN
OAUTH_GOOGLE_CLIENT_ID
OAUTH_GOOGLE_CLIENT_SECRET
```

### 9.2 Frontend Configuration

- `.env.local`
- `.env.production`

Example:

```
VITE_API_BASE_URL=https://api.finflow.app
```

---

## 10. Deployment Architecture (Target State)

### Backend

- Containerized Spring Boot application
- Deployed to cloud PaaS (Render / Railway / Fly.io)

### Database

- Managed PostgreSQL service
- Automated backups enabled

### Frontend

- Static build deployed to Vercel / Netlify
- CDN-backed asset delivery

---

## 11. Development Workflow (Solo)

### Branching Strategy

```
main        → always stable / deployable
dev         → integration branch
feature/*   → short-lived feature branches
hotfix/*    → urgent production fixes
```

**Rules:**

- Feature branches are merged into `dev`
- `dev` is merged into `main` for releases
- `main` is protected and tagged

---

## 12. Architectural Constraints

- No direct database access from controllers
- No business logic in repositories
- No entity exposure at API boundaries
- All financial operations are transactional
- All data access is user-scoped

These constraints are deliberate and enforced to maintain system integrity.
