const API_URL = 'http://127.0.0.1:8888/api/spotify';

const getUserPlaylists = async (accessToken) => {
  const response = await fetch(`${API_URL}/playlists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }

  return response.json();
};

export { getUserPlaylists };
