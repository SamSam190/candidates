# Candidate Profile Shortlisting System using AI API

This is a Full-Stack MERN (MongoDB, Express, React, Node.js) application that ranks and shortlists candidates based on their skills and uses the OpenRouter AI API to give intelligent insights about the best candidates for a job.

## Setup Instructions

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open the `.env` file and replace `your_openrouter_api_key_here` with your actual OpenRouter API key.
3. Make sure you have MongoDB running locally, or change the `MONGO_URI` in `.env` to your MongoDB Atlas cluster URI.
4. Start the backend server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the React development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Features
- Add candidate details (Name, Email, Skills, Experience, Bio)
- Create job requirements (Required Skills, Min Experience)
- Backend logic to match candidates by percentage
- AI (OpenRouter) integration to analyze and rank the most suitable candidates.
