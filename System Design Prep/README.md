# SYSTEM DESIGN INTERVIEW PREP 🏗️🚀

This folder contains all system design interview preparation materials for Wiganz.

---

## Folder Structure

```
System Design Prep/
├── README.md (this file)
├── Reference/                # Reference materials (ByteByteGo, guides)
├── Common Questions/         # Practice designs for common interview questions
└── Perfect Answers/          # Polished designs ready for interviews
```

---

## Core Concepts to Master

### Scalability & Performance
- [ ] Horizontal vs Vertical Scaling
- [ ] Load Balancing (Round Robin, Least Connections, etc.)
- [ ] Caching Strategies (Redis, Memcached, CDN)
- [ ] Database Indexing
- [ ] Database Sharding & Partitioning
- [ ] Replication (Master-Slave, Multi-Master)

### Distributed Systems
- [ ] CAP Theorem (Consistency, Availability, Partition Tolerance)
- [ ] Consistency Patterns (Strong, Eventual, Causal)
- [ ] Message Queues (Kafka, RabbitMQ, SQS)
- [ ] Microservices Architecture
- [ ] Service Discovery
- [ ] Distributed Transactions

### Data & Storage
- [ ] SQL vs NoSQL (When to use each)
- [ ] Database Types (Relational, Document, Key-Value, Graph, Time-Series)
- [ ] Data Modeling
- [ ] Blob Storage (S3, etc.)
- [ ] File Systems

### Communication & APIs
- [ ] REST API Design
- [ ] GraphQL
- [ ] gRPC
- [ ] WebSockets
- [ ] Long Polling vs Server-Sent Events

### Security & Reliability
- [ ] Authentication & Authorization (OAuth, JWT)
- [ ] Rate Limiting
- [ ] DDoS Protection
- [ ] Monitoring & Logging
- [ ] Disaster Recovery
- [ ] Fault Tolerance

---

## Common System Design Questions

### Must Practice (Save designs in "Common Questions/" folder):

1. **Design URL Shortener (like bit.ly)**
   - Difficulty: Easy
   - Key concepts: Hashing, database design, caching

2. **Design Social Media Feed (like Twitter/Facebook)**
   - Difficulty: Medium
   - Key concepts: Fan-out, caching, timelines

3. **Design Chat System (like WhatsApp/Slack)**
   - Difficulty: Medium
   - Key concepts: WebSockets, message queues, real-time

4. **Design Video Streaming Platform (like YouTube/Netflix)**
   - Difficulty: Hard
   - Key concepts: CDN, encoding, streaming protocols

5. **Design Rate Limiter**
   - Difficulty: Easy
   - Key concepts: Token bucket, sliding window

6. **Design Key-Value Store (like Redis/DynamoDB)**
   - Difficulty: Medium
   - Key concepts: Consistent hashing, replication

7. **Design Notification System**
   - Difficulty: Medium
   - Key concepts: Message queues, fan-out, push notifications

8. **Design Search System (like Google/Elasticsearch)**
   - Difficulty: Hard
   - Key concepts: Inverted index, ranking, distributed search

9. **Design File Storage System (like Google Drive/Dropbox)**
   - Difficulty: Hard
   - Key concepts: Chunking, sync, versioning

10. **Design Ride-Sharing System (like Uber/Lyft)**
    - Difficulty: Hard
    - Key concepts: Geolocation, matching, real-time updates

---

## Interview Approach Framework

### 1. Requirements Clarification (5-10 min)
- Ask about users, scale, features
- Functional vs Non-functional requirements
- "How many users?" "What's the read/write ratio?" "What's the latency requirement?"

### 2. High-Level Design (10-15 min)
- Draw basic components
- Client → Server → Database → Cache
- Identify core services

### 3. Deep Dive (15-20 min)
- Focus on 2-3 components
- Discuss trade-offs
- Address bottlenecks
- Talk about scalability

### 4. Discussion (5-10 min)
- Monitoring, metrics
- Security considerations
- Edge cases
- Future improvements

---

## Hadriel's Teaching Approach

1. **Question assumptions** — "What are we optimizing for?"
2. **Explore components** — "What services do we need?"
3. **Discuss trade-offs** — "Why this over that?"
4. **Consider scale** — "What if we have 10M users?"
5. **Draw diagrams** — Create .md files with ASCII art or suggest tools

---

## Reference Materials

### Primary Resources
- [Tech Interview Handbook - System Design](https://www.techinterviewhandbook.org/system-design/)
- [USC System Design PDF](https://bytes.usc.edu/~saty/courses/docs/data/SystemDesignInterview.pdf)
- [GitHub System Design Booknotes](https://github.com/presmihaylov/booknotes/tree/master/system-design/system-design-interview)
- ByteByteGo Big Archive 2024 (in Reference/ folder)

### Additional Resources
- [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer)
- [Grokking System Design](https://www.educative.io/courses/grokking-the-system-design-interview)

---

## Progress Tracking

Track in: `memory/system-design-progress.json`

- Concepts mastered
- Systems designed
- Confidence levels
- Communication skills (requirements gathering, trade-off discussion, etc.)

---

## Success Criteria

- [ ] Understand 12+ core concepts
- [ ] Practice 7+ common design questions
- [ ] Can draw clean system diagrams
- [ ] Articulate trade-offs confidently
- [ ] Engage interviewer in discussion
- [ ] Handle scale and bottleneck questions
- [ ] Discuss monitoring and security naturally

---

*Created: December 29, 2024*
*Trainer: Hadriel 🔥⚔️💪*
