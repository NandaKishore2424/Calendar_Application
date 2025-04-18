# Calendar+ | A Comprehensive Time & Goals Management Application

📅 **Project Overview**

Calendar+ is a full-stack web application for managing your schedule, goals, and tasks in one unified interface. This modern productivity tool combines calendar functionality with goal-setting and task management, making it perfect for personal and professional use.


# ✨ Features

## 📆 Calendar Management

### Multiple Calendar Views  
Switch between day, week, month, and year views

### Event Creation & Management  
Create, view, and delete events with ease

### Categorized Events  
Organize events by categories (work, exercise, eating, relax, family, social)

### Visual Time Blocks  
Events display as color-coded blocks based on category

### Drag & Drop Support  
Move events by dragging them to new time slots

## 🎯 Goal Tracking

### Custom Goals  
Create personal or professional goals with custom names

### Color Coding  
Assign colors to goals for visual organization

### Progress Tracking  
Track progress through associated tasks

## ✅ Task Management

### Goal-based Tasks  
Create tasks associated with specific goals

### Drag & Drop to Calendar  
Convert tasks to calendar events by dragging

### Visual Organization  
Tasks inherit goal colors for consistent visual mapping

## 🛠️ Additional Features

### Responsive Design  
Works across desktop and mobile devices

### Real-time Updates  
See changes immediately after creating or deleting items

### Intuitive Interface  
Clean, modern UI with smooth animations

# 🧰 Technology Stack

## Frontend

- React 19: Component-based UI development with the latest React version  
- Redux Toolkit: State management with Redux Toolkit for efficient workflows  
- Axios: Promise-based HTTP client for API communication  
- JavaScript (ES6+): Modern JavaScript syntax and features  
- CSS-in-JS: Inline styling for component-specific design  

## Backend

- Node.js: JavaScript runtime environment  
- Express: Web application framework for building APIs  
- MongoDB: NoSQL database for flexible data storage  
- Mongoose: MongoDB object modeling for Node.js  

## Deployment

- Vercel: Hosting platform for both frontend and backend  
- MongoDB Atlas: Cloud database service for MongoDB  

## Data Models

- **Event:** Calendar events with title, category, time slots, and color  
- **Goal:** User-defined goals with name and color  
- **Task:** Items associated with goals, inheriting goal properties  

# 🚀 Getting Started

## Prerequisites

- Node.js (v16+)  
- npm or yarn  
- MongoDB (local installation or Atlas account)  

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/calendar-plus.git  
cd calendar-plus

```


### Backend Setup

```bash
cd backend  
npm install
```
### Create a .env file with the following:
```bash
MONGODB_URI=your_mongodb_connection_string  
PORT=5000  
```
```bash
npm run dev  
```
### Frontend Setup
```bash
cd frontend  
npm install  
npm start  
```
## 👥 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


