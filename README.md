<p align="center">
  <h1 align="center">💸 FinFlow</h1>
  <p align="center">
    A modern personal finance visualization platform<br/>
    Built with a production-first fintech mindset
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Docker-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

<p align="center">
  <!-- <img src="https://img.shields.io/github/stars/your-username/finflow?style=social" />
  <img src="https://img.shields.io/github/issues/your-username/finflow" />
  <img src="https://img.shields.io/github/license/your-username/finflow" /> -->
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Utility--First-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Flyway-Database_Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white" />
</p>

---

## ✨ Overview

**FinFlow** is a portfolio-grade personal finance platform designed to help users **understand, track, and analyze money flow across multiple accounts**.

Unlike many budgeting apps that misclassify internal transfers as spending, FinFlow models **financial reality correctly** by treating transactions as explicit money flows.

This project emphasizes:
- correct financial semantics
- clean backend architecture
- realistic system design decisions
- deployability and maintainability

---

## 🧠 Key Design Principles

- **Money flow over UI categories**  
  Transactions represent *movement of value*, not labels.

- **Correct handling of transfers**  
  Internal account transfers do not count as spending.

- **Backend-driven correctness**  
  Business rules are enforced at the backend, not the UI.

- **Production-aware development**  
  Dockerized database, Flyway migrations, clean mono-repo layout.

---

## 🏗 Repository Structure

```text
finflow/
├── backend/        # Spring Boot backend service
├── frontend/       # React + Vite frontend
├── docs/           # Architecture & design notes
├── docker-compose.yml
└── README.md
```

---

## 🛠 Tech Stack

### Backend

- Java 21+
- Spring Boot
- Spring Data JPA (Hibernate)
- PostgreSQL
- MapStruct
- Flyway
- Maven

### Frontend

- React
- Vite
- Tailwind CSS
- TypeScript

### Tooling & Infrastructure

- Docker & Docker Compose
- GitHub (mono-repo)
- IntelliJ IDEA (backend)
- Cursor (frontend)

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- Docker
- Git

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/finflow.git
cd finflow
```

### 2️⃣ Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 3️⃣ Run Backend

```bash
cd finflow-backend
./mvnw spring-boot:run
```

Backend runs at:

**http://localhost:8080**

### 4️⃣ Run Frontend

```bash
cd finflow-frontend
npm install
npm run dev
```

Frontend runs at:

**http://localhost:5173**

---

## 🔐 Environment Configuration

### Backend

Spring profiles:

- `application.yml`

Docker profile:

- `docker-compose.yml`

### Frontend

Vite environment variables:

- `VITE_API_BASE_URL=http://localhost:8080`

---

## 📍 Current Status

- ✅ Mono-repo structure
- ✅ Backend bootstrapped
- ✅ Frontend bootstrapped
- ✅ User, Account, Transaction domain models
- ✅ Accurate transfer modeling
- ✅ Authentication & authorization
- ✅ Analytics & dashboards
- ✅ Deployment pipeline

---

## 🗺 Roadmap

- [ ] Core domain modeling
- [ ] Money flow analytics
- [ ] Secure auth (JWT / OAuth)
- [ ] Data visualization
- [ ] Cloud deployment
- [ ] Public demo

---

## 🎯 Why FinFlow Exists

**FinFlow is not a tutorial project.**

It is built to demonstrate:

- real-world backend engineering skills
- financial domain understanding
- clean system design
- readiness for production environments

This project is intended as a **fintech portfolio project** and **learning platform**.

---

📘 **Development workflow**: see [Feature Development Workflow](docs/Feature_Development_Workflow.md)
