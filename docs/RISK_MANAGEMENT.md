# Software Engineering Risk Management Plan
## Peer Skill Exchange Platform

---

## 1. Risk Analysis & Classification

Risk severity is computed as:
$$\text{Risk Score} = \text{Likelihood (1–5)} \times \text{Impact (1–5)}$$

| Risk ID | Description | Likelihood | Impact | Score | Category |
|---|---|---|---|---|---|
| **R-01** | Local MongoDB Daemon unavailable on evaluator machine | 4 | 5 | 20 (Critical) | Technical |
| **R-02** | Credit duplication via race conditions or double clicks | 2 | 4 | 8 (Medium) | Financial/Integrity |
| **R-03** | Unauthorized access to administrative governance APIs | 2 | 5 | 10 (High) | Security |
| **R-04** | Past-date session booking corrupting timeline metrics | 3 | 3 | 9 (Medium) | Functional |
| **R-05** | Rating manipulation via repeated feedback submission | 2 | 4 | 8 (Medium) | Integrity |
| **R-06** | Browser responsive layout distortion on small screens | 2 | 3 | 6 (Low) | UI/UX |

---

## 2. Mitigation Strategies & Contingency Protocols

### R-01: Local MongoDB Unavailable
- **Mitigation**: Implemented an automated storage abstraction fallback in `config/db.js` and `models/index.js`.
- **Contingency**: If MongoDB times out after 2.5 seconds, the server seamlessly switches to persistent local JSON storage (`server/data/db.json`). Evaluators can test all features with zero installation overhead.

### R-02: Credit Duplication
- **Mitigation**: Implemented the `creditsAwarded: true` boolean guard in `sessionController.js`.
- **Contingency**: Re-invoking the complete session endpoint returns the existing session state without modifying student credit balance or appending duplicate ledger transactions.

### R-03: Admin API Unauthorized Access
- **Mitigation**: Built two-factor middleware validation (`protect` $\rightarrow$ `requireAdmin`).
- **Contingency**: Returns HTTP 403 Forbidden with clear diagnostic feedback for unauthorized requests. Regular students cannot register as admin.

### R-04: Past Date Bookings
- **Mitigation**: Double-layer validation: HTML5 `min` attribute on frontend date picker, plus strict backend `isDateInPast()` check in `sessionController.js`.
