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
## 📸 Application Screenshots

### 🏠 Dashboard

The dashboard provides an overview of placement activities, upcoming placement
drives, active scheduling conflicts, and registered students.

![Dashboard](screenshots/Dashboard.png)

---

### 📅 Placement Drive

Placement officers can create and manage placement drives with company,
job role, date, time, venue, package, and eligible students.

![Placement Drive](screenshots/drive.png)

---

### 📅 Multiple Placement Drives

The system displays scheduled placement drives and their details in a
centralized interface.

![Placement Drives](screenshots/drive2.png)

---

### ⚠️ Conflict Detection

The system identifies overlapping placement drives and highlights potential
scheduling conflicts involving students.

![Conflict Detection](screenshots/conflicts.png)

---

### 🔍 Schedule Checker

The schedule checker allows the placement officer to check a proposed
placement schedule and find an available alternative slot when a conflict
is detected.

![Schedule Checker](screenshots/schedule.png)

---

### 🤖 AI-Powered Analysis

The system uses AI to analyze the detected scheduling conflict and provide
a concise recommendation based on the backend-calculated information.

![AI Analysis](screenshots/AI.png)
![AI Analysis](screenshots/Ai.png)
