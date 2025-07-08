# recipe-finder-app

# 🍽️ Recipe Finder App

A full-stack web application to search and manage recipes using Node.js, Express, and MongoDB. Built with user authentication, secure access using JWT, and environment-based configuration.

## 🚀 Live Demo

> ⚠️ Deployment coming soon  
> 🔧 Local setup instructions below

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **Environment Config**: dotenv
- **Deployment**: Render (in progress), GitHub Pages (frontend)

---

## ✨ Features

- 🔍 Search for recipes
- 📝 Create, Read, Update, and Delete (CRUD) recipes
- 🔐 Secure user authentication (JWT-based)
- 🌐 Environment variable support
- 📦 MongoDB integration with Mongoose

---

## 📁 Project Structure

// how to run it locally

1. clone the repository 
git clone https://github.com/your-username/recipe-finder-app.git
cd recipe-finder-app

2. install dependencies
npm install

3. setup environment variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. start the server
node server.js
Or, if you're using nodemon for development:
npx nodemon server.js

visit the app 
Go to http://localhost:5000 to use the app.
