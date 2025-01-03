# Education Management System (EMS)

A comprehensive Education Management System that facilitates efficient management of courses, students, and teachers. The system includes role-based dashboards for admins, teachers, and students, and supports features like course management, enrollment tracking, and authentication.

## Features

### Admin Features:

- **Manage Courses**:
  - Create, edit, and delete courses.
  - Assign teachers to courses.
  - View enrolled students in each course.
  - Add or remove students from courses.
- **User Management**:
  - Manage user roles (Admin, Teacher, Student).

### Teacher Features:

- **Course Management**:
  - View courses assigned to them.
  - Manage course content and syllabus.
  - Track enrolled students.

### Student Features:

- **Course Enrollment**:
  - Enroll in available courses.
  - View enrolled courses and their details.
  - Unenroll from courses if needed.

### Common Features:

- **Authentication**:
  - User registration and login using JWT.
  - Role-based access control for routes and features.
- **Responsive Design**:
  - Optimized for both desktop and mobile devices.

## Tech Stack

### Frontend:

- React.js
- TailwindCSS for styling
- Axios for HTTP requests
- React Router for routing
- Zustand for state management
- Ant Design (antd) for UI components

### Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication

## Installation

### Prerequisites:

- Node.js installed on your machine.
- MongoDB database set up.

### Backend Setup:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following environment variables:
   ```env
   PORT=8000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following environment variables:
   ```env
   VITE_BACKEND_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Endpoints

### Authentication Endpoints:

- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Login and get a JWT token.
- **POST /api/auth/logout**: Logout the user.
- **GET /api/auth/self**: Get the logged-in user's details.

### Course Endpoints:

- **GET /api/courses**: Fetch all courses.
- **POST /api/courses**: Create a new course (Admin only).
- **PUT /api/courses/:id**: Update a course (Admin only).
- **DELETE /api/courses/:id**: Delete a course (Admin only).

### Enrollment Endpoints:

- **POST /api/enrollment/enroll**: Enroll a student in a course.
- **DELETE /api/enrollment/:id**: Remove a student from a course.

## Deployment

- **Frontend**: [https://swiftrut-pt-9-education-management.vercel.app](https://swiftrut-pt-9-education-management.vercel.app)
- **Backend**: [https://swiftrut-pt-9-education-management.onrender.com](https://swiftrut-pt-9-education-management.onrender.com)

## License

This project is licensed under the MIT License.
