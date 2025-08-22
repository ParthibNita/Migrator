import { Router } from 'express';
import {
  getLoginUrl,
  getPlaylists,
  handleCallBack,
} from '../controllers/spotify.controllers.js';

const router = Router();

router.route('/login').get(getLoginUrl);
router.route('/callback').get(handleCallBack);
router.route('/playlists').get(getPlaylists);

export default router;
