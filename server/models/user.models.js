import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    spotifyId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
