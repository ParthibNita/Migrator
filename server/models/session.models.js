import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

sessionSchema.pre('save', function (next) {
  if (this.isModified('sessionToken')) {
    this.sessionToken = crypto
      .createHash('sha256')
      .update(this.sessionToken)
      .digest('hex');
  }
  next();
});

export const Session = mongoose.model('Session', sessionSchema);
