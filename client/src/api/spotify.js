import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://127.0.0.1:8888/api';

export const socket = io('http://127.0.0.1:8888');

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotify_accesstoken');
    // console.log('token in axios request', token);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (socket.id) {
      config.headers['x-socket-id'] = socket.id;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    // console.log('inside interceptor response:', error.response);
    // console.log('error', error);

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      if (originalReq.url === '/spotify/refreshToken') {
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }
      try {
        // console.log('Refreshing token...');
        const { data } = await apiClient.post('/spotify/refreshToken');
        // console.log('back finally');

        const newAccessToken = data.data.accessToken;
        const newExpiresIn = data.data.expiresIn;
        const expirationTime = new Date().getTime() + newExpiresIn * 1000;
        localStorage.setItem('spotify_accesstoken', newAccessToken);
        localStorage.setItem('spotify_expiry', expirationTime);

        originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalReq);
        // console.log('Unauthorized baby');
      } catch (err) {
        console.error('Session expired, please log in again.', err);
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
export const getUserPlaylists = async () => {
  // console.log('trying');

  return await apiClient.get('/spotify/playlists');
};
