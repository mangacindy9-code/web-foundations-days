# TicketHub System Design Document

## 1. Requirements

### Functional Requirements
* **Browse Events:** Users can search and view upcoming concerts/events.
* **View Seat Maps:** Users can view real-time availability of seats for a specific event.
* **Hold Seats:** Users can place a temporary 10-minute hold on up to 4 seats while completing checkout.
* **Process Payments & Orders:** Users can pay for held seats and receive order confirmations.
* **View Tickets:** Users can view their purchased tickets and digital barcodes.

### Non-Functional Requirements
* **Correctness (Double-Booking Prevention):** Absolutely zero double-bookings allowed. A seat can only be sold to one user.
* **Speed/Latency:**
  * Seat map views: $< 100\text{ ms}$ (served from cache).
  * Hold/Checkout requests: $< 500\text{ ms}$.
* **Fairness:** High-demand ticket drops must handle users in a fair, first-come-first-served order (via Virtual Waiting Room/Queue).
* **High Availability:** 99.99% uptime during peak ticket releases.

---

## 2. Traffic & Capacity Estimations

### Normal Day Traffic
* **Daily Active Users (DAU):** 50,000 visitors/day.
* **Page Views:** $50,000 \times 10 = 500,000\text{ page views/day}$.
* **Average Read QPS:** $\frac{500,000}{86,400\text{ seconds}} \approx 5.8\text{ QPS}$ (Peak $\approx 15\text{ QPS}$).
* **Daily Ticket Purchases:** 5,000 tickets sold/day.
* **Average Write QPS:** $\frac{5,000}{86,400\text{ seconds}} \approx 0.06\text{ QPS}$.

### "Big Sale" Peak Traffic (Popular Concert Drop)
* **Users:** 200,000 users attempting to buy 20,000 seats within the first 10 minutes (600 seconds).
* **Incoming Request Rate (Reads/Seat Selection):** 200,000 users refreshing/checking seats $\approx 2,000\text{ to }5,000\text{ QPS}$.
* **Write Traffic (Holds/Checkout):** 200,000 attempts over 600 seconds $\approx 333\text{ write attempts/sec}$.

### Key Comparison & Insight
Normal traffic is negligible ($< 15\text{ QPS}$ reads, $< 1\text{ QPS}$ writes). During a major ticket drop, read traffic spikes **$300\times$** and write traffic spikes over **$5,000\times$**. The primary bottleneck is database contention on seat rows for the single event.

---

## 3. API Design

### 1. `GET /api/v1/events`
* **Query Parameters:** `query`, `category`, `page`, `limit`
* **Response (200 OK):**
```json
{
  "events": [
    {"id": "evt_101", "name": "Live Concert", "venue": "Arena A", "date": "2026-11-15T20:00:00Z"}
  ],
  "total": 1
}
  "event_id": "evt_101",
  "seats": [
    {"seat_id": "s_12", "section": "A", "row": "1", "number": "12", "status": "AVAILABLE", "price": 150.00}
  ]
}
  "hold_id": "h_9982",
  "expires_at": "2026-10-30T14:21:00Z",
  "status": "HELD"
}
  "order_id": "ord_5541",
  "status": "CONFIRMED",
  "total_amount": 300.00
}
  "tickets": [
    {"ticket_id": "t_771", "event_name": "Live Concert", "seat": "Sec A, Row 1, Seat 12", "qr_code": "data:image/png;base64,..."}
  ]
}
