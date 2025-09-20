import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { useQuery } from '@tanstack/react-query';
import Loader from '../components/Loader.jsx';
import useAuthStore from '../store/AuthStore.jsx';
import usePlaylistStore from '../store/PlaylistStore.jsx';
import { apiClient } from '../api/spotify.js';
import TransferProgress from '../components/TransferProgress.jsx';

const fetchPlaylist = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const { data } = await apiClient.get(`/spotify/playlists/${id}`);
  return data.data;
};
export const PlaylistPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { handleTransfer, handleYoutubeLogin, transferring } =
    usePlaylistStore();
  const [showProgress, setShowProgress] = useState(false);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: fetchPlaylist,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader height={300} />
      </div>
    );

  return (
    <div className="p-8 text-white">
      <div className="flex items-end gap-6 mb-8">
        <img
          src={playlist?.images?.[0]?.url}
          alt={`${playlist?.name} cover`}
          className="w-48 h-48 shadow-lg"
        />
        <div>
          <h1 className="text-5xl font-bold">{playlist?.name}</h1>
          <p className="text-neutral-400 mt-2">{playlist?.description}</p>
          {user?.youtubeAccessToken ? (
            <div className="mt-4">
              <Button
                onClick={() => {
                  setShowProgress(true);
                  handleTransfer(id);
                }}
                disabled={transferring}
                className="cursor-pointer"
              >
                Transfer to YouTube
              </Button>
              {showProgress && transferring && (
                <div className="mt-4">
                  <TransferProgress />
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleYoutubeLogin}
              className="mt-4 cursor-pointer"
            >
              Connect YouTube to Transfer
            </Button>
          )}
        </div>
      </div>

      <div>
        {playlist?.tracks.items.map((item, index) => (
          <div
            key={item.track.id + index}
            className="grid grid-cols-[50px_1fr_100px] items-center gap-4 p-2 rounded-md hover:bg-neutral-800"
          >
            <span className="text-neutral-400">{index + 1}</span>
            <div className="flex items-center gap-4">
              <img
                src={item.track.album.images?.[2]?.url}
                alt={item.track.album.name}
                className="w-10 h-10"
              />
              <div>
                <div className="font-medium">{item.track.name}</div>
                <div className="text-sm text-neutral-400">
                  {item.track.artists.map((a) => a.name).join(', ')}
                </div>
              </div>
            </div>
            <span className="text-sm text-neutral-400">
              {new Date(item.track.duration_ms).toISOString().slice(14, 19)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
