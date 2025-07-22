# 💼 MERN Job Portal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A comprehensive full-stack job portal built with the MERN stack (MongoDB, Express, React, Node.js). This application features role-based authentication for recruiters and job seekers, allowing recruiters to post and manage jobs, and job seekers to manage their profiles, upload resumes, and (in future versions) apply for jobs.

---

## ✨ Key Features

-   **Role-Based Authentication**: Separate login and dashboard experiences for Recruiters and Job Seekers.
-   **JWT Security**: Secure user sessions and protected API routes using JSON Web Tokens.
-   **CRUD for Jobs**: Recruiters can Create, Read, Update, and Delete their job postings.
-   **Dynamic Filtering**: Public job board with dynamic filtering by job title and location.
-   **Centralized State Management**: Robust and predictable state management using Redux Toolkit.
-   **Profile Management**: Users can update their name, email, and profile picture.
-   **Resume Upload**: Job seekers can upload and manage their PDF resumes, with file storage handled by Cloudinary.

---

## 📸 Application Screenshots

| Home Page & Job Listings                               | Recruiter Dashboard                                  |
| ------------------------------------------------------ | ---------------------------------------------------- |
| ![Home Page](./assets/Screenshot 2025-07-22 163036.png) | ![Recruiter Dashboard](./assets/Screenshot%202025-07-22%20163218.png) |

| Job Seeker Dashboard                                        | Edit Job Page (Recruiter)                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| ![Job Seeker Dashboard](./assets/Screenshot%202025-07-22%20163441.png) | ![Edit Job Page](./assets/Screenshot%202025-07-22%20163520.png) |


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
    The frontend will open and run on `http://localhost:5173` (or another port if 3000 is busy).
