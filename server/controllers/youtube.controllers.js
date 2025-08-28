import { asyncHandler, ApiError, ApiResponse } from '../utils/ApiHelpers.js';
import { oauth2Client, scopes, youtube } from '../utils/youtubeAPI.js';
import { User } from '../models/user.models.js';
import { spotifyApi } from '../utils/spotifyAPI.js';

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

  // console.log('start credentials');
  spotifyApi.setAccessToken(req.headers.authorization?.split(' ')[1]);
  oauth2Client.setCredentials({
    access_token: youtubeAccessToken,
    refresh_token: youtubeRefreshToken,
  });
  // console.log('end crededntials');

  // console.log('start spotify playlist');

  const spotifyPlaylist = await spotifyApi.getPlaylist(playlistId);
  const tracks = spotifyPlaylist.body.tracks.items;
  const playlistName = spotifyPlaylist.body.name;

  // console.log('tracks', tracks);
  // console.log('playlists', playlistName);

  const videoIds = [];

  for (const item of tracks) {
    const track = item.track;
    const query = `${track.name} ${track.artists[0].name} official audio`;
    console.log('hello');

    try {
      const searchResult = await youtube.search.list({
        part: 'snippet',
        q: query,
        maxResults: 1,
        type: 'video',
      });
      console.log('finally');

      if (searchResult.data.items.length > 0) {
        videoIds.push(searchResult.data.items[0].id.videoId);
      }
    } catch (err) {
      console.error('--- YOUTUBE API ERROR ---');
      console.error('Failed to search for track:', query);
      console.error('Error Details:', err.errors || err.message);
      process.exit(1);
    }
  }
  // console.log('end spotify playlist');

  // console.log('start youtube playlist');
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

  for (const videoId of videoIds) {
    await youtube.playlistItems.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          playlistId: newPlaylistId,
          resourceId: { kind: 'youtube#video', videoId: videoId },
        },
      },
    });
  }
  console.log('end youtube playlist');

  res
    .status(200)
    .json(
      new ApiResponse(200, { playlistId: newPlaylistId }, 'Transfer complete!')
    );
});

export { getYoutubeLoginUrl, handleYoutubeCallback, transferPlaylist };
