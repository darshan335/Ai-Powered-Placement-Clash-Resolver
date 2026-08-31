# 🚀 AI-Powered Placement Clash Resolver

A full-stack placement management system designed to help colleges manage students, companies, placement drives, eligibility criteria, scheduling conflicts, and AI-assisted placement analysis.

## 📌 Overview

Placement Clash Resolver is a web-based application that simplifies placement drive management and helps identify scheduling conflicts between students and placement drives.

The system provides a centralized platform for managing placement data and offers tools for conflict detection, schedule checking, and AI-assisted analysis.

## ✨ Features

- 👨‍🎓 Student Management
  - Add students
  - Edit student information
  - Delete students
  - Track CGPA and academic details

- 🏢 Company Management
  - Manage recruiting companies
  - Store company and job information
  - Manage placement packages

- 💼 Placement Drive Management
  - Create placement drives
  - Edit existing drives
  - Delete drives
  - Manage drive schedules

- ⚠️ Conflict Detection
  - Identify placement scheduling conflicts
  - Detect overlapping placement drives
  - Display affected students

- 📅 Schedule Checker
  - Check proposed placement schedules
  - Identify scheduling issues
  - Assist in finding suitable schedules

- 🤖 AI-Assisted Analysis
  - Analyze placement conflicts
  - Generate recommendations
  - Assist administrators in resolving scheduling issues

- 📊 Dashboard
  - Placement statistics
  - Student statistics
  - Drive information
  - Conflict overview

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios

### Backend

- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

### Database

- MySQL

### AI

- Spring AI
- Ollama
- Llama 3.2

## 🏗️ Project Structure

```text
Ai-Powered-Placement-Clash-Resolver/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
# 📸 Application Screenshots

## Dashboard

The dashboard provides an overview of placement activities, upcoming drives,
registered students, and scheduling conflicts.

![Dashboard](screenshots/Dashboard.png)

---

## Student Management

The student management section allows placement administrators to manage
student records and placement eligibility.

![Students](screenshots/students.png)

---

## Company Management

Companies can be managed and associated with placement drives.

![Companies](screenshots/companies.png)

---

## Placement Drive Management

Placement officers can create and manage placement drives with company,
job role, date, time, venue, package, and eligible students.

![Placement Drives](screenshots/drive.png)

---

## Conflict Detection

The system detects overlapping placement drives and identifies potential
scheduling conflicts.

![Conflict Detection](screenshots/conflicts.png)

---

## Schedule Checker

The schedule checker analyzes a proposed placement schedule and provides
available alternative slots when conflicts occur.

![Schedule Checker](screenshots/schedule.png)

---

## AI-Powered Analysis

Google Gemini analyzes the backend-calculated scheduling information and
generates a concise recommendation and explanation.

![AI Analysis](screenshots/Ai.png)
