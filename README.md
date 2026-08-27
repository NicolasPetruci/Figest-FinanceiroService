# 💳 Figest-FinanceiroService

> ⚠️ **Educational Project Notice**: This service is part of the **Figest** financial ecosystem, created for study, research, and testing purposes to demonstrate NestJS transactional financial domain logic and Prisma v7.

---

## 📌 Overview

**Figest-FinanceiroService** is the core accounting engine of the platform. It manages bank accounts, income/expense transactions, custom categories, monthly budgets, and calculates balance summaries.

---

## 🛠️ Tech Stack
* **Framework:** NestJS + TypeScript
* **Database ORM:** Prisma v7 (`@prisma/adapter-pg` driver adapter)
* **Database:** PostgreSQL (Schema: `financeiro`)
* **Transaction Safety:** Atomic Prisma `$transaction` operations for balance updates

---

## 📊 Core Features & API Endpoints

| Domain | Method | Endpoint | Description |
|---|---|---|---|
| **Transactions** | `GET` | `/transactions` | List user transactions |
| | `POST` | `/transactions` | Create transaction & update account balance |
| | `GET` | `/transactions/summary` | Get monthly balance, income, expenses & trends |
| **Accounts** | `GET` | `/accounts` | List user bank accounts & total balance |
| | `POST` | `/accounts` | Create new bank account |
| **Categories** | `GET` | `/categories` | List expense & income categories |
| | `POST` | `/categories` | Create custom category with color & icon |

---

## 🚀 Running Locally

```bash
npm install
npx prisma generate
npm run build
npm run start:prod
```
