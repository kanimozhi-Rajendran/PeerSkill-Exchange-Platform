# 🎓 Peer Skill Exchange Platform

> A full-stack, barter-based learning platform for college students. Teach skills you know, learn skills you need from peers, with zero money required. Built for **Web Application Development (WAD)** and **Software Engineering and Project Management (SEPM)** academic subjects.

---

## 🌟 1. Project Concept & Real Problem Solved

College students frequently struggle to afford private tutors or online course subscriptions. Meanwhile, students possess valuable skills that their classmates want to learn:
- **Student A (Priya)** excels at **Python** and wants to learn **Excel**.
- **Student B (Rahul)** excels at **Excel** and wants to learn **Python**.

The **Peer Skill Exchange Platform** identifies this **Two-Way Mutual Match**, allows both students to connect, schedule learning sessions, award gamified skill credits, and maintain academic peer reviews—eliminating monetary barriers.

---

## 📂 2. File & Folder Structure Explained

```
peer-skill-exchange/
├── client/                               # Frontend Single Page Application (React + Vite)
│   ├── src/
│   │   ├── components/                   # Reusable UI widgets
│   │   │   ├── Navbar.jsx                # Top bar with credit counter, notifications & user profile
│   │   │   ├── Sidebar.jsx               # Navigation drawer with active route indicator
│   │   │   ├── Footer.jsx                # Academic project credentials & footer links
│   │   │   ├── SkillCard.jsx             # Card displaying teachable/wanted skill details
│   │   │   ├── MatchCard.jsx             # Displays two-way match synergy score & plain explanation
│   │   │   ├── SessionCard.jsx           # Session lifecycle card with action buttons
│   │   │   ├── BookSessionModal.jsx      # Modal dialog to schedule 1-on-1 session
│   │   │   ├── ReviewModal.jsx           # 1-to-5 star rating and feedback dialog
│   │   │   ├── Toast.jsx                 # System toast alert notifications
│   │   │   └── StatCard.jsx              # Reusable dashboard analytics metric card
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global state: user, token, credits & toast dispatch
│   │   ├── pages/                        # Page-level route views
│   │   │   ├── LandingPage.jsx           # Hero, problem/solution, features & quick demo presets
│   │   │   ├── LoginPage.jsx             # Authentication page with 1-click demo login buttons
│   │   │   ├── RegisterPage.jsx          # Registration form (name, email, department, year)
│   │   │   ├── DashboardPage.jsx         # Overview metrics, upcoming sessions & top matches
│   │   │   ├── ProfilePage.jsx           # View & edit student bio, department, and interests
│   │   │   ├── SkillsPage.jsx            # Manage teachable vs wanted skills
│   │   │   ├── MatchResultsPage.jsx      # Live rules-based skill matching algorithm results
│   │   │   ├── DiscoverPage.jsx          # Browse all college students and search by skill
│   │   │   ├── SessionsPage.jsx          # Manage incoming, outgoing, upcoming & past sessions
│   │   │   ├── ProgressPage.jsx          # Learning analytics, hours taught/learned, credit ledger
│   │   │   ├── ReviewsPage.jsx           # Peer feedback history and ratings
│   │   │   ├── NotificationsPage.jsx     # In-app alerts for bookings, reviews & credits
│   │   │   ├── AdminPage.jsx             # Administrator dashboard for student moderation
│   │   │   └── NotFoundPage.jsx          # Friendly 404 page
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with automatic JWT Authorization headers
│   │   ├── App.jsx                       # React Router configuration & ProtectedRoute guards
│   │   ├── main.jsx                      # React entry point
│   │   └── index.css                     # Custom modern design system & CSS tokens
│   ├── index.html                        # HTML5 shell with Google typography
│   ├── package.json                      # Client dependencies (React, Vite, Axios, Lucide)
│   └── vite.config.js                    # Vite bundler configuration & /api reverse proxy
│
├── server/                               # Backend REST API Service (Node.js + Express)
│   ├── config/
│   │   └── db.js                         # Dual-engine database manager (MongoDB + Local JSON Fallback)
│   ├── controllers/                      # Request handling business logic
│   │   ├── authController.js             # Registration, login, profile edit, bcrypt hashing
│   │   ├── skillController.js            # Add, edit, and delete student skills
│   │   ├── matchController.js            # Rules-based match calculations & student discovery
│   │   ├── sessionController.js          # Booking lifecycle state machine & credit awards
│   │   ├── reviewController.js           # Peer ratings (1-5 stars) & duplicate review guards
│   │   ├── dashboardController.js        # Aggregated telemetry metrics & monthly hours
│   │   ├── notificationController.js     # User alert queries and mark-read mutations
│   │   └── adminController.js            # Admin metrics, user activation toggles, audit logs
│   ├── middleware/
│   │   ├── auth.js                       # JWT verification and user extraction
│   │   └── admin.js                      # Role-based guard enforcing role === 'admin'
│   ├── models/                           # Schemas & data repository layer
│   │   ├── User.js                       # Mongoose schema for student & admin profiles
│   │   ├── Session.js                    # Mongoose schema for session bookings
│   │   ├── Review.js                     # Mongoose schema for ratings & feedback
│   │   ├── CreditTransaction.js          # Mongoose schema for immutable credit ledger
│   │   ├── Notification.js               # Mongoose schema for in-app student alerts
│   │   └── index.js                      # Repository pattern adapter (MongoDB ↔ Local JSON DB)
│   ├── routes/                           # API route definitions
│   │   ├── authRoutes.js                 # /api/auth endpoints
│   │   ├── skillRoutes.js                # /api/skills endpoints
│   │   ├── matchRoutes.js                # /api/matches endpoints
│   │   ├── sessionRoutes.js              # /api/sessions endpoints
│   │   ├── reviewRoutes.js               # /api/reviews endpoints
│   │   ├── dashboardRoutes.js            # /api/dashboard endpoints
│   │   ├── notificationRoutes.js         # /api/notifications endpoints
│   │   └── adminRoutes.js                # /api/admin endpoints
│   ├── services/
│   │   └── matchService.js               # Deterministic Two-Way Skill Matching Engine
│   ├── scripts/
│   │   └── seed.js                       # Populates realistic demo college students & sessions
│   ├── tests/
│   │   └── api.test.js                   # Automated test suite using Node's native test runner
│   ├── data/
│   │   └── db.json                       # Persistent local JSON data store (used if MongoDB offline)
│   ├── .env                              # Server environment variables
│   ├── package.json                      # Server dependencies (Express, Mongoose, Bcrypt, JWT)
│   └── server.js                         # Express entry point & /api/health endpoint
│
├── docs/                                 # SEPM & WAD Academic Documentation
│   ├── SRS.md                            # IEEE 830 Software Requirements Specification
│   ├── PROJECT_PLAN.md                   # Work Breakdown Structure, Gantt schedule & milestones
│   ├── USE_CASE_DIAGRAM.md               # Student & Admin use cases with Mermaid diagram
│   ├── CLASS_DIAGRAM.md                  # Class architecture & entity relationships with Mermaid
│   ├── SYSTEM_ARCHITECTURE.md            # 3-Tier architecture design & security model
│   ├── TEST_PLAN.md                      # Test scenarios, test data, and verified execution results
│   ├── RISK_MANAGEMENT.md                # SEPM Risk Matrix, Likelihood, Impact, and Mitigation
│   ├── USER_MANUAL.md                    # Walkthrough instructions for students & administrators
│   └── MAINTENANCE_PLAN.md               # Corrective, adaptive, perfective maintenance plan
│
├── .env.example                          # Environment configuration template
├── .gitignore                            # Git ignore definitions
├── package.json                          # Root repository scripts (convenient multi-folder execution)
└── README.md                             # Comprehensive project manual (this file)
```

---

## ⚡ 3. Quick Start & Execution Commands

### Prerequisites
- **Node.js** (v18.0.0 or higher - verified on Node v24)
- **npm** (v9.0.0 or higher)
- *(Optional)* **MongoDB** (If not running, the application automatically activates persistent local JSON storage at `server/data/db.json` with 100% feature parity!).

### Step 1: Install Dependencies
From the root workspace directory or `peer-skill-exchange/`:
```bash
# Install both backend and frontend packages
npm run install:all
```
*(Or install individually: `npm --prefix server install` and `npm --prefix client install`)*

### Step 2: Seed Demo Data
Populate realistic college student profiles, mutual matches, sessions, and ratings:
```bash
npm run seed
```

### Step 3: Run Automated Test Suite
Execute the 8-suite automated backend test runner:
```bash
npm test
```
*Output: 8 passing tests, 0 failures (authentication, matching algorithm, past date rejection, credit integrity, admin guards).*

### Step 4: Start the Backend Server
```bash
npm run server
```
Server starts on: **`http://localhost:5000`**  
Health Check: **`http://localhost:5000/api/health`**

### Step 5: Start the Frontend Client
In a separate terminal:
```bash
npm run client
```
Client runs on: **`http://localhost:3000`**

---

## 🛡️ 4. Pre-Configured Demo Accounts for Academic Viva

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Student A** | Priya Sharma | `priya@peerskill.edu` | `Password@123` | CS 3rd Year • Teaches Python • Wants Excel |
| **Student B** | Rahul Verma | `rahul@peerskill.edu` | `Password@123` | DS 3rd Year • Teaches Excel • Wants Python *(Mutual Match!)* |
| **Student C** | Ananya Patel | `ananya@peerskill.edu` | `Password@123` | EE 2nd Year • Teaches Figma • Wants C++ |
| **Student D** | Karthik Iyer | `karthik@peerskill.edu` | `Password@123` | ME 4th Year • Teaches C++ • Wants Figma *(Mutual Match!)* |
| **Admin** | System Admin | `admin@peerskill.edu` | `Admin@123` | Platform Governance & Moderation |

> **Pro-Tip**: The Login page features **One-Click Demo Fill Buttons** to instantaneously populate any persona without manual typing.

---

## 🔍 5. End-to-End Demo Workflow (For Evaluator Review)

1. **Demonstrate Landing Page**:
   - Visit `http://localhost:3000`. Observe the hero, the "How Two-Way Matching Works" interactive breakdown, and feature cards.
2. **Log In as Priya Sharma**:
   - Go to `/login`, click "Priya Sharma", and sign in.
   - Note the **20 Credits** in the top navigation bar.
3. **Inspect the Two-Way Matching Engine**:
   - Navigate to **"Skill Matches"** (`/matches`).
   - Notice **Rahul Verma** at the top with a **🌟 2-WAY MUTUAL EXCHANGE** banner and **95% Synergy Score**.
   - Read the plain-English explanation: *"You can teach Rahul Verma (Python), and in return, Rahul Verma can teach you (Excel). Zero money needed!"*
4. **Book a Session**:
   - Click **"Book Session"** on Rahul's card.
   - Select skill: `Excel`, choose tomorrow's date, time: `16:00`, duration: `60 mins`.
   - Submit. A notification is dispatched to Rahul.
5. **Switch to Rahul to Accept & Complete**:
   - Log out, log in as **Rahul Verma**.
   - Go to **"My Sessions"** $\rightarrow$ **"Incoming Requests"**.
   - Click **"Accept Session"**.
   - Switch to **"Upcoming Scheduled"** and click **"Mark Completed"**.
   - Rahul automatically receives **$+5$ Skill Credits** (recorded in his Credit Ledger).
6. **Post a Peer Review**:
   - Go to **"History & Reviews"**, click **"Rate & Review"**.
   - Select 5 stars, type constructive feedback, and submit.
   - Observe Priya's profile average rating update dynamically!
7. **Demonstrate Admin Governance**:
   - Log in as `admin@peerskill.edu` / `Admin@123`.
   - Navigate to **"Admin Portal"** (`/admin`).
   - View system statistics, audit session logs, and test account deactivation/activation.

---

## 🧠 6. Beginner-Friendly Viva Q&A (Prepare for Your Evaluation)

### Q1: What makes this project unique compared to a standard tutoring website?
> **Answer**: Most tutoring apps require payment gateway integrations (credit cards/cash). PeerSkill is built on a **barter economy** using gamified **Skill Credits**. Furthermore, our **Two-Way Matching Algorithm** identifies reciprocal pairs so students learn from each other at zero monetary cost.

### Q2: How does the Skill Matching Algorithm work under the hood?
> **Answer**: Located in `server/services/matchService.js`, the algorithm checks whether Student A's teachable skills match Student B's wanted skills, AND if Student B's teachable skills match Student A's wanted skills. If both conditions are satisfied, it is classified as a high-priority `mutual` match (score $\ge 85\%$). It also awards bonuses for higher proficiency levels (Advanced/Intermediate).

### Q3: How do you prevent cheating in the Credit System?
> **Answer**:
> 1. Credits cannot be modified via client requests; the user update endpoint explicitly ignores credit changes.
> 2. The session completion controller enforces a boolean guard `creditsAwarded: true`. Once awarded, repeated calls will never payout credits a second time.
> 3. Every single credit change is permanently recorded in the immutable `CreditTransaction` ledger table.

### Q4: How is database persistence handled if MongoDB is not running locally?
> **Answer**: We implemented the **Repository / DAO Pattern** (`server/config/db.js` and `server/models/index.js`). The server attempts to connect to MongoDB with a 2.5s timeout. If unavailable, it seamlessly switches to a disk-persisted local JSON store (`server/data/db.json`). All CRUD operations, state updates, and sessions persist across server restarts, ensuring the evaluator experiences a 100% functioning platform regardless of environment setup.

---

## 📚 7. Academic Subject Mapping

### Web Application Development (WAD)
- **Frontend Architecture**: React 18, Vite, React Router DOM, dynamic components, and stateful hooks (`useState`, `useEffect`, `useContext`).
- **RESTful API**: Express.js endpoints adhering to standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) and standard status codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`).
- **Authentication**: Stateless HMAC-SHA256 JWT tokens with Axios request interceptors.
- **Responsive UI/UX**: Custom CSS design system, CSS custom properties, WCAG-compliant color contrast, mobile drawer navigation.

### Software Engineering and Project Management (SEPM)
- **IEEE 830 SRS**: Comprehensive requirements specification in `docs/SRS.md`.
- **Agile Scrum Project Plan**: 4-week sprint breakdown, Gantt timeline, and RACI matrix in `docs/PROJECT_PLAN.md`.
- **UML Modeling**: Mermaid Use Case diagram (`docs/USE_CASE_DIAGRAM.md`) and Class diagram (`docs/CLASS_DIAGRAM.md`).
- **Risk Analysis**: SEPM Risk Matrix and mitigation strategies in `docs/RISK_MANAGEMENT.md`.
- **Quality Assurance**: Automated regression tests in `server/tests/api.test.js` conforming to IEEE 829 test documentation (`docs/TEST_PLAN.md`).
