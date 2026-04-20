# Adaptive Content Delivery System

Built for the Hackathon. A complete MERN stack application that dynamically adapts the content quality and UI layout based on the user's detected network speed and device type.

## Features Developed
- **Adaptive Engine (Node/Express):** Computes priority stream based on Device + Network parameters, overridable by user preferences.
- **Dynamic Frontend (React/Vite):** Utilizes `useDeviceType` and `useNetworkSpeed` to reactively render `stack/grid/hybrid` layouts and request optimal media bundles.
- **Real-Time Dashboard:** Displays the active hardware environment and actual content quality delivered. Includes a Manual Override mode for instant feedback.
- **JWT Auth & User Preferences:** Persists the user's manual override decisions across sessions.

## Setup Instructions

### Prerequisites
- Node.js installed
- A MongoDB cluster URL (e.g., from MongoDB Atlas)

### 1. Database Configuration
Navigate to `backend/.env` and replace the placeholder `MONGO_URI` with your actual MongoDB Atlas connection string.

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
node seed.js    # This populates your database with sample media
npm start       # In a production setting, or 'node app.js'
```

### 3. Frontend Setup
Open a separate terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`. Open it in your browser.

## Using the Demo
1. **Auto Mode:** The dashboard automatically measures the browser window width (to simulate devices) and your network speed (`navigator.connection`). Try shrinking your browser window to simulate "Mobile" — the UI will switch to a vertical stack, and (if you throttle the network in DevTools to Fast 3G) it will intelligently request "Medium Quality".
2. **Quality Override:** Toggle on Manual Mode in the dashboard to force lower or higher qualities to demonstrate the dynamic loading skeletons and instant quality shift.
