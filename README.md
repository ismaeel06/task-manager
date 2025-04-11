# Task Manager

A modern task management application built with React and Material-UI.

## Features

- Create, edit, and delete tasks
- Add due dates to tasks
- Categorize tasks with tags
- Filter tasks by date and tags
- Responsive design for all devices
- User authentication

## Tech Stack

- Frontend: React, Material-UI, React Router
- Backend: Node.js, Express, MongoDB
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
- Create a `.env` file in the server directory
- Add your MongoDB URI and JWT secret

4. Start the development servers:
```bash
# Start the backend server
cd server
npm start

# Start the frontend development server
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration for building and deploying the React application.

## License

This project is licensed under the MIT License. 