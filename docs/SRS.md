# Software Requirements Specification (SRS)
## Peer Skill Exchange Platform for College Students

**Course:** Web Application Development (WAD) & Software Engineering and Project Management (SEPM)  
**Standard:** IEEE Std 830-1998 Conforming Specification  
**Version:** 1.0.0  
**Date:** October 2026  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the complete functional and non-functional specifications for the **Peer Skill Exchange Platform**. The system provides undergraduate and postgraduate college students with a non-monetary, barter-based collaborative environment where they can teach skills they know and learn skills they need from their peers.

### 1.2 Scope
Commercial tutoring platforms impose heavy hourly financial charges, pricing out college students. The Peer Skill Exchange Platform creates a campus barter economy utilizing a **Skill Credit Model**:
- Each new student starts with a baseline credit allocation.
- Conducting verified learning sessions awards additional credits to the mentor.
- A deterministic rules-based skill matching algorithm pairs students based on reciprocal synergy (e.g. Student A teaches Python and wants Excel; Student B teaches Excel and wants Python).
- Web application deployed with React.js (Vite), Node.js, Express.js, and dual-engine persistence (MongoDB & Persistent Local Store).

### 1.3 Definitions, Acronyms, and Abbreviations
- **WAD**: Web Application Development
- **SEPM**: Software Engineering and Project Management
- **MERN**: MongoDB, Express.js, React.js, Node.js
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **Two-Way Match**: A reciprocal condition where Student $A$'s teachable skills intersect with Student $B$'s wanted skills, AND Student $B$'s teachable skills intersect with Student $A$'s wanted skills.

---

## 2. Overall Description

### 2.1 Product Perspective
The platform is a multi-tier, responsive single-page web application (SPA) backed by a RESTful Express.js service. It interfaces with Mongoose for production database management and maintains a JSON-based file persistence fallback for isolated academic evaluations.

### 2.2 User Classes and Characteristics
1. **Student (Primary User)**:
   - College undergraduate/postgraduate.
   - Capability: Register, manage teachable/wanted skills, view mutual matches, browse directory, request sessions, conduct sessions, submit peer reviews.
2. **Platform Administrator**:
   - Academic department coordinator or system admin.
   - Capability: Audit session exchanges, inspect registered user directories, moderate accounts (suspend/activate).

### 2.3 Operating Environment
- **Client**: Any modern web browser (Google Chrome 110+, Mozilla Firefox 110+, Safari 16+, Edge 110+).
- **Server**: Node.js v18.0.0 or higher on Windows/Linux/macOS.
- **Database**: MongoDB v6.0+ (optional: auto-detects and uses disk-persisted local JSON store).

### 2.4 Design and Implementation Constraints
- **Zero Real Currency**: No financial payment gateways; all transactions use platform skill credits.
- **Single Session Review**: To maintain academic integrity, only participants of completed sessions can review each other, restricted to a maximum of one review per participant pair per session.
- **Non-Retroactive Scheduling**: Booking requests cannot be scheduled for past timestamps.

---

## 3. Functional Requirements

### FR-01: User Authentication & Profile Governance
- **FR-01.1**: The system shall allow students to register with Name, College Email, Password (min 6 characters), Department, and Year of Study.
- **FR-01.2**: Passwords shall be hashed using `bcrypt` (minimum 10 salt rounds) prior to storage.
- **FR-01.3**: The system shall prevent duplicate registrations using existing email addresses.
- **FR-01.4**: On registration, the student shall automatically receive 10 welcome skill credits recorded in the `CreditTransaction` ledger.
- **FR-01.5**: Students can view and update their profile details (Bio, Department, Year, and Interests tags).

### FR-02: Skill Management
- **FR-02.1**: Students shall maintain two distinct skill sets: *Teachable Skills* and *Wanted Skills*.
- **FR-02.2**: Each skill entry requires Name, Category, Proficiency Level (Beginner, Intermediate, Advanced), and an optional description.
- **FR-02.3**: Students can edit or delete their skills at any time.

### FR-03: Two-Way Rules-Based Skill Matching Algorithm
- **FR-03.1**: The system shall compute matches by cross-comparing current student skills with all active peer profiles.
- **FR-03.2**: When Student $A$ teaches what Student $B$ wants AND Student $B$ teaches what Student $A$ wants, the system shall classify the connection as a `mutual` match (priority tier).
- **FR-03.3**: The algorithm shall compute a quantitative Synergy Score (0–100%) and output a clear plain-English explanation of why the match exists.
- **FR-03.4**: Students shall be able to filter match results by skill keyword, category, and proficiency.

### FR-04: Session Booking & Lifecycle Management
- **FR-04.1**: Students can dispatch a session request specifying Skill Name, Date, Time, Duration (30–120 mins), and Message/Meeting Link.
- **FR-04.2**: The system shall reject booking dates prior to the current local date.
- **FR-04.3**: A student cannot book a learning session with themselves.
- **FR-04.4**: State transitions shall follow strict rules:
  - `pending` $\rightarrow$ `accepted` (by requested teacher)
  - `pending` $\rightarrow$ `rejected` (by requested teacher)
  - `pending` / `accepted` $\rightarrow$ `cancelled` (by either participant)
  - `accepted` $\rightarrow$ `completed` (by participants or admin)

### FR-05: Skill Credit Barter Economy
- **FR-05.1**: Upon marking an accepted session as `completed`, the system shall award $+5$ skill credits to the mentor.
- **FR-05.2**: The system shall enforce duplicate credit prevention: credits for any session ID can only be rewarded once (`creditsAwarded: true`).
- **FR-05.3**: All credit events shall be written to an immutable `CreditTransaction` ledger.

### FR-06: Ratings and Peer Quality Reviews
- **FR-06.1**: Only completed session participants can submit a review.
- **FR-06.2**: Reviews require a numeric rating between 1 and 5 and a written comment.
- **FR-06.3**: Duplicate reviews by the same student for the same session are strictly blocked.
- **FR-06.4**: Submitting a review recalculates the mentor's cumulative average rating.

### FR-07: In-App Notification Engine
- **FR-07.1**: Real-time notifications shall be created for: booking received, booking accepted, booking rejected, session cancelled, session completed, review posted, and credits rewarded.
- **FR-07.2**: Users can mark notifications as read individually or in bulk.

### FR-08: Administration & Governance
- **FR-08.1**: Administrator endpoints require a validated JWT possessing `role === 'admin'`.
- **FR-08.2**: Admins can audit all platform sessions and user profiles.
- **FR-08.3**: Admins can toggle student account status (`active` $\leftrightarrow$ `suspended`).

---

## 4. Non-Functional Requirements (NFR)

### NFR-01: Security
- Passwords stored strictly as one-way bcrypt hashes.
- Stateless authentication using HMAC-SHA256 JWT tokens.
- All non-public routes guarded with authorization middleware.

### NFR-02: Performance & Response Time
- API endpoints shall respond in under 200ms under standard local workloads.
- Client bundles optimized under 350 kB gzip for near-instant rendering on mobile and desktop.

### NFR-03: Reliability & Fault Tolerance
- Dual-engine database connection ensures the platform runs smoothly even if a standalone MongoDB daemon is uninstalled or offline.

### NFR-04: Usability & Accessibility
- Clean typography (Plus Jakarta Sans & Inter).
- WCAG compliant color contrast ratios and keyboard-accessible modal dialogs.
