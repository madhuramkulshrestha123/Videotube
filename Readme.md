
# VideoTube

## VideoTube Backend API

This is the backend API for a video hosting website similar to YouTube. It's built using Node.js and Express.js, and implements standard practices for user authentication, authorization, and video management.

### Features

* User Management:
    * User registration and login
    * JWT-based authentication with access and refresh tokens (using bcrypt for password hashing)
* Video Management:
    * Video upload and storage (implementation details depend on your chosen storage solution)
    * Video retrieval (by user, popularity, etc.)
* Subscriptions:
    * Allow users to subscribe to channels
    * Provide functionalities related to subscriptions (e.g., view subscriptions, see videos from subscribed channels)
*  (and potentially many more!)

### Technologies

* Node.js
* Express.js
* Mongoose (or similar ODM for MongoDB) (not explicitly mentioned, but likely used)
* JWT (JSON Web Token)
* bcrypt

### Learning from this Project

This project is designed to be comprehensive and follow best practices, making it a valuable learning resource for anyone interested in building backend APIs for video hosting platforms. You'll gain experience with:

* Building RESTful APIs with Node.js and Express.js
* User authentication and authorization using JWT and bcrypt
* Implementing functionalities for video uploads, retrieval, and management
* Building features like subscriptions and potentially more

### Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`
3. Configure environment variables (database connection, etc.) following instructions in a separate `.env` file (not included in this repository for security reasons).
4. Start the server: `npm start` (or a similar command depending on your setup)


### Model:

![diagram-export-6-23-2024-6_34_54-PM](https://github.com/madhuramkulshrestha123/Videotube/assets/128170524/eb5c006a-8984-4ff6-ad7a-6660d0e32c18)


### Screenshots:
![Screenshot 2024-06-23 223136](https://github.com/madhuramkulshrestha123/Videotube/assets/128170524/e86b13ad-61de-4500-95e3-5046c63c7dea)

![Screenshot 2024-06-23 223308](https://github.com/madhuramkulshrestha123/Videotube/assets/128170524/6a5dfd3c-f161-4bca-b5c1-8ece006a2fd4)

![Screenshot 2024-06-23 223419](https://github.com/madhuramkulshrestha123/Videotube/assets/128170524/34440853-22d3-4ea1-b119-34068e1ea22b)
