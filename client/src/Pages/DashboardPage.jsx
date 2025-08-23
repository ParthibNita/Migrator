import { useState, useEffect } from 'react';
import { getUserPlaylists } from '../api/spotify.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export const DashboardPage = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setloading(true);
        const data = await getUserPlaylists();
        console.log('Full axios data', data);
        setPlaylists(data.data.data);
      } catch (error) {
        seterror(error.message);
      } finally {
        setloading(false);
      }
    };
    fetchPlaylists();
  }, [accessToken]);

  // console.log('Playlists state:', playlists);
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-cyan-950">Your Playlists</h1>

      {loading && <p className="text-cyan-700">Loading playlists...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {playlists.map((list) => (
          <Card
            key={list.id}
            className="bg-neutral-900 border-neutral-800 text-white overflow-hidden cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <CardHeader className="p-0">
              {list.images.length > 0 && (
                <img
                  src={list.images[0].url}
                  alt={`${list.name} cover`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-auto aspect-square"
                />
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-md font-semibold truncate">
                {list.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
