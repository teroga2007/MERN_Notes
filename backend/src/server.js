import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//Middleware

if (process.env.NODE_ENV !== 'production') {
  // Enable CORS for dev environment since we have 2 ports running (frontend and backend)
  app.use(cors(
    {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // Allow cookies to be sent
    }
  ));
}

app.use(express.json());
app.use(rateLimiter);


app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


// Connect to  and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running.`);
  });
});