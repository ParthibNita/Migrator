import { Router } from 'express';
import {
  getCurrentUser,
  getLoginUrl,
  getPlaylists,
  handleCallBack,
  logOutUser,
  refreshAccessToken,
} from '../controllers/spotify.controllers.js';
import { isTokenValid } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/login').get(getLoginUrl);
router.route('/callback').get(handleCallBack);
router.route('/playlists').get(isTokenValid, getPlaylists);
router.route('/refreshToken').post(isTokenValid, refreshAccessToken);
router.route('/currentUser').get(isTokenValid, getCurrentUser);
router.route('/logout').post(isTokenValid, logOutUser);

export default router;
