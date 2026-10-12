# Software Maintenance & Evolution Plan
## Peer Skill Exchange Platform

**Subject:** Software Engineering and Project Management (SEPM)  
**Standard:** ISO/IEC 14764 Software Engineering — Software Life Cycle Processes — Maintenance  
**Version:** 1.0.0  

---

## 1. Maintenance Categories

### 1.1 Corrective Maintenance (Bug Remediation)
- **Monitoring**: Centralized error logging in `server.js` with structured HTTP response payloads.
- **SLA**: Critical issues (authentication blockers, credit duplication anomalies) resolved within 4 hours; non-critical UI glitches resolved within 24 hours.
- **Verification**: Any bug fix must include an automated regression test in `server/tests/api.test.js`.

### 1.2 Adaptive Maintenance (Environment Updates)
- Periodic npm dependency audits (`npm audit`) and Node.js LTS upgrades.
- Database scaling: Seamless transition from single-node instances to MongoDB Atlas replica sets by updating `MONGODB_URI` in `.env`.

### 1.3 Perfective Maintenance (Performance & User Experience)
- Index optimization on MongoDB collections (`sessionId`, `reviewerId`, `teacherId`).
- Client asset caching and code splitting via Vite.

---

## 2. Backup & Disaster Recovery Protocols

1. **Database Backups**:
   - `mongodump` cron job executed nightly at 02:00 AM UTC with 14-day retention.
   - For local JSON mode: Automatic snapshots saved to `server/data/backups/`.
2. **Rollback Strategy**:
   - Git version tags on every release sprint (`v1.0.0`, `v1.1.0`). Instant rollback capability via PM2 or container tags.

---

## 3. Future Enhancements Roadmap

1. **Phase 2 (Mobile App)**: Progressive Web App (PWA) offline caching and native push notifications.
2. **Phase 3 (Live Video Integration)**: WebRTC embedded audio/video rooms directly inside the browser session interface.
3. **Phase 4 (AI Skill Assessment)**: Automated quiz assessment validating student self-reported proficiency before listing Advanced skills.
