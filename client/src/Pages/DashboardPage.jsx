import { useState, useEffect } from 'react';
import { getUserPlaylists } from '../api/spotify.js';
export const DashboardPage = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setloading(true);
        const data = await getUserPlaylists(accessToken);
        setPlaylists(data);
      } catch (error) {
        seterror(error.message);
      } finally {
        setloading(false);
      }
    };
    fetchPlaylists();
  }, [accessToken]);

  console.log('Playlists state:', playlists);
  return (
    <div>
      <h2>Your spotify playlists 👇</h2>
      {loading && <p>Loading playlists...</p>}
      {error && <p>Error: {error}</p>}
      {playlists && (
        <ul>
          {playlists.map((list) => (
            <li key={list.id}>{list.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
