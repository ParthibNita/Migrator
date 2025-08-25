import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage.jsx';
import { DashboardPage } from './Pages/DashboardPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import { PlaylistPage } from './Pages/PlaylistPage.jsx';

function App() {
  const { accessToken, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-cyan-600">Loading...</p>
      </div>
    );
  }
  return (
    <Router>
      <div className="App bg-neutral-900 min-h-screen text-white">
        {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={accessToken ? <DashboardPage /> : <LoginPage />}
          />
          <Route
            path="/playlists/:id"
            element={accessToken ? <PlaylistPage /> : <LoginPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
