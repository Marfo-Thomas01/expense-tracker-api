# 💰 Expense Tracker API

A RESTful API for tracking personal expenses with full CRUD operations, filtering, and summary statistics.

## 🚀 Features

- ✅ Create, Read, Update, Delete (CRUD) expenses
- ✅ Filter by category, date range, amount range
- ✅ Pagination support
- ✅ Input validation & error handling
- ✅ Expense summary by category
- ✅ MongoDB database with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Postman or Thunder Client (for testing)

## ⚙️ Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/expense-tracker-api.git
cd expense-tracker-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# Start server
npm run dev