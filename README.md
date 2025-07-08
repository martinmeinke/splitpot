# Split Pot

A real-time planning poker application built with Claude code, Svelte and Socket.io.
Hosted at: [Split Pot](https://splitpot.netlify.app)

## Features

- Create or join poker rooms with a unique ID
- Real-time voting with multiple participants
- Reveal/hide votes functionality
- Reset voting for new rounds
- Calculates average of numeric votes
- Clean, responsive UI

## 🔧 Local Development

### Prerequisites

- Node.js 18+ 
- npm

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/martinmeinke/splitpot.git
   cd splitpot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a local environment file:
   ```
   cp .env.example .env.local
   ```

4. Start the development server:
   ```
   npm run dev
   ```

This will start both the frontend (Vite) and backend (Express) servers concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 🌐 Deployment

The application is designed to be deployed as:
- Frontend on Netlify
- Backend on Fly.io

### Deploying the Frontend (Netlify)

1. Create a new site on Netlify
2. Connect your repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables:
   - `VITE_BACKEND_URL`: The URL of your deployed backend (e.g., https://your-app.fly.dev)
5. Deploy!

### Deploying the Backend (Fly.io)

1. Install the Fly.io CLI:
   ```
   curl -L https://fly.io/install.sh | sh
   ```

2. Login to Fly.io:
   ```
   fly auth login
   ```

3. Launch your app (first-time setup):
   ```
   fly launch
   ```
   - This will use the existing `fly.toml` file
   - Choose appropriate region

4. Set environment variables:
   ```
   fly secrets set ALLOWED_ORIGINS=https://splitpot.netlify.app
   ```

5. Deploy the app:
   ```
   fly deploy
   ```

## Usage

1. Open the application in your browser
2. Create a new room or join an existing one by entering the room ID
3. Share the room ID with your team members
4. Select your story point estimate by clicking on a card (options range from
   0.5 to 8, with ☕ indicating a coffee break)
5. When everyone has voted, click "Reveal Votes" to show all estimates
6. Click "Reset Votes" to start a new round

## 🔍 Project Structure

```
├── dist/                 # Built frontend files
├── public/               # Static public assets
├── src/                  # Frontend source code
│   ├── lib/              # Svelte components
│   ├── App.svelte        # Main application component
│   └── main.js           # Frontend entry point
├── server.js             # Backend server code
├── vite.config.js        # Vite configuration
├── netlify.toml          # Netlify configuration
├── fly.toml              # Fly.io configuration
└── Dockerfile            # Docker configuration for Fly.io
```

## 📝 Environment Variables

### Frontend (.env.local)
- `VITE_BACKEND_URL`: URL of the backend API

### Backend
- `PORT`: Port for the server (default: 8080)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## ⚙️ Technologies Used

- **Frontend**: Svelte 5, Vite, Bootstrap 5
- **Backend**: Express.js, Socket.IO
- **Deployment**: Netlify (frontend), Fly.io (backend)
