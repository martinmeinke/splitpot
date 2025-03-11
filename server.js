import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const server = createServer(app);

// Get allowed origins from environment variable or allow all in development
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ["*"];

console.log('CORS allowed origins:', allowedOrigins);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

// Store for rooms
const rooms = new Map();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Test API endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is alive!', timestamp: new Date().toISOString() });
});

// Socket.io debugging
io.engine.on("connection_error", (err) => {
  console.log('Connection error:');
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Log socket details
  console.log('Socket transport:', socket.conn.transport.name);
  console.log('Socket handshake:', socket.handshake.address);

  // Join room
  socket.on('joinRoom', ({ roomId, userName }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        revealed: false
      });
    }
    
    const room = rooms.get(roomId);
    room.users.set(socket.id, {
      id: socket.id,
      name: userName,
      vote: null
    });
    
    io.to(roomId).emit('updateRoom', {
      users: Array.from(room.users.values()),
      revealed: room.revealed
    });
    
    console.log(`${userName} joined room ${roomId}`);
  });

  // Submit vote
  socket.on('submitVote', ({ roomId, vote }) => {
    const room = rooms.get(roomId);
    if (room && room.users.has(socket.id)) {
      const user = room.users.get(socket.id);
      user.vote = vote;
      room.users.set(socket.id, user);
      
      io.to(roomId).emit('updateRoom', {
        users: Array.from(room.users.values()),
        revealed: room.revealed
      });
    }
  });

  // Reveal votes
  socket.on('revealVotes', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.revealed = true;
      io.to(roomId).emit('updateRoom', {
        users: Array.from(room.users.values()),
        revealed: room.revealed
      });
    }
  });

  // Reset votes
  socket.on('resetVotes', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.revealed = false;
      room.users.forEach(user => {
        user.vote = null;
      });
      
      io.to(roomId).emit('updateRoom', {
        users: Array.from(room.users.values()),
        revealed: room.revealed
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms they were in
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        
        // If room is empty, remove it
        if (room.users.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('updateRoom', {
            users: Array.from(room.users.values()),
            revealed: room.revealed
          });
        }
      }
    });
  });
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
  console.log(`Open your browser to http://localhost:5173`);
  console.log(`Test API endpoint: http://localhost:${PORT}/api/ping`);
  console.log(`Test Socket.IO page: http://localhost:${PORT}/test.html`);
});