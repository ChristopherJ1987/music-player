import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MusicProvider } from './context/MusicContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MusicProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </MusicProvider>
  </React.StrictMode>
)