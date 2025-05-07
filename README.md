# EventHub - Event Management Website

A full-stack event management website with user authentication and event management features.

## Features

- User authentication (login/register)
- Create, view, and manage events
- Register for events
- Event categories and search
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd event-management-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
```

5. Start the backend server:
```bash
npm run dev
```

6. Open `index.html` in your browser or serve it using a local server.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create a new event
- PUT `/api/events/:id` - Update an event
- DELETE `/api/events/:id` - Delete an event
- PUT `/api/events/:id/register` - Register for an event

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Fetch API

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
