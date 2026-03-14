/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
    const [library, setLibrary] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [currentView, setCurrentView] = useState('library');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSongs = library.filter(song =>
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addSongsToLibrary = (songs) => {
        setLibrary(prevLibrary => [...prevLibrary, ...songs])
    };

    const createPlaylist = (name) => {
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            songs: []
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
    };

    const addToPlaylist = (playlistId, song) => {
        setPlaylists(prev => prev.map(playlist =>
            playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, song] } : playlist
        ));
    };

    const removeFromPlaylist = (playlistId, songId) => {
        setPlaylists(prev => prev.map(playlist =>
            playlist.id === playlistId
                ? { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) } : playlist
        ))
    }

    const value = {
        library,
        playlists,
        currentView,
        searchQuery,
        filteredSongs,
        setLibrary,
        setCurrentView,
        setSearchQuery,
        addSongsToLibrary,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
    }

    return (
        <MusicContext.Provider value={ value }>
            { children }
        </MusicContext.Provider>
    )

}

export function useMusic() {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within MusicProvider')
    }
    return context;
};