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
    { displayName: me.body.display_name, images: me.body.images },
    { upsert: true, new: true }
  );
  const sessionToken = crypto.randomBytes(32).toString('hex');
  // console.log('sessionToken from handling callback', sessionToken);

  const expiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

  await Session.create({
    sessionToken,
    userId: user._id,
    refreshToken: refresh_token,
    expiry,
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('sessionToken', sessionToken, options);

  res.redirect(
    `http://127.0.0.1:5173/dashboard?access_token=${access_token}&expires_in=${expires_in}`
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
  // res.send('playlists');
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // console.log('in Refreshing access token');
  // console.log('req.user', req.session);
  const session = req.session;
  spotifyApi.setRefreshToken(session.refreshToken);

  const data = await spotifyApi.refreshAccessToken();
  const newAccessToken = data.body['access_token'];
  const newExpiresIn = data.body['expires_in'];
  // console.log('The access token has been refreshed!');
  // console.log('newAccessToken', newAccessToken);
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

const getCurrentUser = (req, res) => {
  const user = req.user;
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
};

const logOutUser = asyncHandler(async (req, res) => {
  const { sessionToken } = req.cookies;
  if (!sessionToken) {
    return res
      .status(204)
      .json(new ApiResponse(204, {}, 'No session to clear'));
  }
  await Session.findByIdAndDelete({ _id: req.session._id });
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  return res
    .status(200)
    .clearCookie('sessionToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const getOnePlaylist = asyncHandler(async (req, res) => {
  // console.log('in get user plalist');

  const { id } = req.params;

  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    throw new ApiError(401, 'Access token is missing');
  }

  spotifyApi.setAccessToken(accessToken);

  const data = await spotifyApi.getPlaylist(id);
  // console.log('data', data);

  res
    .status(200)
    .json(new ApiResponse(200, data.body, 'Playlists fetched successfully'));
});
export {
  getLoginUrl,
  handleCallBack,
  getPlaylists,
  refreshAccessToken,
  getCurrentUser,
  logOutUser,
  getOnePlaylist,
};
