import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

// --- API Routes --- //
app.get("/api/test", (req, res) => {
  res.json({
    message: `Hello from the server! ✨ The time is ${new Date().toLocaleTimeString()}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
