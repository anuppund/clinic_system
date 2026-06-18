# ClinicIQ - Clinic Appointment Management System 🏥

A complete, production-ready Full-Stack Clinic Management System built to digitize clinic operations. It provides a secure, role-based platform for Administrators, Doctors, and Patients to manage appointments, medical records, and clinic statistics.

## ✨ Features

### 🔐 Security & Access Control
* **JWT Authentication:** Secure login and session management.
* **Role-Based Access Control (RBAC):** Strict boundaries between `Admin`, `Doctor`, and `Patient` roles.
* **Ownership Validation (OBAC):** Patients can only access their own appointments and medical records.

### 👥 User Roles
* **Admin:** Manage all users, create doctor profiles, monitor dashboard statistics, and view automated reminders.
* **Doctor:** View assigned appointments and securely create/manage patient medical records and prescriptions.
* **Patient:** Browse available doctors, book appointments, cancel visits, and view personal medical history.

### 📅 Core Functionalities
* **Smart Appointment Booking:** Prevents double-booking for doctors at the same date and time.
* **Medical Records Archive:** Persistent tracking of patient diagnosis, prescriptions, and clinical notes.
* **Automated Reminders:** Generates a daily summary of tomorrow's appointments.
* **Admin Dashboard:** Live statistics and system overview.

---

## 🛠️ Technology Stack

**Backend:**
* [FastAPI](https://fastapi.tiangolo.com/) - High-performance Python web framework
* [SQLAlchemy](https://www.sqlalchemy.org/) - ORM for database interactions
* [Supabase (PostgreSQL)](https://supabase.com/) - Cloud database
* Passlib (Argon2) & Python-JOSE - Password hashing and JWT token generation

**Frontend:**
* [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) - Lightning-fast frontend tooling
* [TypeScript](https://www.typescriptlang.org/) - Strict type checking
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
* [React Query (TanStack)](https://tanstack.com/query/latest) - Server state and cache management
* [Zustand](https://github.com/pmndrs/zustand) - Lightweight global state management
* [React Router DOM](https://reactrouter.com/) - Protected routing and navigation

---

## 🚀 Local Development Setup

### Prerequisites
* Python 3.9+
* Node.js 18+
* A free [Supabase](https://supabase.com/) account (for the database)

### 1. Database Configuration (Supabase)
1. Create a new project in Supabase.
2. Go to Project Settings -> Database -> Connection String (URI).
3. Copy the **Direct Connection** URL.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd clinic_system/backend