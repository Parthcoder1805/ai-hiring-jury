export const DEMO_CANDIDATE = {
  name: "Arjun Mehta",
  targetRole: "Senior Backend / Distributed Systems Engineer",
  experienceYears: "5.5 years",
  resumeText: `ARJUN MEHTA
Email: arjun.mehta.dev@example.com | Phone: +1 (555) 382-9102 | Location: San Francisco, CA
GitHub: github.com/arjunmehta-dev | LinkedIn: linkedin.com/in/arjun-mehta-eng

SUMMARY
Senior Software Engineer with 5+ years of experience building high-throughput distributed backend services, event-driven microservices, and high-volume data ingestion pipelines. Expert in Java (Spring Boot), Distributed Systems Architecture (Apache Kafka), PostgreSQL optimization, and Kubernetes. Led critical latency reduction and platform reliability initiatives at scale.

PROFESSIONAL EXPERIENCE

FinScale Technologies — Senior Backend Engineer (2022 - Present)
- Architected and deployed a real-time event-driven transaction processing engine handling 85,000 requests/sec with 99.99% uptime using Java 17, Spring Boot, and Apache Kafka.
- Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees, and end-to-end exactly-once messaging semantics.
- Re-architected PostgreSQL indexing strategy and connection pooling, reducing p99 query latency by 42% across 200M+ financial ledger records.
- Spearheaded migration of legacy monolith to 14 containerized microservices on AWS EKS with zero-downtime Canary deployments.
- Mentored 4 junior and mid-level engineers in distributed system design, clean architecture, and rigorous code reviews.

CloudNexus Solutions — Software Engineer (2019 - 2022)
- Designed and maintained RESTful APIs and background worker pipelines in Java (Spring Boot) and Python (FastAPI).
- Implemented distributed Redis caching layer, decreasing database load by 35% during peak traffic spikes.
- Collaborated with product, frontend, and QA teams to ship 12 core customer-facing features on schedule with comprehensive unit (JUnit) and integration tests (>85% test coverage).
- Participated in 24/7 on-call rotations, triaging production incidents and improving observability via Prometheus and Grafana dashboards.

EDUCATION
Bachelor of Science in Computer Science & Engineering
University of California, Berkeley — Graduated 2019 (GPA: 3.78)

TECHNICAL SKILLS
- Languages: Java (Expert), Python (Proficient), TypeScript, SQL, Go (Familiar)
- Frameworks & Tools: Spring Boot, Spring Cloud, Hibernate/JPA, Apache Kafka (Expert), Redis, Docker, Kubernetes, AWS (EKS, RDS, S3)
- Databases: PostgreSQL, MongoDB, DynamoDB
- Methodologies: Distributed Systems, Domain-Driven Design (DDD), CI/CD (GitHub Actions), Agile/Scrum

CERTIFICATIONS & ACHIEVEMENTS
- AWS Certified Solutions Architect – Associate (2023)
- Confluent Certified Developer for Apache Kafka (CCDAK) (2023)
- Hackathon Winner: FinTech Open Innovation Challenge (1st Place, 2021)
`,

  transcriptText: `INTERVIEW TRANSCRIPT
Candidate: Arjun Mehta
Target Role: Senior Backend / Distributed Systems Engineer
Interviewers: Sarah (Engineering Lead), Marcus (Staff Architect)
Date: August 24, 2026

[00:01] Sarah: "Hi Arjun, thanks for joining us today! We're excited to learn more about your experience, particularly with high-throughput distributed systems and event-driven architecture."

[00:15] Arjun: "Thanks Sarah and Marcus! Really glad to be here. I've spent the last 3 years heavily focused on distributed backend systems at FinScale, and I'm very eager to dive into the technical details."

[01:05] Marcus: "Great! Let's start with your experience at FinScale. Your resume mentions you architected an event-driven engine processing 85,000 requests per second using Spring Boot and Apache Kafka with exactly-once semantics. Walk us through how you designed that cluster and partition strategy."

[01:30] Arjun: "Sure! At FinScale, our core payment gateway had to ingest transactions from hundreds of partner banks. We spun up Spring Boot services that published payment payloads to Kafka topics. For partitioning, we partitioned by merchant_id and account_id to guarantee sequential ordering per account. We tuned consumer concurrency and used transaction IDs to achieve idempotent processing on the consumer end."

[02:45] Marcus: "That makes sense. Can you drill deeper into partition rebalancing and consumer lag? In high-throughput Kafka systems, what happens during rebalance storms or when a consumer gets stuck, and how did you tune the max.poll.interval.ms and session.timeout.ms?"

[03:10] Arjun: "Well... to be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs. My team primarily wrote the Spring Kafka consumer and producer services. Whenever we had severe partition lag or rebalancing storms, we usually coordinated with the DevOps/Infra team to increase consumer instances or adjust the consumer group lag thresholds. I understand the conceptual flow of cooperative sticky rebalancing, but in day-to-day work, I was mostly consuming existing topics and focusing on application-level business logic rather than low-level broker tuning."

[04:25] Marcus: "Got it, that's very helpful clarification. Let's talk about the database optimization. You mentioned reducing p99 latency by 42% on a 200M record PostgreSQL database. How did you diagnose the bottlenecks and what changes did you execute?"

[04:50] Arjun: "That was one of my favorite projects! We noticed our reconciliation query was locking tables during month-end closing. I used pg_stat_statements and EXPLAIN ANALYZE to identify sequential table scans on our transactions table. We discovered that a compound index on (account_id, created_at, status) was missing, and queries were scanning unindexed timestamp ranges. We created composite partial indexes concurrently without taking the database down, rewritten the pagination from OFFSET to keyset cursor pagination, and tuned PgBouncer pool sizes. That dropped our p99 from 3.2 seconds down to ~1.8 seconds."

[06:10] Sarah: "Impressive work on the database side! Let's shift to teamwork and culture. Can you tell us about a time when you strongly disagreed with a senior engineer or product manager on an architectural decision?"

[06:30] Arjun: "Absolutely. At FinScale, our Product team wanted to implement an instant refunds feature with synchronous HTTP REST calls chaining across three downstream payment providers. I knew that synchronous chaining would introduce catastrophic cascading timeouts if any third-party gateway lagged. I set up a quick benchmark demo showing how a 500ms spike on one provider stalled the entire thread pool. Instead of just saying 'no', I proposed an asynchronous saga pattern with webhook callbacks and a Redis status poller. We sat down together, mapped the trade-offs, and they agreed with the async approach. It took 3 extra days to build, but it prevented numerous customer outages."

[07:55] Sarah: "How do you handle mentoring and knowledge sharing in your team?"

[08:15] Arjun: "I love mentoring. We had two junior engineers join last year who were new to Spring Boot and microservices. I set up bi-weekly 1-on-1 architecture walkthroughs, created our team's standard PR review checklist, and instituted pair programming sessions for complex debugging tasks. When they made mistakes in staging, I made sure we conducted blameless post-mortems so the whole team learned together."

[09:20] Marcus: "One last technical question: If you had to build a rate limiter for a multi-tenant API gateway from scratch today, what algorithm and storage strategy would you choose?"

[09:40] Arjun: "I'd use a Sliding Window Counter algorithm backed by Redis with Lua scripts to ensure atomicity. Sliding window gives accurate rate limiting without the burst boundary problems of Fixed Window, and doing it in a Redis Lua script prevents race conditions between checking the count and incrementing it."

[10:30] Sarah: "Thank you Arjun! That covers our main questions. Do you have any questions for us?"

[10:45] Arjun: "Yes, I'd love to know what the biggest engineering challenge is for your team over the next 12 months, and how you see this role contributing to that mission..."
`,
};
