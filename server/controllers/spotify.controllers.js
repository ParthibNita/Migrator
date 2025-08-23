import { Session } from '../models/session.models.js';
import { User } from '../models/user.models.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/ApiHelpers.js';
import crypto from 'crypto';
import { spotifyApi, scopes } from '../utils/spotifyAPI.js';

const getLoginUrl = (req, res) => {
  // console.log('Getting login URL');
  const url = spotifyApi.createAuthorizeURL(scopes);
  res
    .status(200)
    .json(new ApiResponse(200, { url }, 'Login URL fetched successfully'));
};

const handleCallBack = asyncHandler(async (req, res) => {
  // console.log('Handling callback');
  const { code } = req.query;
  if (!code) throw new ApiError(400, 'Authorization code is missing');

  const data = await spotifyApi.authorizationCodeGrant(code);
  const { access_token, refresh_token, expires_in } = data.body;
  spotifyApi.setAccessToken(access_token);

  const me = await spotifyApi.getMe();
  const user = await User.findOneAndUpdate(
    { spotifyId: me.body.id },
    { displayName: me.body.display_name, refreshToken: refresh_token },
    { upsert: true, new: true }
  );
  const sessionToken = crypto.randomBytes(32).toString('hex');
  // console.log('sessionToken from handling callback', sessionToken);

  const expiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

  await Session.create({
    sessionToken,
    userId: user._id,
    expiry,
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('sessionToken', sessionToken, options);

  res.redirect(
    `http://127.0.0.1:5173/?access_token=${access_token}&expires_in=${expires_in}`
  );
});

const getPlaylists = asyncHandler(async (req, res) => {
  // console.log('Authorization', req.headers.authorization);
  // console.log('In playlists');

  const accessToken = req.headers.authorization?.split(' ')[1];
  // console.log('Access', accessToken);

  if (!accessToken) {
    throw new ApiError(401, 'Access token is missing');
  }

  spotifyApi.setAccessToken(accessToken);
  const data = await spotifyApi.getUserPlaylists(req.user.spotifyId);

  res
    .status(200)
    .json(
      new ApiResponse(200, data.body.items, 'Playlists fetched successfully')
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const user = req.user;
  spotifyApi.setRefreshToken(user.refreshToken);

  const data = await spotifyApi.refreshAccessToken();
  const newAccessToken = data.body['access_token'];
  const newExpiresIn = data.body['expires_in'];

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, expiresIn: newExpiresIn },
        'Token refreshed'
      )
    );
});

export { getLoginUrl, handleCallBack, getPlaylists, refreshAccessToken };
