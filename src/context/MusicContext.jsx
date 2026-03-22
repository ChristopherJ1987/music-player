/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
    const [library, setLibrary] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [currentView, setCurrentView] = useState('albums');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSongs = library.filter(song =>
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const albumsMap = library.reduce((acc, song) => {
        const albumKey = song.album || 'Unknown Album';
        if (!acc[albumKey]) {
            acc[albumKey] = {
                name: albumKey,
                artist: song.albumArtist || song.artist || 'Unknown Artist',
                artwork: song.artwork || null,
                songs: []
            };
        }
        acc[albumKey].songs.push(song);
        return acc;
    }, {});

    const albums = Object.values(albumsMap);

    const artistsMap = library.reduce((acc, song) => {
        const artistKey = song.artist || 'Unknown Artist';
        if (!acc[artistKey]) {
            acc[artistKey] = {
                name: artistKey,
                artwork: song.artwork || null,
                songs: []
            };
        }
        acc[artistKey].songs.push(song);
        return acc;
    }, {});

    const artists = Object.values(artistsMap);

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

    const removePlaylist = (playlistId) => {
        setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
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

    const addAlbumToPlaylist = (playlistId, album) => {
        setPlaylists(prev => prev.map(playlist => playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, ...album.songs] } : playlist));
    };

    const addArtistToPlaylist = (playlistId, artist) => {
        setPlaylists(prev => prev.map(playlist => playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, ...artist.songs] } : playlist));
    };

    const value = {
        library,
        playlists,
        currentView,
        searchQuery,
        filteredSongs,
        albums,
        artists,
        setLibrary,
        setCurrentView,
        setSearchQuery,
        addSongsToLibrary,
        createPlaylist,
        removePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        addAlbumToPlaylist,
        addArtistToPlaylist,
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