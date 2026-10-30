# SnapShare - System Scaling Plan

## 1. Assumptions & Daily Active Users (DAU)

### Assumptions
* **Total Registered Users:** 10,000,000
* **Activity Rate:** 10% of registered users are active daily.
* **User Engagement:** Each active user uploads 1 photo per day and views 50 feed pages per day.
* **File Sizes:** Average raw photo size is 2 MB; generated thumbnail size is 50 KB.
* **Time Scale Estimate:** 1 day $\approx$ 100,000 seconds for simplified calculation.

### Daily Active Users (DAU) Calculation
$$\text{DAU} = 10,000,000 \text{ registered users} \times 10\% = 1,000,000 \text{ active users/day}$$

---

## 2. Traffic & Storage Calculations

### Uploads & Feed Views (Average & Peak)
* **Uploads per Day:** $1,000,000 \text{ users} \times 1 \text{ photo/day} = 1,000,000 \text{ uploads/day}$
* **Uploads per Second (Average):** 
  $$\frac{1,000,000 \text{ uploads}}{100,000 \text{ seconds}} = 10 \text{ uploads/sec}$$
* **Uploads per Second (Peak at $5\times$):** 
  $$10 \times 5 = 50 \text{ uploads/sec}$$

* **Feed Views per Day:** $1,000,000 \text{ users} \times 50 \text{ feed pages/day} = 50,000,000 \text{ feed views/day}$
* **Feed Views per Second (Average):** 
  $$\frac{50,000,000 \text{ views}}{100,000 \text{ seconds}} = 500 \text{ reads/sec}$$
* **Feed Views per Second (Peak at $5\times$):** 
  $$500 \times 5 = 2,500 \text{ reads/sec}$$

### Storage per Year
* **Raw Photos Storage (Daily):** 
  $$1,000,000 \text{ photos/day} \times 2 \text{ MB} = 2,000,000 \text{ MB/day} = 2 \text{ TB/day}$$
* **Thumbnails Storage (Daily):** 
  $$1,000,000 \text{ thumbnails/day} \times 50 \text{ KB} = 50,000,000 \text{ KB/day} = 0.05 \text{ TB/day} (50 \text{ GB})$$
* **Total Storage per Year (365 days):** 
  $$(2 \text{ TB} + 0.05 \text{ TB}) \times 365 \text{ days} = 2.05 \text{ TB/day} \times 365 = \mathbf{748.25 \text{ TB/year}}$$

---

## 3. Read-Heavy vs. Write-Heavy Analysis

SnapShare is **heavily read-heavy**. 
* **Ratio:** With 500 average reads/sec compared to 10 writes/sec, the system experiences a **50:1 read-to-write ratio**.
* **Design Implications:** The architecture must prioritize high-speed read operations. This is achieved by utilizing database read replicas, caching feed timelines in Redis, and distributing static photo assets via a CDN to minimize load on primary database and storage systems.

---

## 4. Photo Storage Strategy

Photos **must not** be stored inside the relational database. Storing large binary blobs (2 MB files) directly in a database bloats database size, slows down backups, degrades query performance, and increases disk I/O bottlenecks. 

Instead, photo binary files should be stored in **Object Storage** (e.g., AWS S3 or Google Cloud Storage), while the relational database only stores lightweight metadata (such as the user ID, caption, timestamp, and object storage URL/key).

---

## 5. Architecture Diagram

```text
[Client / Mobile App]
          │
          ▼
    [CDN (Edge Caching)] ──(Serves Static Photos & Thumbnails)
          │
          ▼
    [Load Balancer]
          │
          ├──► [App Server 1] ──┐
          └──► [App Server 2] ──┼──► [Redis Cache] (Feed Timelines & Sessions)
                                │
                                ├──► [Primary DB] (Writes: Users & Post Metadata)
                                │         │
                                │         └──(Replication)──► [Read Replica] (Reads)
                                │
                                ├──► [Object Storage] (Raw Photos & Thumbnails)
                                │
                                └──► [Message Queue] ──► [Background Worker] (Thumbnail Generation)
