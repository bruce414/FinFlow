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

# 💸 FinFlow

**FinFlow** is a full-stack personal finance management platform designed to help users manage accounts, track transactions, categorize spending, and understand their financial activity through a secure and scalable system.

It is more than just a basic CRUD demo. FinFlow is being built with a **production-minded backend architecture**, **strong domain modelling**, and a long-term roadmap toward **bank integrations, transaction intelligence, and fintech-grade system design**.

---

## ✨ Overview

FinFlow allows users to:

- 👤 register and authenticate securely
- 🏦 manage financial accounts
- 💳 record and view transactions
- 🗂️ categorize spending activity
- 📊 monitor financial data through a dashboard
- 🚀 build toward a more intelligent and scalable personal finance experience

The long-term vision is to evolve FinFlow from an MVP finance tracker into a more robust fintech-style platform with features such as:

- 🔗 bank account connectivity
- 📥 CSV/import-based transaction ingestion
- 🧠 rule-based and intelligent transaction categorization
- 📈 financial insights and forecasting
- 🧾 stronger financial data integrity patterns
- 🏗️ infrastructure that can support more advanced accounting-style workflows in the future

---

## 🎯 Why I Built This

I built FinFlow to go beyond a typical portfolio project.

The goal was not just to create a working finance app, but to practice how real backend systems are designed: domain modelling, secure authentication flows, API design, database migrations, data integrity, and scalable architecture decisions.

This project reflects my interest in the intersection of:

- 💻 software engineering
- 💰 financial systems
- 🧩 product-oriented backend design
- 🏛️ fintech architecture

---

## 🛠️ Current MVP Scope

The current MVP focuses on the core foundations of a personal finance platform.

### ✅ Implemented / In Progress

- 🔐 User registration and login
- 🛡️ Session-based authentication with Spring Security
- 🌐 Google OAuth2 / OIDC login flow
- 🍪 CSRF-protected authenticated API flows
- 👤 User profile and identity handling
- 🏦 Account management
- 💳 Transaction management
- 🗂️ Category support
- 📊 Dashboard-oriented backend design
- 📘 OpenAPI / Swagger UI for API testing
- 🗄️ Flyway-managed PostgreSQL schema evolution
- 🐳 Dockerized local PostgreSQL environment

---

## 🌟 Core Features

### 🔐 Authentication & Security
- Email/password registration and login
- Google OAuth2 login
- Session-based authentication
- CSRF protection for state-changing requests
- Secure endpoint separation for public and authenticated APIs

### 🏦 Account Management
- Create and manage financial accounts
- Support for different account types
- Account ownership linked to authenticated users
- Clear foundation for future manual/imported/open-banking account origins

### 💳 Transaction Management
- Record and retrieve transactions
- Associate transactions with accounts
- Support for transaction categorization
- Foundation for future rules-based and imported transaction flows

### 🗂️ Categories
- User-oriented transaction categories
- Support for structured transaction classification
- Designed to support future system-defined and user-defined category strategies

### 📊 Dashboard Direction
The backend is being designed to support dashboard use cases such as:

- 💼 wallet/account summary
- 🕒 recent transactions
- 📉 monthly spending visibility
- 💰 savings overview
- 🔮 future forecasting and insight widgets

---

## 🧰 Tech Stack

### Backend
- ☕ **Java**
- 🍃 **Spring Boot**
- 🔐 **Spring Security**
- 🗃️ **Spring Data JPA / Hibernate**
- 🛫 **Flyway**
- 🐘 **PostgreSQL**

### Frontend
- ⚛️ **React**
- 🔷 **TypeScript**
- ⚡ **Vite**
- 🎨 **Tailwind CSS**

### Tooling / Dev Environment
- 🐳 **Docker Compose**
- 📘 **Swagger / OpenAPI**
- 🔧 **Maven**

---

## 🏗️ Architecture Approach

FinFlow is being developed with an emphasis on clean backend fundamentals.

### 📌 Design Priorities
- clear domain boundaries
- production-minded entity modelling
- explicit database migrations
- secure auth flows
- scalable API design
- future support for fintech-style integrations

### 🚀 Architectural Direction
Rather than treating the app as a simple CRUD prototype, the backend is being structured to support future evolution such as:

- 🔗 external financial data ingestion
- 🏦 multiple account origins
- 🧾 stricter financial invariants
- 🧠 richer transaction classification
- 📈 insights and forecasting modules
- 🏛️ more advanced finance/accounting-oriented behaviour

---

## 🔒 Security Notes

Security is a core part of the project, not an afterthought.

Current backend security includes:

- authenticated session handling
- Spring Security integration
- CSRF protection for modifying requests
- protected authenticated endpoints
- OAuth2/OIDC login support
- separation between public auth endpoints and protected user resources

---

## 📘 API Documentation

Swagger UI is available for testing and exploring the API.

Typical local endpoints:

- `/swagger-ui.html`
- `/swagger-ui/`
- `/v3/api-docs`

---

## 🚀 Local Development

### ✅ Prerequisites

Make sure you have installed:

- Java
- Maven
- Docker
- Docker Compose
- Node.js / npm

---

## ⚙️ Backend Setup

### 1️⃣ Start PostgreSQL with Docker Compose

```bash
docker compose up -d