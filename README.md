# ⚡ TaskFlow — AI-Powered Task Management Platform

TaskFlow is a modern, responsive full-stack task management web application built to streamline personal productivity with real-time AI context analysis. Features include custom task management, dynamic stat dashboards, theme switching, JWT authentication, and an integrated task-aware AI assistant ("Jarvis").

![TaskFlow App](https://img.shields.io/badge/Status-Live-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Backend-Django%20REST%20Framework-092E20?style=for-the-badge&logo=django)
![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-336791?style=for-the-badge&logo=postgresql)

---

## 🌐 Live Deployment & Links

* **Live Web Application:** [https://ai-powered-taskmanager.vercel.app](https://ai-powered-taskmanager.vercel.app)
* **Backend API Base URL:** [https://aipowered-taskmanager.onrender.com](https://aipowered-taskmanager.onrender.com)
* **GitHub Repository:** [https://github.com/Harsh-p15/AIPowered_Taskmanager](https://github.com/Harsh-p15/AIPowered_Taskmanager)

---

## ✨ Features

* **🔐 Authentication & Security:** User registration and sign-in powered by Django REST Framework & SimpleJWT.
* **📋 Smart Task Management:** Full CRUD operations for daily tasks with status tracking (`In Progress`, `Halted`, `Completed`) and due date assignment.
* **🤖 Jarvis AI Task Assistant:** Integrated AI drawer powered by Groq LLM API. Jarvis reads individual task context to help break down, plan, and analyze project goals.
* **📱 Fully Responsive Design:** Optimized for mobile, tablet, and desktop screens with dynamic viewport height support (`dvh`) and custom mobile drawer navigation.
* **🌙 Dark & Light Mode:** Built-in persistent theme toggling using Tailwind CSS and `localStorage`.
* **📊 Dashboard Analytics:** Real-time metrics breakdown calculating total, active, paused, and completed assignments.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **HTTP Client:** Axios
* **Hosting:** Vercel

### Backend
* **Framework:** Django 6.0 & Django REST Framework
* **Authentication:** SimpleJWT (JSON Web Tokens)
* **LLM Engine:** Groq API Cloud Client
* **Database:** Cloud-hosted Neon PostgreSQL (`psycopg2-binary`, `dj-database-url`)
* **WSGI Server:** Gunicorn
* **Hosting:** Render

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Python 3.12+
* Node.js 18+
* Git

### 2. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/Harsh-p15/AIPowered_Taskmanager.git](https://github.com/Harsh-p15/AIPowered_Taskmanager.git)
cd AIPowered_Taskmanager

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables (.env in project root)
# DATABASE_URL=postgresql://user:pass@host/dbname
# SECRET_KEY=your_django_secret_key
# DEBUG=True
# GROQ_API_KEY=your_groq_api_key

# Run database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
