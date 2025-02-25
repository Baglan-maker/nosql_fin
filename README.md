# Book Catalog - Full-Stack Web Application

## Overview
This is a full-stack web application for managing a book catalog. Users can register, log in, add books, leave reviews, and interact with other users. Admins have additional privileges such as deleting books and managing user roles.

## Features

### User Management
- User registration and login with validation and password hashing.
- Role-based access control (RBAC) for users and admins.
- Profile management (viewing and updating personal details and addresses).

### Book Management
- Add, edit, and delete books (admin-only for delete).
- Search, filter, and sort books by various criteria.
- Full-text search for book titles and descriptions.

### Reviews & Replies
- Users can leave reviews and ratings on books.
- Users can reply to reviews.
- Review and reply management with validation.
- Reviews are automatically removed after a TTL expiration.

### Analytics
- Aggregated data on books by genre, reviews, and ratings using MongoDB aggregation pipeline.

## Tech Stack

### Backend:
- Node.js with Express.js
- MongoDB (Atlas) with Mongoose ORM
- JWT authentication for secure API access

### Frontend:
- HTML, CSS, JavaScript (Vanilla)
- AJAX-based interaction with backend

### Deployment:
- Deployed backend on Vercel or Render
- MongoDB Atlas for cloud database storage

## Installation & Setup

### Prerequisites:
- Node.js & npm installed
- MongoDB Atlas cluster setup
- Vercel or Render account for deployment

### Backend Setup:
1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/book-catalog.git
    cd book-catalog/backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Configure environment variables:
    - Create a `.env` file and add:
    ```sh
    PORT=5000
    JWT_SECRET=your_jwt_secret
    MONGO_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/bookCatalog
    ```
4. Start the server:
    ```sh
    npm start
    ```

### Frontend Setup:
1. Navigate to the frontend folder:
    ```sh
    cd ../frontend
    ```
2. Ensure the backend is running and accessible.
3. Open `index.html` in a browser.

## API Endpoints

### Auth:
- `POST /api/users/register` – User registration
- `POST /api/users/login` – User login
- `GET /api/users/profile` – Get user profile (auth required)
- `PUT /api/users/profile` – Update user profile (auth required)

### Books:
- `GET /api/books` – Get all books
- `GET /api/books/:id` – Get a book by ID
- `POST /api/books` – Add a new book (auth required)
- `PUT /api/books/:id` – Update a book (auth required)
- `DELETE /api/books/:id` – Delete a book (admin only)

### Reviews:
- `GET /api/reviews/book/:bookId` – Get reviews for a book
- `POST /api/reviews` – Add a review (auth required)
- `POST /api/reviews/:id/reply` – Reply to a review (auth required)
- `DELETE /api/reviews/:id` – Delete a review (admin only)

### Analytics:
- `GET /api/analytics/genre` – Get books grouped by genre
- `GET /api/analytics/books-with-reviews` – Get books with reviews
- `GET /api/analytics/average-rating` – Get average ratings for books

## Deployment

### Steps:
1. Deploy backend to Vercel or Render:
    ```sh
    vercel deploy
    ```
2. Set up MongoDB Atlas and whitelist your IP.
3. Ensure `.env` is correctly configured for deployment.
4. Serve frontend as static files or deploy via Vercel.

## Future Enhancements
- Implement pagination for books and reviews.
- Add book cover image upload feature.
- Improve UI with a modern frontend framework (React or Vue.js).

## License
**Baglan License** - Feel free to use and modify this project!
