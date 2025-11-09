# JobTrack - Design Document

- **Team Members:** Zoya, Arvind

- **Course:** CS5610 Web Development

- **Instructor:** John Alexis Guerra Gomez

## 1. What We're Building

We are building JobTrack, a full-stack MERN application that serves two related needs for job seekers. The platform is a two-part system:

1. **Private Dashboard:** A secure, authenticated dashboard where users can manage and track all their personal job applications. This allows users to monitor the company, role, status (e.g., "Applied," "Interview," "Offer"), and notes for each application.

2. **Public Interview Hub:** A community-driven, anonymous "Interview Question Bank" where any user can share and browse real-world interview questions.

To enhance the platform, the public hub includes an **AI "wow factor"** feature. Any user can click a button on a submitted question to receive an AI-generated mock answer, turning the hub into a powerful interactive study tool.

### Key Features:

- Secure user authentication (registration, login, and sessions).

- Private dashboard for full CRUD (Create, Read, Update, Delete) on personal job applications.

- Public, anonymous hub for submitting interview questions.

- Public hub for browsing and filtering all submitted questions.

- Search/filter functionality for the public hub (by company, role, keyword).

- AI-powered "Mock Answer" generation for any question.

### Technical Requirements:

- **Frontend:** React with Hooks (Client-Side Rendered), `react-router-dom`, and the native browser `fetch` API.

- **Backend:** Node.js with Express, `express-session` for auth, and `bcrypt` for password hashing.

- **Database:** MongoDB, accessed via the native `mongodb` driver.

- **Prohibited Libraries:** No Mongoose, no Axios.

- **Data:** The `questions` collection must be seeded with 1,000+ synthetic records.

## 2. User Personas

### Persona 1: Sara (The Graduate Student)

- **Age:** 23

- **Program:** Master's in Computer Science

- **Goal:** Keep track of 15+ internship applications for next summer while balancing a full-time course load.

- **Pain Point:** Uses a messy spreadsheet and sticky notes. She constantly loses track of deadlines and which application is at which stage, causing stress and missed follow-ups.

- **How JobTrack Helps:** Sara can log in to her private dashboard, see all her applications in one clean view, and update their status (e.g., from "Applied" to "Interview") with one click.

### Persona 2: Alex (The Career Changer)

- **Age:** 28

- **Program:** Self-taught developer preparing for a mid-level role.

- **Goal:** Prepare for technical interviews at specific companies (e.g., Google, Vercel, startups).

- **Pain Point:** Doesn't know what types of questions to expect beyond generic "Top 10" lists and finds it hard to practice answering them.

- **How JobTrack Helps:** Alex visits the public Q&A Hub and filters by "Vercel." He sees real questions submitted by other users. He clicks "Get AI Mock Answer" on a tricky system design question to see a well-structured response, which helps him frame his own answer.

## 3. User Stories

### Story 1 (Auth - Arvind)

**As a user,** I want to register for an account with my email and log in securely **so that** I can access my private application dashboard.

**Acceptance Criteria:**

- A user can register with a unique email and password.

- Passwords are hashed and stored securely in the `users` collection.

- A user can log in with correct credentials.

- An `express-session` cookie is created upon successful login.

- A user is redirected to their private dashboard after login.

- Access to the dashboard is protected by authentication middleware.

### Story 2 (Tracker - Arvind)

**As a logged-in user,** I want to add a new job application (with company, role, date, and status) to my private dashboard **so that** I don't forget it.

**Acceptance Criteria:**

- An "Add Application" form (or modal) is available on the dashboard.

- The form includes fields for company, role, status, and date.

- On submit, a new document is created in the `applications` collection.

- The new document is associated with the logged-in user's `userId`.

- The new application immediately appears in the dashboard list.

### Story 3 (Tracker - Arvind)

**As a logged-in user,** I want to update the status of an existing application (e.g., "Applied" -> "Interview") or delete it **so that** my dashboard is up-to-date.

**Acceptance Criteria:**

- Each application in the list has "Edit" and "Delete" buttons.

- Clicking "Edit" opens a form pre-populated with the application's data.

- Submitting the "Edit" form updates the correct document in the database.

- Clicking "Delete" removes the document from the database and the UI.

- A user can only edit or delete their _own_ applications.

### Story 4 (Q&A Hub - Zoya)

**As any user,** I want to anonymously submit an interview question I was asked, tagging it with the company name, **so that** I can help the community.

**Acceptance Criteria:**

- A "Submit Question" form is available on the public hub.

- The form includes fields for the question, company, and role.

- On submit, a new document is created in the `questions` collection.

- No `userId` or identifying information is stored with the public question.

- The new question appears in the public question feed.

### Story 5 (Q&A Hub - Zoya)

**As a user preparing for an interview,** I want to filter all public questions by company name or role **so that** I can find relevant practice material quickly.

**Acceptance Criteria:**

- The UI includes filter inputs for "company" and "role" (e.g., dropdowns or text inputs).

- A search bar for keywords is also available.

- Changing the filter/search inputs triggers an API call.

- The list of questions on the page updates to show only matching results.

- A "Clear Filters" button resets the list to show all questions.

### Story 6 (AI Feature - Zoya)

**As a user viewing a question,** I want to click a "Get Mock Answer" button **so that** I can receive an AI-generated ideal answer to help me study.

**Acceptance Criteria:**

- A "Get AI Mock Answer" button is visible on every question card.

- Clicking the button triggers a `fetch` call to a specific backend route (e.g., `POST /api/questions/:id/ai-answer`).

- A loading indicator is displayed while the AI response is being generated.

- The generated answer is displayed clearly below the question.

- If the AI call fails, a user-friendly error message is shown.

## 4. Design Mockups

### 4.2. Register / Login Page

![](./login.png)
![](./register.png)

### 4.3. User Dashboard (Application Tracker)

![](./empty-dashboard.png)
(Empty Dashboard)

![](./dashboard.png)

### 4.4. Add/Edit Application Form (Modal)

![](./edit-application.png)
(Add application modal would be exactly similar to this page, except that it'd be a modal)

### 4.5. Public Interview Question Hub

### 4.6. Submit Question Form (Modal)
