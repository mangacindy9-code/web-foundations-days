# Library API Design

A RESTful API design for managing books in a library resource system.

## Endpoints

### 1. List All Books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieves a list of all books in the library inventory.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 2. List Books by Author (Query Parameter)
- **Method:** `GET`
- **Path:** `/api/books?author=Name`
- **Description:** Retrieves a filtered list of books written by a specific author.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 3. Get a Single Book
- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Retrieves details of a specific book by its unique ID.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 4. Create a New Book
- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book record to the library inventory.
- **Request Body Example:**
  ```json
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedYear": 1937,
    "isbn": "978-0547928227"
  }
