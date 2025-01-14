Smart Agriculture Management System
This project aims to provide an intelligent solution for managing agricultural activities through the use of modern technologies such as the MERN stack (MongoDB, Express.js, React, and Node.js). The Smart Agriculture Management System allows farmers, agricultural professionals, and researchers to monitor and manage various aspects of agricultural practices effectively.

Table of Contents

1. Project Overview
2. Technologies Used
3. Features
4. Installation
5. Usage
6. API Documentation

Project Overview
The Smart Agriculture Management System provides an efficient platform for monitoring and managing key agricultural activities. The system is designed to help farmers make data-driven decisions, ensuring better crop yield, resource optimization, and sustainability. Key functionalities include:

Crop monitoring and management
User management for farmers and administrators

Technologies Used
MongoDB: NoSQL database used for storing user data, crop details, weather data, and more.
Express.js: Web application framework for building the server-side logic of the application.
React: Frontend JavaScript library used to build interactive user interfaces.
Node.js: JavaScript runtime environment for running the backend services.

Features

1. User Authentication and Authorization
   Farmers and administrators can securely log in and manage their accounts.
   Role-based access control ensures the right permissions for each user.
2. Crop Management
   Farmers can add or delete details about their crops.
3. Data Analytics and Reporting
   Dashboards to visualize crop performance, weather patterns, and resource utilization.
   Helps farmers make informed decisions on crop management and resource allocation.
4. Visual Graphs and Charts for Yield Prediction and Crop Health
   A predictive model based on historical data to estimate crop yield.
   Helps farmers plan their harvest and manage resources accordingly.

Installation
To set up the Smart Agriculture Management System on your local machine, follow the steps below:

Clone the repository.
Install dependencies:

Navigate to the backend folder and install the necessary dependencies.
Navigate to the frontend folder and install the necessary dependencies.

Set up the environment:

Create a .env file in the backend folder and add your environment variables:
makefile
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Run the application:

Start the backend server:
Copy code
nodemon server.js
Start the frontend server:
Copy code
npm run dev
The application will be accessible on http://localhost:3000.


**New users can sign up but new admin cant be created so for that you have to manually go to your mongo db and change the role to admin or on the live vercel link you can use the main admin ID = varunseemar1@gmail.com pass = 123.
**Dont delete the admin account otherwise you cant access the admin panel anymore on the vercel link.
