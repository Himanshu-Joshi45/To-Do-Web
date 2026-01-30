#  Project Title: To-Do Web App

A **full-stack To-Do Web Application** built to manage tasks effectively. Users can log in, create boards, add todos, and perform CRUD operations on boards and tasks.

---

## ✨ **Objective**

The app allows users to:  

- Log in using email  
- Create boards  
- Create and manage todos within boards  
- Perform **CRUD operations** on boards and todos  

---

## **Tech Stack**

| Layer       | Technology |
|------------|------------|
| Frontend   | React.js |
| Backend    | Node.js (Express.js) |
| Database   | MongoDB |
| Authentication | JWT-based manual authentication |


---


### **Installation**


1. Clone the repository:
   ```bash
   git clone https://github.com/Himanshu-Joshi45/To-Do-Web.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
    VITE_API_URL=http://localhost:5000
    MONGO_URI=mongodb+srv://HimanshuJoshi:941050@cluster0.3oaxi1v.mongodb.net/?appName=Cluster0
    JWT_SECRET=mysecretkey123
  
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.


## ✨ **Features**

- **User Authentication**: Register and login securely using email.  
- **Board Management**: Create, update, delete boards.  
- **Todo Management**: Add, edit, delete, and mark todos as completed inside boards.  
- **Responsive UI**: Works on desktop and mobile devices.  
- **Secure API**: JWT-based authentication protects backend routes.  

---
## **Screenshots**

### Login Page

![Login Page](screenshots/Login.png)

### Register Page

![Todos](screenshots/Register.png)

### Dashboard

![Dashboard](screenshots/Dashboard.png)

### Todos Page

![Todos](screenshots/todo3.png)


## 👨‍💻 Developer

Himanshu Joshi
- [GitHub](https://github.com/Himanshu-Joshi45)

