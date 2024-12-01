# GrowthX - Assignment Submission Portal  

The **Assignment Submission Portal** is a backend system developed using Node.js, Express, and MongoDB. This portal streamlines assignment management for users and admins. Users can register, log in, and upload assignments for admins to review. Admins have the ability to view, accept, or reject assignments. With a secure and organized structure, the system provides clear API endpoints for smooth operations, supports efficient workflows, and facilitates testing with tools like Postman.  

#### **Deployed Link:**  
_Provide the deployed link here_  

#### **Postman Collection:**  
_Provide the link to the Postman collection here_  

## **Features**  
- User registration and login functionality.  
- Admin registration and login functionality.  
- Users can upload assignments for admin review.  
- Admins can view, accept, or reject assignments.  
- Secure database integration with MongoDB.  
- Simple and clear API structure for easy integration and testing.  
- Organized codebase with modular components.  


## **Tech Stack Used**  

This project utilizes the following technologies and tools:  

### **Languages & Frameworks**  
- **Node.js** 🟢: Server-side JavaScript runtime.  
- **Express.js** 🚀: Web application framework for Node.js.  
- **MongoDB** 🍃: NoSQL database for scalable data storage.  
- **JavaScript** ✨: Programming language used throughout.  

### **Libraries & Packages**  
- **bcryptjs** 🔑: Password hashing for secure authentication.  
- **cookie-parser** 🍪: Middleware for parsing cookies in requests.  
- **cors** 🌐: Middleware for enabling Cross-Origin Resource Sharing.  
- **dotenv** 🔐: Environment variable management.  
- **joi** ✅: Data validation library.  
- **jsonwebtoken** 🔒: JWT-based authentication.  
- **mongoose** 📚: Object Data Modeling (ODM) for MongoDB.  

### **Development Tools**  
- **Nodemon** 🔄: Automatically restarts the server during development.  
- **Postman** 📬: API testing and documentation.  

## **API Endpoints**

#### User Routes  

| **Method** | **Endpoint**        | **Description**                  | **Access Level** |
|------------|---------------------|----------------------------------|------------------|
| **POST**   | `/api/user/register` | Register a new user              | Public           |
| **POST**   | `/api/user/login`    | User login                       | Public           |
| **POST**   | `/api/user/upload`   | Upload an assignment             | User Only        |
| **GET**    | `/api/user/admins`   | Fetch all admins                 | User Only        |

---

#### Admin Routes  

| **Method** | **Endpoint**                        | **Description**                     | **Access Level** |
|------------|-------------------------------------|-------------------------------------|------------------|
| **POST**   | `/api/admin/register`               | Register a new admin                | Public           |
| **POST**   | `/api/admin/login`                  | Admin login                         | Public           |
| **GET**    | `/api/admin/assignments`            | View assignments tagged to the admin| Admin Only       |
| **POST**   | `/api/admin/assignments/:id/accept` | Accept an assignment                | Admin Only       |
| **POST**   | `/api/admin/assignments/:id/reject` | Reject an assignment                | Admin Only       |

### **Database Schema Image**
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1733040135/Common/growthx-er_fglpbj.png"/>

### **Installation**
To run the server side of the GrowthX Assignment Submission Portal locally, follow these steps:

1. Clone the repository: `git clone https://github.com/raushan-kumar7/growthx-assignment-submission-portal.git`
2. Install the dependencies: `npm install`
3. Set the enironment variables: `cp .env.example .env` and then edit `.env` file with your database credentials and other necessary configurations.
4. Start the server in development mode: `npm run dev`
5. Alternatively, to start the server in production mode: `npm run start`
6. The server will run at: `http://localhost:3600`