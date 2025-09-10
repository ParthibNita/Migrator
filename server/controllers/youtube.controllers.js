import { asyncHandler, ApiError, ApiResponse } from '../utils/ApiHelpers.js';
import { oauth2Client, scopes, youtube } from '../utils/youtubeAPI.js';
import { User } from '../models/user.models.js';
import { spotifyApi } from '../utils/spotifyAPI.js';
import redis from '../utils/redis.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const retry = async (fn, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(
        `API call failed, retrying in ${delayMs}ms... (Attempt ${i + 1})`
      );
      await delay(delayMs);
    }
  }
};

const getYoutubeLoginUrl = asyncHandler(async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: req.user._id.toString(),
  });
  res.status(200).json(new ApiResponse(200, { url }));
});

const handleYoutubeCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const userId = state;

  const { tokens } = await oauth2Client.getToken(code);

  await User.findByIdAndUpdate(userId, {
    youtubeAccessToken: tokens.access_token,
    youtubeRefreshToken: tokens.refresh_token,
  });

  res.redirect('http://127.0.0.1:5173/');
});

const transferPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { youtubeAccessToken, youtubeRefreshToken } = req.user;
  const socketId = req.headers['x-socket-id'];
  console.log('socketId', socketId);

  const sendProgress = (progress, message) => {
    console.log(`Progress: ${progress}% - ${message}`);
    if (socketId)
      req.io.to(socketId).emit('transfer_progress', { progress, message });
  };

  sendProgress(5, 'Authenticating services...');
  spotifyApi.setAccessToken(req.headers.authorization?.split(' ')[1]);
  oauth2Client.setCredentials({
    access_token: youtubeAccessToken,
    refresh_token: youtubeRefreshToken,
  });

  sendProgress(10, 'Fetching tracks from Spotify...');
  const spotifyPlaylist = await spotifyApi.getPlaylist(playlistId);
  let tracks = spotifyPlaylist.body.tracks.items;
  let next = spotifyPlaylist.body.tracks.next;
  while (next) {
    const urlParams = new URLSearchParams(next.split('?')[1]);
    const offset = parseInt(urlParams.get('offset'));
    const limit = parseInt(urlParams.get('limit'));
    sendProgress(15, `Fetching more tracks (found ${tracks.length})...`);
    const nextPage = await spotifyApi.getPlaylistTracks(playlistId, {
      offset,
      limit,
    });
    tracks = tracks.concat(nextPage.body.items);
    next = nextPage.body.next;
  }
  const playlistName = spotifyPlaylist.body.name;

  const videoIds = [];
  for (const [index, item] of tracks.entries()) {
    const track = item.track;
    if (!track) continue;

    const progress = 20 + Math.round(((index + 1) / tracks.length) * 60);
    sendProgress(progress, `Searching for: ${track.name}`);

    const cacheKey = `spotify:track:${track.id}`;
    let videoId = await redis.get(cacheKey);

    if (videoId) {
      console.log(`CACHE HIT: Found ${track.name} in Redis.`);
      videoIds.push(videoId);
    } else {
      console.log(`CACHE MISS: Searching YouTube for ${track.name}`);
      const query = `${track.name} ${track.artists[0]?.name || ''}`;

      const searchFn = () =>
        youtube.search.list({
          part: 'snippet',
          q: query,
          maxResults: 1,
          type: 'video',
          videoCategoryId: '10',
        });

      try {
        const searchResult = await retry(searchFn);
        if (searchResult.data.items.length > 0) {
          videoId = searchResult.data.items[0].id.videoId;
          videoIds.push(videoId);
          await redis.set(cacheKey, videoId, 'EX', 60 * 60 * 24 * 7);
        }
      } catch (err) {
        console.error(
          `Failed to find track "${query}" after retries.`,
          err.message
        );
        if (err.message.includes('quota'))
          throw new ApiError(429, 'YouTube API quota exceeded.');
      }
    }
  }

  sendProgress(85, 'Creating playlist on YouTube...');
  const newYoutubePlaylist = await youtube.playlists.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: `${playlistName} (from Spotify)`,
        description: `Transferred from Spotify. Created by Playlist Fusion.`,
      },
      status: { privacyStatus: 'private' },
    },
  });
  const newPlaylistId = newYoutubePlaylist.data.id;

  sendProgress(90, 'Adding songs to the new playlist...');
  for (const videoId of videoIds) {
    const insertFn = () =>
      youtube.playlistItems.insert({
        part: 'snippet',
        requestBody: {
          snippet: {
            playlistId: newPlaylistId,
            resourceId: { kind: 'youtube#video', videoId: videoId },
          },
        },
      });
    await retry(insertFn);
  }

  sendProgress(100, 'Transfer complete!');
  res
    .status(200)
    .json(
      new ApiResponse(200, { playlistId: newPlaylistId }, 'Transfer complete!')
    );
});

export { getYoutubeLoginUrl, handleYoutubeCallback, transferPlaylist };
