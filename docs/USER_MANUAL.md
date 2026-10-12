# User Manual & Step-by-Step Walkthrough
## Peer Skill Exchange Platform

---

## 1. Quick Start & Demonstration Roles

Use the pre-configured demo credentials for instant evaluation:

| Persona | Name | Email | Password | Role / Skills |
|---|---|---|---|---|
| **Student A** | Priya Sharma | `priya@peerskill.edu` | `Password@123` | Teaches: Python, React • Wants: Excel |
| **Student B** | Rahul Verma | `rahul@peerskill.edu` | `Password@123` | Teaches: Excel, ML • Wants: Python *(Mutual Match!)* |
| **Student C** | Ananya Patel | `ananya@peerskill.edu` | `Password@123` | Teaches: Figma, Design • Wants: C++ |
| **Student D** | Karthik Iyer | `karthik@peerskill.edu` | `Password@123` | Teaches: C++, AutoCAD • Wants: Figma *(Mutual Match!)* |
| **Admin** | Campus Admin | `admin@peerskill.edu` | `Admin@123` | Platform Governance & Moderation |

---

## 2. Student User Guide

### 2.1 Logging In & Navigation
1. Visit `http://localhost:3000/login`.
2. Click the quick button **"Priya Sharma"** or enter `priya@peerskill.edu` / `Password@123`.
3. Click **"Sign In"**. You are redirected to your student dashboard.
4. The dashboard displays your **Credit Balance (🪙 20 Credits)**, **Mutual Matches count**, and **Recent Sessions**.

### 2.2 Adding and Managing Skills
1. Click **"Manage Skills"** in the sidebar.
2. Under **"Skills I Can Teach"**, click **"Add Teachable Skill"**.
3. Enter Skill Name (e.g., `Node.js Fundamentals`), Category (`Programming`), and Proficiency (`Intermediate`).
4. Click **"Save Skill"**. It is now visible to peer learners across the college.

### 2.3 Demonstrating the Mutual Skill Match
1. Click **"Skill Matches"** in the sidebar.
2. The system evaluates Priya's skills against other students.
3. Observe **Rahul Verma** displayed at the top with a **"🌟 2-WAY MUTUAL EXCHANGE"** banner and a **95% Match Score**.
4. Read the explanation:  
   *`"You can teach Rahul Verma (Python), and in return, Rahul Verma can teach you (Excel). Zero money needed!"`*

### 2.4 Booking a Session
1. On Rahul's match card, click **"Book Session"**.
2. The booking dialog appears:
   - Select skill: `Excel (Advanced)`
   - Choose a date (restricted to today or future dates).
   - Select time and duration (e.g. 60 mins).
   - Add notes: *"Looking forward to Excel formulas!"*
3. Click **"Send Session Request"**. A real-time notification is generated for Rahul.

### 2.5 Accepting & Completing Sessions
1. Log in as Rahul Verma (`rahul@peerskill.edu` / `Password@123`).
2. Navigate to **"My Sessions"** $\rightarrow$ **"Incoming Requests"**.
3. Click **"Accept Session"**. The session moves to **"Upcoming Scheduled"**.
4. Once conducted, click **"Mark Completed"**.
5. The mentor receives **$+5$ Skill Credits** and an automated ledger record!

### 2.6 Submitting Peer Reviews
1. In **"My Sessions"** $\rightarrow$ **"History & Reviews"**, click **"Rate & Review"**.
2. Select 1 to 5 stars and enter feedback comments.
3. Click **"Submit Review"**. The mentor's average rating updates dynamically.

---

## 3. Administrator Guide

1. Log in with `admin@peerskill.edu` / `Admin@123`.
2. The sidebar displays the **"Admin Portal"** option.
3. Review total platform statistics (Active Students, Total Sessions, Skills Exchanged, Tokens Issued).
4. In the **Registered Students** table, click **"Suspend"** on any student to temporarily deactivate access.
5. In the **Session Audit Log**, monitor scheduled topics and confirmed credit payouts.
