import React from 'react';

const SpotifyAuthPage: React.FC = () => {
  const handleLogin = () => {
    const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const scopes = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Spotify Authentication</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Login with Spotify
      </button>
    </div>
  );
};

export default SpotifyAuthPage;