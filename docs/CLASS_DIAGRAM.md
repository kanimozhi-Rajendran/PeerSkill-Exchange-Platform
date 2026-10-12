# Class Diagram Specification
## Peer Skill Exchange Platform

---

## 1. Mermaid Class Diagram

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String department
        +String yearOfStudy
        +String bio
        +Array~String~ interests
        +Array~Skill~ skillsTeachable
        +Array~Skill~ skillsWanted
        +Number credits
        +String role
        +Number averageRating
        +Number reviewCount
        +Boolean isActive
        +Date createdAt
        +register()
        +login()
        +updateProfile()
    }

    class Skill {
        +String id
        +String name
        +String category
        +String proficiency
        +String description
        +Date addedAt
    }

    class Session {
        +ObjectId _id
        +ObjectId teacherId
        +ObjectId learnerId
        +String skillName
        +String date
        +String time
        +Number durationMinutes
        +String message
        +String meetingLink
        +String status
        +Boolean creditsAwarded
        +Date completedAt
        +accept()
        +reject()
        +cancel()
        +complete()
    }

    class Review {
        +ObjectId _id
        +ObjectId sessionId
        +ObjectId reviewerId
        +ObjectId revieweeId
        +Number rating
        +String comment
        +String skillName
        +Date createdAt
        +submitReview()
    }

    class CreditTransaction {
        +ObjectId _id
        +ObjectId userId
        +Number amount
        +String type
        +String description
        +ObjectId referenceSessionId
        +Date createdAt
        +recordTransaction()
    }

    class Notification {
        +ObjectId _id
        +ObjectId userId
        +String title
        +String message
        +String type
        +String link
        +Boolean isRead
        +Date createdAt
        +markAsRead()
    }

    class MatchEngine {
        +calculateMatches(currentUser, allUsers, filters)
        +computeSynergyScore(teachable, wanted)
        +generateExplanation(candidate, skills)
    }

    %% Relationships
    User "1" *-- "0..*" Skill : owns
    User "1" --> "0..*" Session : participates as teacher/learner
    Session "1" --> "0..2" Review : produces
    User "1" --> "0..*" Review : writes/receives
    User "1" --> "0..*" CreditTransaction : audits
    User "1" --> "0..*" Notification : receives
    Session "1" ..> CreditTransaction : triggers on complete
    MatchEngine ..> User : analyzes skills
```

---

## 2. Entity Descriptions & Design Patterns

1. **User Entity**:
   - Represents either a `student` or `admin`.
   - Embeds sub-documents for `skillsTeachable` and `skillsWanted` to enable atomic updates and efficient sub-document indexing.
2. **Session State Entity**:
   - Implements a deterministic Finite State Machine: `pending` $\rightarrow$ `accepted` $\rightarrow$ `completed`.
   - Protects credit issuance with the `creditsAwarded` boolean guard.
3. **CreditTransaction Ledger**:
   - Append-only financial record pattern (audit trail). Ensures credits can never be mutated arbitrarily from client requests.
4. **MatchEngine Service**:
   - Pure domain service encapsulating business rules for two-way reciprocal pairing.
