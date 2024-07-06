# MyHealth-WebApp-Backend
MyHealth-WebApp-Backend is a Node.js and Express-powered backend for a healthcare management application. It handles user authentication, profile management, appointments, and medical records. Built for simplicity and functionality, it supports basic healthcare operations for doctors and patients.



## Aim

 It aims to learn and understand how to create a simple and user-friendly platform for managing medical appointments, patient records, and doctor consultations. Built using modern web technologies like Node.js, Express, and MongoDB, the application leverages a robust architecture to ensure scalability, security, and performance.




## Project Structure Overview

### Models
- **user.js:** Handles user sign-in and sign-up.
- **doctor.js:** Manages doctor-specific data.
- **patient.js:** Manages patient-specific data.
- **report.js:** Manages medical reports.

### Controllers
- **doctor.js:** Contains logic for doctor-related routes.
- **patient.js:** Contains logic for patient-related routes.

### Routes
- **doctor.js:** Defines routes for doctor-related actions.
- **staticRoute.js:** Manages static content routes.
- **patient.js:** Defines routes for patient-related actions.

### Middleware
- **auth.js:** Middleware for user authentication.

### Public
- **images:** Folder for storing images.
- **uploads:** Folder for storing uploaded files.
- **public:** Serves as the static root folder.

### Views
- **doctors:** Contains EJS templates for doctors (doctor_dashboard.ejs, doctor_login.ejs, doctor_signup.ejs).
- **patients:** Contains EJS templates for patients (patient_dashboard.ejs, patient_login.ejs, patient_signup.ejs).
- **home.ejs:** Template for the home page.

### Services
- **auth.js:** Service for authentication-related operations.
- **imageupload.js:** Service for handling image uploads.

### Others
- **connect.js:** Handles MongoDB connection.
- **index.js:** Main file that initializes the Express app and sets up routes and middleware.

## Technologies (Dependencies) Used

- **Mongoose:** Used for defining schemas and interacting with MongoDB. It simplifies data modeling and provides a straightforward way to define and interact with the database.
- **Express:** The web framework used for building the server. It facilitates routing, middleware management, and response handling.
- **Node.js:** The runtime environment for executing JavaScript on the server side. It provides an event-driven architecture suitable for building scalable network applications.
- **Multer:** Used for handling multipart/form-data, primarily for uploading files. It's integrated to manage profile image uploads.
- **Path:** The path module is used for working with file and directory paths. It helps in handling file system paths and ensures compatibility across different operating systems.
- **And others...**

## Detailed Description

### Models

- **user.js:** Defines the schema for users, including fields for name, email, password, and profile image. It also handles validation and uniqueness constraints for user sign-up and sign-in processes.
- **doctor.js:** Defines the schema for doctors, storing information specific to doctors, such as specialty, experience, and associated reports.
- **patient.js:** Defines the schema for patients, storing patient-specific information and associated medical history or reports.
- **report.js:** Manages medical reports, associating them with either doctors or patients as needed.

### Controllers

- **doctor.js:** Contains the logic for handling doctor-related actions such as login, signup, and viewing the dashboard. It interacts with the doctor model and manages the flow of data between the model and the views.
- **patient.js:** Contains the logic for handling patient-related actions such as login, signup, and viewing the dashboard. It interacts with the patient model and manages the flow of data between the model and the views.

### Routes

- **doctor.js:** Defines the routes for doctor-related actions, mapping URLs to the appropriate controller functions.
- **staticRoute.js:** Manages routes for static content, ensuring that static files such as images and stylesheets are served correctly.
- **patient.js:** Defines the routes for patient-related actions, mapping URLs to the appropriate controller functions.

### Middleware

- **auth.js:** This middleware handles authentication. It checks if a user is logged in before allowing access to certain routes, ensuring that only authenticated users can access protected resources.

### Public

- **images:** Stores static image files used across the application.
- **uploads:** Stores files uploaded by users, such as profile pictures.
- **stylesheets:** Stores all necessary CSS files.

### Views

- **doctors:** Contains EJS templates specific to doctors, including dashboard, login, and signup pages.
- **patients:** Contains EJS templates specific to patients, including dashboard, login, and signup pages.
- **home.ejs:** The template for the home page, providing a general overview and entry point to the application.

### Services

- **auth.js:** Handles authentication-related operations such as hashing passwords and verifying user credentials.
- **imageupload.js:** Manages image upload functionality, including saving images to the server and updating user profiles with uploaded images.

### Others

- **connect.js:** Handles the connection to the MongoDB database using Mongoose. It manages the connection lifecycle, including connecting, error handling, and disconnection.
- **index.js:** The main entry point of the application. It sets up the Express app, connects to MongoDB, defines middleware, sets up routes, and starts the server.


## Conclusion

The MyHealth web portal is a simple web application that successfully demonstrates the integration of modern web technologies to create a functional healthcare management system. With its lightly secure authentication, user-friendly dashboards, and efficient handling of medical records and appointments, the project serves as a robust foundation for further development and enhancement in digital healthcare solutions. The use of Node.js, Express, and MongoDB ensures scalability and performance, making it a valuable tool for both doctors and patients.

## Notes

I have used EJS as the template engine and have not handled errors very perfectly. I have concentrated on the backend part more than the frontend, as it is primarily a backend project, and rendered all files on the server (SSR). I have used some middleware (to generate cookies and restrict the web app for users who do not have an account in the MyHealth portal) to authenticate the user.
