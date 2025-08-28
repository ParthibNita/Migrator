import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/spotify.js';
export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        const expiry = urlParams.get('expires_in');

        if (token && expiry) {
          setAccessToken(token);
          localStorage.setItem('spotify_accesstoken', token);
          localStorage.setItem(
            'spotify_expiry',
            Date.now() + parseInt(expiry) * 1000
          );
          window.history.pushState({}, document.title, '/');
        }

        const localToken = localStorage.getItem('spotify_accesstoken');
        if (localToken) {
          const { data } = await apiClient.get('/spotify/currentUser');
          // console.log('User data in useAuth:', data);
          setUser(data.data);
          setAccessToken(localToken);
        }
      } catch (error) {
        localStorage.clear();
        console.log('Error verifying user:', error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/spotify/logout');
    } catch (error) {
      console.error('Error during logout in useAuth:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setAccessToken(null);
      window.location.href = '/';
    }
  }, []);
  return { accessToken, user, loading, logout };
};
