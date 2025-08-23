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
    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
