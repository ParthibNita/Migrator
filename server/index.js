import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// --- API Routes --- //
import spotifyRoutes from './routes/spotify.routes.js';
app.use('/api/spotify', spotifyRoutes);

app.get('/api/test', (req, res) => {
  res.json({
    message: `Hello from the server! ✨ The time is ${new Date().toLocaleTimeString()}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
