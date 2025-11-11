# JobTrack - Personal Job Application Tracker

A comprehensive full-stack web application designed for job seekers to track applications and prepare for interviews.

![JobTrack Dashboard](./docs/image.png)

## 📋 Project Information

**Authors:** Zoya, Arvind  
**Course:** CS5610 Web Development - Northeastern University  
**Course Link:** [CS5610 Web Development](https://johnguerra.co/classes/webDevelopment_online_fall_2025/)  
**Semester:** Fall 2025

## 🎯 Project Objective

JobTrack is a two-part platform that combines personal job application management with a public interview preparation hub. The application enables job seekers to:

- **Private Dashboard**: Track all job applications with company, role, status (Applied → Interview → Offer), dates, and notes
- **Public Q&A Hub**: Browse and share anonymous interview questions tagged by company and role
- **AI Mock Answers**: Generate AI-powered sample answers to practice interview responses
- **Search & Filter**: Find relevant interview questions by company, role, or keywords

This project demonstrates modern full-stack development using the MERN stack (MongoDB, Express, React, Node.js) with JWT authentication, RESTful API design, and client-side rendering with React hooks.

## ✨ Features

### Authentication & User Management (Arvind)

- Secure user registration with password hashing (bcrypt)
- JWT-based authentication and session management
- Protected routes and API endpoints
- User profile management with update capabilities
- Change password with current password verification
- Email and username uniqueness validation

### Private Application Tracker (Arvind)

- **Full CRUD Operations**: Create, read, update, and delete job applications
- **Status Tracking**: Monitor progress from "Applied" → "Interview" → "Offer" → "Rejected"
- **Rich Details**: Store company, role, submission date, application URL, and personal notes
- **User-Specific Data**: Each user sees only their own applications
- **Responsive Dashboard**: Clean table view with action buttons and modals

### Public Interview Questions Hub (Zoya)

- **Anonymous Submissions**: Share interview questions without revealing identity
- **Company & Role Tags**: Organize questions by employer and position
- **Search & Filter**: Find questions by company, role, or keyword
- **Community Knowledge Base**: Learn from real interview experiences

## 📸 Screenshots

### Dashboard

![Application Dashboard](./docs/image2.png)
_Track all your job applications in one organized view_

### Application Detail

![Edit Application](./docs/image.png)
_Update application status and add detailed notes_

### Interview Questions Hub

![Questions Hub](./docs/screenshots/questions-hub.png)
_Browse community-submitted interview questions_

## 🛠️ Tech Stack

**Backend:**

- Node.js
- Express.js v5.1.0
- MongoDB v6.20.0 (native driver, no Mongoose)
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- dotenv for environment variables

**Frontend:**

- React v19.1.1 with Hooks
- React Router DOM v7.9.5 for routing
- React Bootstrap v2.10.10 for UI components
- React Icons v5.5.0 for icon library
- Vite v7.1.7 for build tooling
- Native Fetch API (no Axios)

**Development Tools:**

- ESLint v9.36.0 for code quality
- Prettier for code formatting
- Nodemon for development hot-reload
- pnpm for package management

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- pnpm (recommended) or npm

### Step 1: Clone the Repository

```bash
git clone https://github.com/ArvindParekh/jobtrack/
cd jobtrack
```

### Step 2: Install Backend Dependencies

```bash
pnpm install
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
pnpm install
```

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/jobtrack
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobtrack

JWT_SECRET=your_secret_key_here_replace_with_random_string
```

### Step 5: Build the Frontend

```bash
cd frontend
pnpm run build
```

### Step 6: Start the Server

```bash
pnpm dev
# or for production:
# node server.js
```

The server will start on `http://localhost:3000`

### Step 7: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You'll be redirected to the login page. Create an account to get started!

## 📁 Project Structure

```
Project 3 - JobTrack/
├── controllers/              # Business logic
│   ├── authController.js    # Authentication logic (Arvind)
│   └── applicationsController.js  # Application CRUD (Arvind)
├── middlewares/             # Express middleware
│   └── authMiddleware.js    # JWT token verification
├── routes/                  # API routes
│   ├── authRoutes.js       # Auth endpoints
│   └── applicationRoutes.js # Application endpoints
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── Navbar.jsx  # Navigation bar
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx   # Login page
│   │   │   ├── Register.jsx # Registration page
│   │   │   ├── Dashboard.jsx # Application list
│   │   │   ├── ApplicationDetail.jsx # Edit application
│   │   │   └── Profile.jsx # User profile settings
│   │   ├── api.js          # API client functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # React entry point
│   ├── dist/               # Production build
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── docs/                    # Documentation & design
│   ├── design-document.md  # Full project design doc
│   └── screenshots/        # Application screenshots
├── server.js                # Express server setup
├── package.json             # Backend dependencies
├── eslint.config.js         # ESLint configuration
├── .prettierrc              # Prettier configuration
├── LICENSE                  # MIT License
└── README.md                # This file
```

## 🔌 API Endpoints

### Authentication (Arvind)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/me` - Update user profile (protected)
- `PUT /api/auth/me/password` - Change password (protected)

### Applications (Arvind)

All application endpoints require authentication via JWT token in `Authorization: Bearer <token>` header.

- `GET /api/applications` - Get all applications for authenticated user
- `GET /api/applications/:id` - Get specific application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application (including status)
- `DELETE /api/applications/:id` - Delete application

### Interview Questions (Zoya)

_Coming soon: Public question endpoints and AI answer generation_

## 💾 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  username: String,        // Unique
  email: String,           // Unique
  password: String,        // Hashed with bcrypt
  createdAt: Number        // Timestamp
}
```

### Applications Collection

```javascript
{
  _id: ObjectId,
  userId: String,          // References user
  company: String,
  role: String,
  status: String,          // "applied", "interview", "offer", "rejected"
  submittedAt: Number,     // Timestamp
  url: String,             // Optional application URL
  notes: String,           // Optional notes
  createdAt: Number,       // Timestamp
  updateAt: Number         // Timestamp
}
```

### Questions Collection (Zoya)

_Coming soon: Interview questions schema_

## 📝 Development Guidelines

### Code Formatting

All code is formatted using Prettier. Run:

```bash
pnpm exec prettier --write .
```

### Linting

ESLint is configured for both backend and frontend:

```bash
# Frontend
cd frontend && pnpm run lint
```

## 👥 Team Responsibilities

### Arvind

- ✅ Authentication and profile management
- ✅ Full CRUD operations for applications collection
- ✅ Private dashboard interface (Dashboard, ApplicationDetail pages)
- ✅ JWT middleware and protected routes
- ✅ Backend API for applications

### Zoya

- ✅ Full CRUD operations for questions collection
- ✅ Public interview hub interface
- ✅ Search and filter functionality
- ✅ AI-powered mock answer feature
- ✅ Database seeding with 1,000+ synthetic questions

## 🎓 Academic Context

This project fulfills the requirements for CS5610 Web Development Project 3:

- ✅ React with hooks (5 components in separate files)
- ✅ Node.js + Express backend
- ✅ MongoDB with native driver (no Mongoose)
- ✅ At least 2 MongoDB collections with full CRUD
- ✅ User authentication and session management
- ✅ Client-side rendering with AJAX (Fetch API)
- ✅ ESLint configuration with no errors
- ✅ Prettier code formatting
- ✅ PropTypes for all React components
- ✅ MIT License
- ✅ Proper code organization
- ✅ No prohibited libraries (axios, mongoose, cors)
- ✅ Environment variables for credentials
- ✅ Separate package.json for frontend and backend

## 🤝 Contributing

This is an academic project. For suggestions or issues, please contact the authors.

## 📄 License

MIT License

Copyright (c) 2025 Zoya, Arvind

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📧 Contact

**Zoya**  
Northeastern University  
Email: arief.z@northeastern.edu

**Arvind**  
Northeastern University  
Email: parekh.arv@northeastern.edu

## 🤖 GenAI Usage

This project utilized generative AI tools to assist with documentation and content generation:

### Models & Tools Used

- **Claude 3.5 Sonnet** (Latest version)
- **Claude 4.5 Haiku** (for specific code review tasks)

### Use Cases & Prompts

**README.md Generation**

- Prompt: "Create a comprehensive README following the structure of a professional MERN stack project"
- Purpose: Generate well-structured documentation including installation steps, API endpoints, tech stack details, and project overview
- Output: Professional README with clear sections, instructions, and technical details

**Design Document Creation**

- Prompt: "Write a detailed design document with user personas, user stories, and feature specifications for a job tracking application"
- Purpose: Develop comprehensive project specification with acceptance criteria and implementation details
- Output: Complete design document with personas, user stories, and technical requirements

### How AI Was Utilized

- Content generation for documentation structure and technical descriptions
- Assistance with organizing information logically and clearly
- Proofreading and refinement of technical explanations
- Consistent tone and professional presentation across documents

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) and [React Bootstrap](https://react-bootstrap.github.io/) for UI components
- [React Icons](https://react-icons.github.io/react-icons/) for iconography
- [Vite](https://vitejs.dev/) for lightning-fast development experience
- MongoDB for database solution
- Northeastern University CS5610 course staff and Professor John Alexis Guerra Gomez
- Claude AI models for documentation assistance

---

**Live Demo:** [Coming Soon]  
**Video Demo:** [Coming Soon]  
**Design Document:** [View Full Design Doc](./docs/design-document.md)
