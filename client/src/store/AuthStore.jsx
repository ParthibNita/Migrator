import { create } from 'zustand';
import { apiClient, getUserPlaylists } from '../api/spotify.js';

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  playlists: [],
  loading: true,

  verifyUser: async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('access_token');
      const expiry = urlParams.get('expires_in');

      if (token && expiry) {
        localStorage.setItem('spotify_accesstoken', token);
        localStorage.setItem(
          'spotify_expiry',
          Date.now() + parseInt(expiry) * 1000
        );
        window.history.pushState({}, document.title, '/');
        set({ accessToken: token });
      }

      const localToken = localStorage.getItem('spotify_accesstoken');
      if (localToken) {
        const { data } = await apiClient.get('/spotify/currentUser');
        // console.log('User data in useAuth:', data);
        set({ user: data.data, accessToken: localToken });

        const { data: playlistData } = await getUserPlaylists();
        set({ playlists: playlistData.data });
      }
    } catch (error) {
      localStorage.clear();
      console.log('Error verifying user:', error);
      set({ user: null, accessToken: null });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await apiClient.post('/spotify/logout');
    } catch (error) {
      console.error('Error during logout in useAuth:', error);
    } finally {
      localStorage.clear();
      set({ user: null, accessToken: null });
      window.location.href = '/';
    }
  },
}));

export default useAuthStore;
