# Test Plan & Execution Report
## Peer Skill Exchange Platform

**Subject:** Web Application Development (WAD) & Software Engineering (SEPM)  
**Standard:** IEEE Std 829-2008 Test Documentation  
**Version:** 1.0.0  

---

## 1. Test Strategy & Scope

The testing strategy validates functional compliance, data integrity, and security across the entire MERN stack.

### Testing Types Conducted:
1. **Unit Testing**: Testing pure domain functions (e.g. matching score calculation, past date validation).
2. **Integration Testing**: Testing API routes, JWT authentication headers, and database persistence.
3. **Security Testing**: Testing password hashing, non-admin role rejection, and unauthorized state changes.
4. **Build & Frontend Verification**: Vite production compilation and module bundling.

---

## 2. Test Execution Matrix & Results

| Test ID | Test Scenario | Input / Test Vector | Expected Outcome | Execution Result |
|---|---|---|---|---|
| **TC-01** | Database Connectivity & Seed Verification | Execute seed script on server startup | At least 5 user records exist; Priya & Rahul present | **PASS** (3.8ms) |
| **TC-02** | Password Hashing Verification | Authenticate Rahul with `'Password@123'` vs `'WrongPassword'` | Bcrypt verifies correct password; rejects incorrect | **PASS** (144.8ms) |
| **TC-03** | JWT Token Issuance & Validation | Sign JWT with user ID; verify with secret key | Decoded token ID matches user ID; valid signature | **PASS** (9.3ms) |
| **TC-04** | Two-Way Skill Match Calculation | Compare Priya (teaches Python, wants Excel) & Rahul (teaches Excel, wants Python) | Match classified as `'mutual'`; score $\ge 85\%$; rationale generated | **PASS** (2.9ms) |
| **TC-05** | Booking Past-Date Prevention | Attempt to book a session with date `'2020-01-01'` | System identifies date as past and rejects booking | **PASS** (0.1ms) |
| **TC-06** | Credit Payout & Duplicate Prevention | Mark session completed; verify credits awarded once | Mentor receives $+5$ credits; repeated trigger cannot duplicate payout | **PASS** (8.1ms) |
| **TC-07** | Duplicate Review Prevention | Post a review for session; attempt duplicate submission | Second review blocked; maintains 1 review per session | **PASS** (3.5ms) |
| **TC-08** | Admin Role Authorization Guard | Access admin endpoints with student vs admin role | Student denied (403); Admin allowed (200) | **PASS** (1.6ms) |
| **TC-09** | Frontend Production Build | `npm --prefix client run build` | 0 syntax errors, bundle generated under 350kB | **PASS** (13.8s) |

---

## 3. Automated Test Execution Evidence

```
▶ Peer Skill Exchange - Backend Automated Tests
  ✔ 1. Database connectivity & seed validation (3.8507ms)
  ✔ 2. Authentication: Password hashing & bcrypt verification (144.7894ms)
  ✔ 3. Authentication: JWT token generation and validation (9.3384ms)
  ✔ 4. Skill Matching: True Two-Way Mutual Match detection (2.8655ms)
  ✔ 5. Session Booking: Past booking dates must be rejected (0.137ms)
  ✔ 6. Session Lifecycle & Credit Integrity: Credits awarded ONLY ONCE (8.1457ms)
  ✔ 7. Review & Rating: Prevent duplicate reviews for same session (3.477ms)
  ✔ 8. Authorization: Admin role check blocks non-admin users (1.6205ms)
✔ Peer Skill Exchange - Backend Automated Tests (5416.9937ms)
ℹ tests 8
ℹ suites 1
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```
