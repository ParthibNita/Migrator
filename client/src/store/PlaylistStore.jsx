import { apiClient } from '../api/spotify.js';
import { create } from 'zustand';

const usePlaylistStore = create((set) => ({
  playlist: null,
  loading: true,
  error: null,
  transferring: false,

  fetchPlaylist: async (id) => {
    try {
      const { data } = await apiClient.get(`/spotify/playlists/${id}`);
      set({ playlist: data.data });
    } catch (error) {
      set({ error, loading: false });
      console.error('Failed to fetch playlist', error);
    } finally {
      set({ loading: false });
    }
  },

  handleYoutubeLogin: async () => {
    try {
      const { data } = await apiClient.get('/youtube/login');
      window.location.href = data.data.url;
    } catch (error) {
      console.error('Failed to get YouTube login URL', error);
    }
  },

  handleTransfer: async (id) => {
    try {
      set({ transferring: true });
      await apiClient.post(`/youtube/transfer/${id}`);
      alert('Playlist transfer complete!');
    } catch (error) {
      set({ error });
      console.error('Failed to transfer playlist', error);
      alert('Playlist transfer failed.');
    } finally {
      set({ transferring: false });
    }
  },
}));

export default usePlaylistStore;
