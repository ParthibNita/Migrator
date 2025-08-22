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

const getPlaylists = (req, res) => {
  // console.log('Authorization', req.headers.authorization);

  const accessToken = req.headers.authorization?.split(' ')[1];
  // console.log('Access', accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  spotifyApi.setAccessToken(accessToken);
  spotifyApi
    .getMe()
    .then((data) => spotifyApi.getUserPlaylists(data.body.id))
    .then((data) => {
      res.json(data.body.items);
    })
    .catch((err) => {
      console.log('Error fetching spotify playlists', err);
      res
        .status(401)
        .json({ error: 'Failed to fetch spotify playlists from backend' });
    });
};
export { getLoginUrl, handleCallBack, getPlaylists };
