import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://127.0.0.1:8888/api/youtube/callback'
);

const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl'];

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export { oauth2Client, scopes, youtube };
