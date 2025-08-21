import { spotifyApi, scopes } from '../utils/spotifyAPI.js';

const getLoginUrl = (req, res) => {
  const url = spotifyApi.createAuthorizeURL(scopes);
  res.json({ url });
};

const handleCallBack = (req, res) => {
  const { error, code } = req.query;

  if (error) {
    console.log('Spotify Callback Error', error);
    res.redirect(`http://localhost:5173/?error=${error}`);
    return;
  }

  spotifyApi.authorizationCodeGrant(code).then(
    (data) => {
      const { access_token, refresh_token, expires_in } = data.body;
      res.redirect(
        `http://localhost:5173/?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
      );
    },
    (err) => {
      console.error('Error getting Tokens:', err);
      res.redirect(`http://localhost:5173/?error=invalid_token`);
    }
  );
};

export { getLoginUrl, handleCallBack };
