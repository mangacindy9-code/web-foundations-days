# School Database Design

## Table Explanations
- **`students`**: Stores individual student profiles. Contains a unique email constraint to ensure no duplicate accounts.
- **`courses`**: Stores available courses offered by the institution, identified by a unique course code.
- **`enrolments`**: Acts as a junction table tracking which student is enrolled in which course, alongside their assigned grade.

## Relationships
- **Students & Enrolments (One-to-Many):** One student can have multiple enrolment records, but each enrolment record belongs to exactly one student.
- **Courses & Enrolments (One-to-Many):** One course can have multiple enrolments, but each enrolment record points to a single course.
- **Students & Courses (Many-to-Many):** Because a student can take many courses and a course can have many students, a direct relationship cannot be represented cleanly in relational tables. A **join table (`enrolments`)** is required to bridge the two entities and store relational attributes like grades.

## Recommended Index
- **Index:** `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
- **Reason:** As the database grows, querying enrolments filtered by a specific student ID is a frequent operation. Adding an index on `student_id` speeds up lookups significantly by avoiding full table scans.

## SQL vs. NoSQL Choice
For a school management system with structured entities (students, courses, grades) and strict relational integrity requirements (foreign keys preventing orphan records, unique constraints preventing double enrolments, and ACID compliance for grade updates), a **Relational SQL database** is the superior choice. NoSQL databases are better suited for unstructured data or rapid, schema-less scaling, whereas relational engines excel at maintaining dependable relationships and structured querying.
