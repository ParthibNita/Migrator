import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --- API Routes --- //
import spotifyRoutes from './routes/spotify.routes.js';
app.use('/api/spotify', spotifyRoutes);

import youtubeRoutes from './routes/youtube.routes.js';
app.use('/api/youtube', youtubeRoutes);

app.use((err, _, res, __) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
