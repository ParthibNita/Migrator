import { Session } from '../models/session.models.js';
import { User } from '../models/user.models.js';
import { ApiError, asyncHandler } from '../utils/ApiHelpers.js';
import crypto from 'crypto';

const isTokenValid = asyncHandler(async (req, _, next) => {
  // console.log('inside middleware');

  // console.log(req.cookies);
  const { sessionToken } = req.cookies;
  if (!sessionToken) {
    throw new ApiError(401, 'Not authenticated');
  }
  const hashedToken = crypto
    .createHash('sha256')
    .update(sessionToken)
    .digest('hex');

  const session = await Session.findOne({ sessionToken: hashedToken });

  if (!session || session.expiry < new Date()) {
    throw new ApiError(401, 'Not Authorized, token is invalid or has expired');
  }

  req.session = session;
  req.user = await User.findById(session.userId);
  // console.log('User in middleware:', req.user);

  if (!req.user) {
    throw new ApiError(401, 'No user found with this token');
  }

  next();
});

export { isTokenValid };
