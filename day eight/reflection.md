# Course Reflection

The most difficult concept in this course was mastering concurrency control and race condition prevention in database transactions, specifically during high-volume events like ticket drops. Understanding how multiple requests hitting the database at the exact same millisecond can lead to double-bookings initially felt abstract. I overcame this challenge by running hands-on SQL experiments with concurrent transactions, inspecting isolation levels, and learning how atomic conditional updates enforce consistency at the database engine level.

Based on feedback, the part of my capstone I would improve is the error handling and user notification flow when a seat hold expires. Currently, the system simply marks the seat as available again in the database. Adding a real-time WebSocket or Server-Sent Events (SSE) push notification mechanism to inform users when their 10-minute hold countdown is expiring would significantly improve the user experience.

Next, I plan to dive deeper into backend software engineering, focusing on distributed caching strategies with Redis, message queues like Kafka/RabbitMQ for asynchronous task processing, and deep-diving into cloud architecture deployment with Azure and Docker.
