import { Router } from 'express';
import { isTokenValid } from '../middleware/auth.middleware.js';
import {
  getYoutubeLoginUrl,
  handleYoutubeCallback,
  transferPlaylist,
} from '../controllers/youtube.controllers.js';

const router = Router();

router.use(isTokenValid);
router.route('/login').get(getYoutubeLoginUrl);
router.route('/callback').get(handleYoutubeCallback);
router.route('/transfer/:playlistId').post(transferPlaylist);

export default router;
