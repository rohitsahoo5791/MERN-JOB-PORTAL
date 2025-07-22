# 💼 MERN Job Portal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A comprehensive full-stack job portal built with the MERN stack (MongoDB, Express, React, Node.js). This application features role-based authentication for recruiters and job seekers, allowing recruiters to post and manage jobs, and job seekers to manage their profiles, upload resumes, and more.

---

## ✨ Key Features

-   **Role-Based Authentication**: Separate login and dashboard experiences for Recruiters and Job Seekers.
-   **JWT Security**: Secure user sessions and protected API routes using JSON Web Tokens.
-   **Full Job Management (CRUD)**: Recruiters can Create, Read, Update, and Delete their job postings.
-   **Dynamic Filtering**: Public job board with real-time filtering by job title, location, and category.
-   **Centralized State Management**: Robust and predictable state management using Redux Toolkit.
-   **Full Profile Management**: Users can update their name, email, and profile picture.
-   **Cloud-Based File Uploads**: Job seekers can upload and manage their PDF resumes, with file storage handled by Cloudinary.

---

## 📸 Application Screenshots

### 1. Home Page & Job Filtering
The public-facing landing page where anyone can view and filter the latest job listings.

| Landing Page                                   | Dynamic Filtering in Action                              |
| ---------------------------------------------- | -------------------------------------------------------- |
| ![Home Page](./assets/Screenshot%202025-07-22%20163036.png) | ![Filter Functionality](./assets/Screenshot%202025-07-22%20163122.png) |

---

### 2. Recruiter Experience
From login to a feature-rich dashboard, recruiters have all the tools they need to manage job postings.

| Recruiter Login Page                                 | Recruiter Dashboard & Job Management                       |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| ![Recruiter Login](./assets/Screenshot%202025-07-22%20163152.png) | ![Recruiter Dashboard](./assets/Screenshot%202025-07-22%20163218.png) |

---

### 3. Job Seeker Experience
A personalized dashboard for job seekers to manage their professional profile and resume.

| Job Seeker Login Page                                  | Job Seeker Dashboard & Resume Management                 |
| ------------------------------------------------------ | -------------------------------------------------------- |
| ![Job Seeker Login](./assets/Screenshot%202025-07-22%20163422.png) | ![Job Seeker Dashboard](./assets/Screenshot%202025-07-22%20163441.png) |

---

### 4. Profile & Content Management
Dedicated pages for users to edit their jobs and personal information, accessible to both roles.

| Job Editing Page (Recruiter)                             | Universal Profile Update Page                          |
| -------------------------------------------------------- | -------------------------------------------------------- |
| ![Edit Job Page](./assets/Screenshot%202025-07-22%20163520.png) | ![Update Profile Page](./assets/Screenshot%202025-07-22%20163557.png) |


---

## 🛠️ Tech Stack

-   **💻 Frontend:** React.js, Redux Toolkit, React Bootstrap, Axios
-   **⚙️ Backend:** Node.js, Express.js
-   **💾 Database:** MongoDB with Mongoose
-   **🔒 Authentication:** JWT (JSON Web Tokens), bcrypt
-   **☁️ File Storage:** Cloudinary for profile pictures and resumes
-   **📄 File Handling:** Multer for handling `multipart/form-data`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   MongoDB (local instance or a cloud service like MongoDB Atlas)
-   A Cloudinary account for file uploads

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory and add the following variables:
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=7d
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Start the backend server
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    ```bash
    # Navigate to the client directory from the root
    cd ../client

    # Install dependencies
    npm install

    # Start the React development server
    npm start
    ```
    The frontend will open and run on `http://localhost:5173` (or another port if 3000/5173 is busy).
    
