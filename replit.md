# MEAN Stack Job Portal

A full-featured job portal built with MongoDB, Express.js, Angular, and Node.js (MEAN Stack).

## Overview

This application allows:
- **Job Seekers** to browse jobs, apply with cover letters, and track applications
- **Employers** to post jobs, manage listings, and view applicants
- **Admins** to manage all content

## Project Structure

```
mean-job-portal/
├── backend/                 # Node.js + Express API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
├── frontend/               # Angular 17 app
│   ├── src/app/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   ├── guards/         # Route guards
│   │   └── interceptors/   # HTTP interceptors
│   └── angular.json
└── package.json            # Root config with concurrently
```

## Recent Changes

- Initial project setup (Dec 2025)
- Created backend with JWT authentication
- Built Angular frontend with all components
- Configured for Replit deployment

## User Preferences

- Using Bootstrap 5 for UI styling
- Angular 17 with standalone components
- Express.js for backend API

## Required Secrets

Set these in Replit Secrets:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - List all jobs
- GET `/api/jobs/:id` - Get job details
- POST `/api/jobs` - Create job (employer)
- DELETE `/api/jobs/:id` - Delete job (employer)
- POST `/api/jobs/:id/apply` - Apply for job

## Test Accounts

After running, register with:
- Job Seeker: Select "Job Seeker" role
- Employer: Select "Employer" role

## Sample Job Posting

```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp Inc.",
  "location": "New York, NY",
  "salary": "$120,000 - $180,000",
  "jobType": "full-time",
  "description": "We are looking for an experienced software engineer...",
  "requirements": [
    "5+ years of experience",
    "Strong JavaScript/TypeScript skills",
    "Experience with Node.js and Angular"
  ]
}
```
