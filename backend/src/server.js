import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent
  }
));
app.use(express.json());
app.use(rateLimiter);


app.use("/api/notes", notesRoutes);

// Connect to  and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});