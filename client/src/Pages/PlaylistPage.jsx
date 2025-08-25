import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/spotify.js';

export const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/playlists/${id}`);
        setPlaylist(data.data);
      } catch (error) {
        console.error('Failed to fetch playlist', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading)
    return <p className="text-white text-center">Loading playlist...</p>;

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
