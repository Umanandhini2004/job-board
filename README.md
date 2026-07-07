# Job Board Website

A full-stack job board website where employers can post jobs and job seekers can apply.

## Features

- **Home Page**: Welcome message and featured job listings
- **Job Listings**: Search and filter jobs by title, location, and category
- **Job Detail**: Detailed information about a specific job
- **User Authentication**: Secure login and registration
- **Candidate Dashboard**: View applications and manage profile
- **Employer Dashboard**: Post jobs and manage applications
- **Application Process**: Apply with resume and cover letter
- **Email Notifications**: Get updates on applications
- **Mobile Responsive**: Works on all devices

## Tech Stack

### Frontend
- React 19
- React Router v7
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- Multer for file uploads

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install dependencies (already done):
   ```
   npm install
   ```

3. Create `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-board
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```
   cd frontend
   ```

2. Install dependencies (already done):
   ```
   npm install
   ```

3. Create `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the application:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)
- `GET /api/jobs/employer/my-jobs` - Get employer's jobs

### Applications
- `POST /api/applications` - Apply for a job
- `GET /api/applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job applications (employers only)
- `PUT /api/applications/:applicationId` - Update application status (employers only)

## Project Structure

```
job-board/
├── backend/
│   ├── config/
│   │   └── db.js - Database connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js - Main server file
│   ├── .env - Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── JobListings.js
    │   │   ├── JobDetail.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── EmployerDashboard.js
    │   │   └── CandidateDashboard.js
    │   ├── components/
    │   │   ├── Navigation.js
    │   │   ├── Footer.js
    │   │   ├── JobCard.js
    │   │   └── ApplicationForm.js
    │   ├── services/
    │   │   └── api.js - API calls
    │   ├── context/
    │   │   └── AuthContext.js - Auth state management
    │   ├── utils/
    │   │   └── auth.js - Auth utilities
    │   ├── App.js - Main component
    │   ├── App.css - Styles
    │   └── index.js
    ├── .env - Environment variables
    ├── package.json
    └── public/
        └── index.html
```

## Running the Application

1. Make sure MongoDB is running locally
2. Start the backend server: `npm run dev` in the backend folder
3. Start the frontend: `npm start` in the frontend folder
4. Open http://localhost:3000 in your browser

## Default Behavior

- Candidates can: Register, Browse jobs, Apply for jobs, View applications
- Employers can: Register, Post jobs, View applications for their jobs, Update application status

## Next Steps

- Add email notifications using Nodemailer
- Implement file upload for resumes
- Add payment integration for job postings
- Add admin dashboard
- Improve search and filtering
- Add job categories and tags
- Add messaging between employers and candidates
