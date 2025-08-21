import { Router } from 'express';
import {
  getLoginUrl,
  handleCallBack,
} from '../controllers/spotify.controllers.js';

const router = Router();

router.route('/login').get(getLoginUrl);
router.route('/callback').get(handleCallBack);

export default router;
