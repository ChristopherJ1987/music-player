import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import { pickMusicFolder, scanAudioFiles } from '../../utilities/fileScanner';
import { useState } from 'react';
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import Toast from '../ui/Toast';
import { MoreVertical, Play as PlayIcon, Play, Disc3, Mic2, Radio, ListMusic, Music } from 'lucide-react';


function MainContent() {
    const { currentView, playlists } = useMusic();
    const { currentTrack, isPlaying } = usePlayer();

    const renderView = () => {
        if (currentView === 'search') {
            return <SearchResultsView />
        } else if (currentView === 'albums') {
            return <AlbumsView />
        } else if (currentView === 'artists') {
            return <ArtistsView />
        } else if (currentView === 'genres') {
            return <GenresView />
        } else if (currentView.startsWith('playlist-')) {
            const playlistId = currentView.replace('playlist-', '');
            const playlist = playlists.find(p => p.id === playlistId);
            return <PlaylistView playlist={playlist} />
        } else if (currentView.startsWith('album-')) {
            const albumName = decodeURIComponent(currentView.replace('album-', ''));
            return <AlbumDetailView albumName={albumName} />
        } else if (currentView.startsWith('artist-')) {
            const artistName = decodeURIComponent(currentView.replace('artist-', ''))
            return <ArtistDetailView artistName={artistName} />
        }
    }

    return (
        <div className="flex-1 bg-bg-dark overflow-y-auto">
            <div className="p-6">

                {/* Now Playing Card */}
                <div className="bg-surface-dark border-2 border-primary-purple rounded-xl p-8 mb-8">
                    <div className="flex items-center gap-6">

                        {/* Album Art Placeholder */}
                        <div className="w-72 h-72 bg-gradient-hero rounded-lg flex items-center justify-center overflow-hidden relative">
                            {currentTrack?.artwork ? (
                                <img
                                    src={currentTrack.artwork}
                                    alt={currentTrack.album}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <Music size={64} className='text-muted-text' strokeWidth={1.5} />
                            )}
                            {isPlaying && (
                                <div className='absolute bottom-4 right-4 bg-primary-purple text-cream-text px-3 py-1 rounded-full text-sm'>
                                    Playing ♪
                                </div>
                            )}
                        </div>

                        {/* Track Info */}
                        <div className="flex-1">
                            <h2 className="font-bitcount text-4xl text-cream-text mb-2">
                                {currentTrack?.title || 'No song playing'}
                            </h2>
                            <p className="text-xl text-muted-text mb-1">{currentTrack?.artist || 'Select a song to play'}</p>
                            <p className="text-lg text-muted-text">{currentTrack?.album || ''}</p>
                        </div>

                    </div>
                </div>

                {renderView()}
            </div>
        </div>
    )
}
    
function AlbumsView() {
    const { albums, setCurrentView, addSongsToLibrary, playlists, addAlbumToPlaylist, createPlaylist } = useMusic();
    const { play } = usePlayer();
    const [sortBy, setSortBy] = useState('name');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
    const [albumContextMenu, setAlbumContextMenu] = useState(null);
    const [toast, setToast] = useState(null);
    const sortedAlbums = [...albums].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else {
            return a.artist.localeCompare(b.artist);
        }
    });

    const handleAlbumClick = (albumName) => {
        setCurrentView(`album-${encodeURIComponent(albumName)}`);
    };

    const handlePlayAlbum = (album) => {
        if (album.songs.length > 0) {
            play(album.songs[0], album.songs);
        }
    };

    const handleAddAlbumToPlaylist = (playlistId) => {
        addAlbumToPlaylist(playlistId, albumContextMenu.album);
        setToast(`Added '${albumContextMenu.album.name}' to playlist`);
        setAlbumContextMenu(null);
    }

    const handleAddMusic = async () => {
        try {
            setIsScanning(true)

            // Pick folder
            const files = await pickMusicFolder();

            if (files.length === 0) {
                setIsScanning(false)
                return
            }

            setScanProgress({ current:0, total: files.length })

            // Scan files for metadata
            const scannedSongs = await scanAudioFiles(files, (current, total) => {
                setScanProgress({ current, total });
            });

            // Add to library
            addSongsToLibrary(scannedSongs)

            setIsScanning(false)
            setScanProgress({ current: 0, total: 0 })

            console.log(`✅ Added ${scannedSongs.length} songs to library`)
        } catch (error) {
            console.error('Error adding music:', error)
            setIsScanning(false)
            alert('Error adding music. Check console for details.')
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-semibold text-cream-text'>
                    Albums
                    <span className='text-sm text-muted-text ml-3'>
                        {albums.length} {albums.length === 1 ? 'album' : 'albums'}
                    </span>
                </h3>

                <div className='flex gap-2'>
                    <button
                        onClick={() => setSortBy('name')}
                        className={`px-4 py-2 rounded-lg transition ${sortBy === 'name' ? 'bg-primary-purple text-cream-text' : 'bg-surface-dark text-muted-text hover:text-cream-text'}`}
                    >
                        By Album
                    </button>
                    <button
                        onClick={() => setSortBy('artist')}
                        className={`px-4 py-2 rounded-lg transition ${sortBy === 'artist' ? 'bg-primary-purple text-cream-text' : 'bg-surface-dark text-muted-text hover:text-cream-text'}`}
                    >
                        By Artist
                    </button>
                    <button
                        onClick={handleAddMusic}
                        disabled={isScanning}
                        className='bg-gradient-hero text-cream-text px-6 py-2 rounded-lg hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isScanning ? 'Scanning...' : '+ Add Music'}
                        </button>
                </div>
            </div>

            {isScanning && (
                <div className='bg-surface-dark p-4 rounded-lg mb-4 border border-primary-purple'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-cream-text'>
                            Scanning files...
                        </p>
                        <p className='text-primary-purple font-semibold'>
                            {scanProgress.current} / {scanProgress.total}
                            ({Math.round((scanProgress.current / scanProgress.total) * 100)}%)
                        </p>
                    </div>
                    <div className='h-3 bg-graphite rounded-full overflow-hidden'>
                        <div className='h-full bg-gradient-hero transition-all duration-300 ease-out' style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }} />
                    </div>
                </div>
            )}
            {albums.length === 0 ? (
                <div className='text-center py-12'>
                    <Disc3 size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                    <p className='text-xl text-muted-text mb-2'>No albums yet</p>
                    <p className='text-sm text-muted-text'>Add music to see albums</p>
                    <br />
                    <button
                        onClick={handleAddMusic}
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 transition text-lg'>
                            Add Music Folder
                        </button>
                </div>
            ) : (
                <div className='grid grid-cols-4 gap-6'>
                    {sortedAlbums.map((album, index) => (
                        <div
                            key={index}
                            onClick={() => handleAlbumClick(album.name)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setAlbumContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    album: album
                                });
                            }}
                            className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'>
                            <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                {album.artwork ? (
                                    <img
                                        src={album.artwork}
                                        alt={album.name}
                                        className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <Disc3 size={48} className='text-muted-text' strokeWidth={1.5} />
                                    </div>
                                )}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    {/* Three-dot menu button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setAlbumContextMenu({
                                                x: rect.left,
                                                y: rect.bottom +5,
                                                album: album
                                            });
                                        }}
                                        className='absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition z-10'
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    
                                    {/* Play button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayAlbum(album);
                                        }}
                                        className='absolute bottom-2 right-2 w-12 h-12 bg-primary-purple/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-purple transition hover:scale-110 z-10'
                                    >
                                        <Play size={20} className='ml-0.5' />
                                    </button>
                                </div>
                            </div>
                            <h4 className='text-base font-semibold text-cream-text truncate mb-1'>
                                {album.name}
                            </h4>
                            <p className='text-sm text-muted-text truncate mb-1'>
                                {album.artist}
                            </p>
                            <p className='text-sm text-muted-text'>
                                {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Album context menu */}
            {albumContextMenu && (
                <ContextMenu
                    x={albumContextMenu.x}
                    y={albumContextMenu.y}
                    onClose={() => setAlbumContextMenu(null)}
                >
                    {/* Add album to playlist submenu */}
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add Album to Playlist
                            </div>

                            {/* Create new Playlist option */}
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addAlbumToPlaylist(newPlaylist.id, albumContextMenu.album);
                                        setToast(`Created '${playlistName}' and added '${albumContextMenu.album.name}'`);
                                        setAlbumContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>

                            <ContextMenuDivider />

                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddAlbumToPlaylist(playlist.id)}>
                                        {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addAlbumToPlaylist(newPlaylist.id, albumContextMenu.album);
                                        setToast(`Created '${playlistName}' and added '${albumContextMenu.album.name}'`);
                                        setAlbumContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`album-${encodeURIComponent(albumContextMenu.album.name)}`);
                            setAlbumContextMenu(null);
                        }}
                    >
                        View Album
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(albumContextMenu.album.artist)}`);
                            setAlbumContextMenu(null);
                        }}
                    >
                        View Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {/* Toast notifications */}
            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

function ArtistsView() {
    const { artists, setCurrentView, playlists, addArtistToPlaylist, createPlaylist } = useMusic();
    const { play } = usePlayer();
    const [artistContextMenu, setArtistContextMenu] = useState(null);
    const [toast,setToast] = useState(null);

    const sortedArtists = [...artists].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const handleArtistClick = (artistName) => {
        setCurrentView(`artist-${encodeURIComponent(artistName)}`);
    };

    const handlePlayArtist = (artist) => {
        if (artist.songs.length > 0) {
            play(artist.songs[0], artist.songs);
        }
    };

    const handleAddArtistToPlaylist = (playlistId) => {
        addArtistToPlaylist(playlistId, artistContextMenu.artist);
        setToast(`Added all songs by '${artistContextMenu.artist.name}' to playlist`);
        setArtistContextMenu(null);
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-semibold text-cream-text'>
                    Artists
                    <span className='text-sm text-muted-text ml-3'>
                        {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
                    </span>
                </h3>
            </div>

            {artists.length === 0 ? (
                <div className='text-center py-12'>
                    <Mic2 size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                    <p className='text-xl text-muted-text mb-2'>No artists yet</p>
                    <p className='text-sm text-muted-text'>Add music to see artists</p>
                </div>
            ) : (
                <div className='grid grid-cols-4 gap-6'>
                    {sortedArtists.map((artist, index) => (
                        <div
                            key={index}
                            onClick={() => handleArtistClick(artist.name)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setArtistContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    artist: artist
                                });
                            }}
                            className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'>
                            <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                {artist.artwork ? (
                                    <img
                                        src={artist.artwork}
                                        alt={artist.name}
                                        className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <Mic2 size={48} className='text-muted-text' strokeWidth={1.5} />
                                    </div>
                                )}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    {/* Three-dot menu button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setArtistContextMenu({
                                                x: rect.left,
                                                y: rect.bottom + 5,
                                                artist: artist
                                            });
                                        }}
                                        className='absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition z-10'
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {/* Play button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayArtist(artist);
                                        }}
                                        className='absolute bottom-2 right-2 w-12 h-12 bg-primary-purple/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-purple transition hover:scale-110 z-10'
                                    >
                                        <Play size={20} className='ml-0.5' />
                                    </button>
                                </div>
                            </div>
                            <h4 className='text-base font-semibold text-cream-text truncate mb-1'>
                                {artist.name}
                            </h4>
                            <p className='text-sm text-muted-text'>
                                {artist.songs.length} {artist.songs.length === 1 ? 'song' : 'songs'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Artist context menu */}
            {artistContextMenu && (
                <ContextMenu
                    x={artistContextMenu.x}
                    y={artistContextMenu.y}
                    onClose={() => setArtistContextMenu(null)}
                >
                    {/* Add all songs to playlist submenu */}
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add Artists Songs to Playlist
                            </div>

                            {/* Create new playlist option */}
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addArtistToPlaylist(newPlaylist.id, artistContextMenu.artist);
                                        setToast(`Created '${playlistName}' and added all songs by '${artistContextMenu.artist.name}'`);
                                        setArtistContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>

                            <ContextMenuDivider />

                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddArtistToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addArtistToPlaylist(newPlaylist.id, artistContextMenu.artist);
                                        setToast(`Created '${playlistName}' and added all songs by '${artistContextMenu.artist.name}'`);
                                        setArtistContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(artistContextMenu.artist.name)}`);
                            setArtistContextMenu(null);
                        }}
                    >
                        View Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {/* Toast notifications */}
            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
} 

function GenresView() {
    return (
        <div>
            <h3 className='text-2xl font-semibold text-cream-text mb-4'>Genres</h3>
            <div className='text-center py-12'>
                <Radio size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                <p className='text-xl text-muted-text mb-2'>Genre view coming soon!</p>
                <p className='text-sm text-muted-text'>We'll organize your music by genre here</p>
            </div>
        </div>
    )
}

function PlaylistView({ playlist }) {
    const { removeFromPlaylist, setCurrentView } = useMusic();
    const { play } = usePlayer();
    const [contextMenu, setContextMenu] = useState(null);
    const [toast, setToast] = useState(null);

    if (!playlist) {
        return (
            <div className='text-center py-12'>
                <p className='text-xl text-muted-text'>Playlist not found</p>
            </div>
        )
    }

    const handlePlaySong = (song) => {
        play(song, playlist.songs)
    }

    const handleRightClick = (e, song) => {
        e.preventDefault()
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            song: song
        })
    }

    const handleRemoveFromPlaylist = () => {
        removeFromPlaylist(playlist.id, contextMenu.song.id)
        setToast(`Removed '${contextMenu.song.title}' from playlist`)
        setContextMenu(null)
    }
    
    return (
        <div>
            <h3 className='text-2xl font-semibold text-cream-text mb-4'>
                {playlist.name}
                <span className='text-sm text-muted-text ml-3'>
                    {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </span>
            </h3>

            {playlist.songs.length === 0 ? (
                <div className='text-center py-12'>
                    <ListMusic size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                    <p className='text-xl text-muted-text mb-2'>Empty playlist</p>
                    <p className='text-sm text-muted-text'>Add songs from your library</p>
                </div>
            ) : (
                <div className='space-y-2'>
                    {playlist.songs.map((song, i) => (
                        <div
                        key={i}
                        onClick={() => handlePlaySong(song)}
                        onContextMenu={(e) => handleRightClick(e, song)}
                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer flex items-center gap-4 group relative'>
                                <span className='text-muted-text'>{i + 1}</span>
                                <div className='w-12 h-12 rounded overflow-hidden bg-gradient-accent flex items-center justify-center'>
                                    {song.artwork ? (
                                        <img src={song.artwork} alt={song.album} className='w-full h-full object-cover' />
                                    ) : (
                                        <Music size={20} className='text-muted-text' />
                                    )}
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <p className='text-cream-text font-semibold truncate'>{song.title}</p>
                                    <p className='text-sm text-muted-text truncate'>{song.artist}</p>
                                </div>

                                <span className='text-sm text-muted-text'>
                                    {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '--:--'}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        setContextMenu({
                                            x: rect.left - 210,
                                            y: rect.bottom,
                                            song:song
                                        })
                                    }}
                                    className='w-8 h-8 flex items-center justify-center text-muted-text hover:text-cream-text opacity-0 group-hover:opacity-100 transition'>
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                    ))}
                </div>
            )}

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                >
                    <ContextMenuItem
                        onClick={handleRemoveFromPlaylist}
                    >
                        Remove from Playlist
                    </ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`album-${encodeURIComponent(contextMenu.song.album)}`);
                            setContextMenu(null);
                        }}
                    >
                        Go to Album
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(contextMenu.song.artist)}`);
                            setContextMenu(null);
                        }}
                    >
                        Go to Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}

        </div>
    )
}

function AlbumDetailView({ albumName }) {
    const { albums, setCurrentView, playlists, addToPlaylist, createPlaylist } = useMusic();
    const { play } = usePlayer();
    const [contextMenu, setContextMenu] = useState(null);
    const [toast, setToast] = useState(null);

    const album = albums.find(a => a.name === albumName);

    if (!album) {
        return (
            <div className='text-center py-12'>
                <p className='text-xl text-muted-text'>Album not found</p>
            </div>
        );
    }

    const handlePlaySong = (song) => {
        play(song, album.songs);
    };

    const handlePlayAlbum = () => {
        if (album.songs.length > 0) {
            play(album.songs[0], album.songs);
        }
    };

    const handleRightClick = (e, song) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            song: song
        });
    };

    const handleAddToPlaylist = (playlistId) => {
        addToPlaylist(playlistId, contextMenu.song);
        setToast(`Added '${contextMenu.song.title}' to playlist`);
        setContextMenu(null);
    }

    return (
        <div>
            <div className='flex items-center gap-6 mb-8 bg-surface-dark p-6 rounded-xl'>
                <div className='w-48 h-48 rounded-lg overflow-hidden bg-gradient-accent flex-shrink-0'>
                    {album.artwork ? (
                        <img
                            src={album.artwork}
                            alt={album.name}
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <Disc3 size={80} className='text-muted-text' strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <div className='flex-1'>
                    <p className='text-sm text-muted-text uppercase tracking-wide mb-2'>Album</p>
                    <h2 className='font-bitcount text-4xl text-cream-text mb-3'>
                        {album.name}
                    </h2>
                    <p className='text-xl text-muted-text mb-4'>{album.artist}</p>
                    <p className='text-sm text-muted-text mb-4'>
                        {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
                    </p>

                    <button
                        onClick={handlePlayAlbum}
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 transition text-lg font-semibold flex items-center gap-2'>
                            <Play size={20} className='fill-current' />
                            <span>Play Album</span>
                        </button>
                </div>
            </div>

            <div className='space-y-2'>
                {album.songs.map((song, i) => (
                    <div
                        key={song.id || i}
                        onClick={() => handlePlaySong(song)}
                        onContextMenu={(e) => handleRightClick(e, song)}
                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer flex items-center gap-4 group relative'>
                        <span className='text-muted-text min-w-[30px]'>
                            {i + 1}
                        </span>

                        <div className='w-12 h-12 rounded overflow-hidden bg-gradient-accent flex items-center justify-center'>
                            {song.artwork ? (
                                <img src={song.artwork} alt={song.album} className='w-full h-full object-cover' />
                            ) : (
                                <Music size={20} className='text-muted-text' />
                            )}
                        </div>

                        <div className='flex-1 min-w-0'>
                            <p className='text-cream-text font-semibold truncate'>{song.title}</p>
                            <p className='text-sm text-muted-text truncate'>{song.artist}</p>
                        </div>

                        <span className='text-sm text-muted-text'>
                            {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '--:--'}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setContextMenu({
                                    x: rect.left - 210,
                                    y: rect.top,
                                    song:song
                                });
                            }}
                            className='w-8 h-8 flex items-center justify-center text-muted-text hover:text-cream-text opacity-0 group-hover:opacity-100 transition'>
                                <MoreVertical size={16} />
                            </button>
                    </div>
                ))}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                >
                    {/* Add to playlist submenu */}
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add to Playlist
                            </div>

                            {/* Creat new playlist option */}
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, contextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${contextMenu.song.title}'`);
                                        setContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>

                            <ContextMenuDivider />

                            {/* Existing playlists */}
                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            {/* No playlists yet - show create option */}
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, contextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${contextMenu.song.title}'`);
                                        setContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(contextMenu.song.artist)}`);
                            setContextMenu(null);
                        }}
                    >
                            Go to Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

function ArtistDetailView({ artistName }) {
    const { artists, setCurrentView, playlists, addToPlaylist, createPlaylist } = useMusic();
    const { play } = usePlayer();
    const [contextMenu, setContextMenu] = useState(null);
    const [toast, setToast] = useState(null);

    const artist = artists.find(a => a.name === artistName);

    if(!artist) {
        return (
            <div className='text-center py-12'>
                <p className='text-xl text-muted-text'>Artist not found</p>
            </div>
        );
    }

    const handlePlaySong = (song) => {
        play(song, artist.songs);
    };

    const handlePlayArtist = () => {
        if (artist.songs.length > 0) {
            play(artist.songs[0], artist.songs);
        }
    };

    const handleRightClick = (e, song) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            song: song
        });
    };

    const handleAddToPlaylist = (playlistId) => {
        addToPlaylist(playlistId, contextMenu.song);
        setToast(`Added '${contextMenu.song.title}' to playlist`);
        setContextMenu(null);
    };

    return (
        <div>
            <div className='flex items-center gap-6 mb-8 bg-surface-dark p-6 rounded-xl'>
                <div className='w-48 h-48 rounded-lg overflow-hidden bg-gradient-accent flex-shrink-0'>
                    {artist.artwork ? (
                        <img
                            src={artist.artwork}
                            alt={artist.name}
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <Mic2 size={80} className='text-muted-text' strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <div className='flex-1'>
                    <p className='text-sm text-muted-text uppercase tracking-wide mb-2'>Artist</p>
                    <h2 className='font-bitcount text-4xl text-cream-text mb-3'>
                        {artist.name}
                    </h2>
                    <p className='text-sm text-muted-text mb-4'>
                        {artist.songs.length} {artist.songs.length === 1 ? 'song' : 'songs'}
                    </p>

                    <button
                        onClick={handlePlayArtist}
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 transition text-lg font-semibold flex items-center gap-2'>
                        <Play size={20} className='fill-current' />
                        <span>Play All</span>
                    </button>
                </div>
            </div>

            <div className='space-y-2'>
                {artist.songs.map((song, i) => (
                    <div
                        key={song.id || i}
                        onClick={() => handlePlaySong(song)}
                        onContextMenu={(e) => handleRightClick(e, song)}
                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer flex items-center gap-4 group relative'>
                        <span className='text-muted-text min-w-[30px]'>
                            {i + 1}
                        </span>

                        <div className='w-12 h-12 rounded overflow-hidden bg-gradient-accent flex items-center justify-center'>
                            {song.artwork ? (
                                <img src={song.artwork} alt={song.album} className='w-full h-full object-cover' />
                            ) : (
                                <Music size={20} className='text-muted-text' />
                            )}
                        </div>

                        <div className='flex-1 min-w-0'>
                            <p className='text-cream-text font-semibold truncate'>{song.title}</p>
                            <p className='text-sm text-muted-text truncate'>{song.album}</p>
                        </div>

                        <span className='text-sm text-muted-text'>
                            {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '--:--'}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setContextMenu({
                                    x: rect.left - 210,
                                    y: rect.top,
                                    song: song
                                });
                            }}
                            className='w-8 h-8 flex items-center justify-center text-muted-text hover:text-cream-text opacity-0 group-hover:opacity-100 transition'>
                            <MoreVertical size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                >
                    {/* Add to playlist submenu */}
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add to Playlist
                            </div>

                            {/* Create new playlist option */}
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, contextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${contextMenu.song.title}'`);
                                        setContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>

                            <ContextMenuDivider />

                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                        <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, contextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${contextMenu.song.title}'`);
                                        setContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`album-${encodeURIComponent(contextMenu.song.album)}`);
                            setContextMenu(null);
                        }}
                    >
                        Go to Album
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

function SearchResultsView() {
    const { library, albums, artists, searchQuery, setCurrentView, playlists, addToPlaylist, addAlbumToPlaylist, addArtistToPlaylist, createPlaylist } = useMusic();
    const { play } = usePlayer();
    const [songContextMenu, setSongContextMenu] = useState(null);
    const [albumContextMenu, setAlbumContextMenu] = useState(null);
    const [artistContextMenu, setArtistContextMenu] = useState(null);
    const [toast, setToast] = useState(null);

    // Filter songs
    const filteredSongs = library.filter(song => 
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter albums
    const filteredAlbums = albums.filter(album => 
        album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter artists
    const filteredArtists = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePlaySong = (song) => {
        play(song, filteredSongs);
    };

    const handlePlayAlbum = (album) => {
        if (album.songs.length > 0) {
            play(album.songs[0], album.songs);
        }
    };

    const handlePlayArtist = (artist) => {
        if (artist.songs.length > 0) {
            play(artist.songs[0], artist.songs);
        }
    };

    const handleAddSongToPlaylist = (playlistId) => {
        addToPlaylist(playlistId, songContextMenu.song);
        setToast(`Added '${songContextMenu.song.title}' to playlist`);
        setSongContextMenu(null);
    };

    const handleAddAlbumToPlaylist = (playlistId) => {
        addAlbumToPlaylist(playlistId, albumContextMenu.album);
        setToast(`Added '${albumContextMenu.album.name}' to playlist`);
        setAlbumContextMenu(null);
    };

    const handleAddArtistToPlaylist = (playlistId) => {
        addArtistToPlaylist(playlistId, artistContextMenu.artist);
        setToast(`Added all songs by '${artistContextMenu.artist.name}' to playlist`);
        setArtistContextMenu(null);
    };

    const totalResults = filteredSongs.length + filteredAlbums.length + filteredArtists.length;

    return (
        <div>
            <div className='mb-6'>
                <h3 className='text-2xl font-semibold text-cream-text'>
                    Search Results for '{searchQuery}'
                </h3>
                <p className='text-sm text-muted-text mt-1'>
                    {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                </p>
            </div>

            {totalResults === 0 ? (
                <div className='text-center py-12'>
                    <Music size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                    <p className='text-xl text-muted-text mb-2'>
                        No results found
                    </p>
                    <p className='text-sm text-muted-text'>
                        Try a different search term
                    </p>
                </div>
            ) : (
                <>
                    {/* Songs section */}
                    {filteredSongs.length > 0 && (
                        <div className='mb-8'>
                            <h4 className='text-xl font-semibold text-cream-text mb-4'>
                                Songs
                                <span className='text-sm text-muted-text ml-3'>
                                    {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
                                </span>
                            </h4>
                            <div className='space-y-2'>
                                {filteredSongs.slice(0, 10).map((song, i) => (
                                    <div
                                        key={song.id || i}
                                        onClick={() => handlePlaySong(song)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setSongContextMenu({
                                                x: e.clientX,
                                                y: e.clientY,
                                                song: song
                                            });
                                        }}
                                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer flex items-center gap-4 group relative'
                                    >
                                        <span className='text-muted-text min-w-[30px]'>
                                            {i + 1}
                                        </span>
                                        <div className='w-12 h-12 rounded overflow-hidden bg-gradient-accent flex items-center justify-center'>
                                            {song.artwork ? (
                                                <img src={song.artwork} alt={song.album} className='w-ful h-full object-cover' />
                                            ) : (
                                                <Music size={20} className='text-muted-text' />
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-cream-text font-semibold truncate'>
                                                {song.title}
                                            </p>
                                            <p className='text-sm text-muted-text truncate'>
                                                {song.artist} • {song.album}
                                            </p>
                                        </div>
                                        <span className='text-sm text-muted-text'>
                                            {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '--:--'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setSongContextMenu({
                                                    x: rect.left - 210,
                                                    y: rect.top,
                                                    song: song
                                                });
                                            }}
                                            className='w-8 h-8 flex items-center justify-center text-muted-text hover:text-cream-text opacity-0 group-hover:opacity-100 transition'
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                ))}
                                {filteredSongs.length > 10 && (
                                    <p className='text-sm text-muted-text text-center py-2'>
                                        Showing 10 of {filteredSongs.length} songs
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Albums Section */}
                    {filteredAlbums.length > 0 && (
                        <div className='mb-8'>
                            <h4 className='text-xl font-semibold text-cream-text mb-4'>
                                Albums
                                <span className='text-sm text-muted-text ml-3'>
                                    {filteredAlbums.length} {filteredAlbums.length === 1 ? 'album' : 'albums'}
                                </span>
                            </h4>
                            <div className='grid grid-cols-4 gap-6'>
                                {filteredAlbums.map((album, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentView(`album-${encodeURIComponent(album.name)}`)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setAlbumContextMenu({
                                                x: e.clientX,
                                                y: e.clientY,
                                                album: album
                                            });
                                        }}
                                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'
                                    >
                                        <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                            {album.artwork ? (
                                                <img src={album.artwork} alt={album.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <Disc3 size={48} className='text-muted-text' strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setAlbumContextMenu({
                                                            x: rect.left,
                                                            y: rect.bottom + 5,
                                                            album: album
                                                        });
                                                    }}
                                                    className='absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition z-10'
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlayAlbum(album);
                                                    }}
                                                    className='absolute bottom-2 right-2 w-12 h-12 bg-primary-purple/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-purple transition hover:scale-110 z-10'
                                                >
                                                    <Play size={20} className='ml-0.5' />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className='text-base font-semibold text-cream-text truncate mb-1'>{album.name}</h4>
                                        <p className='text-sm text-muted-text truncate mb-1'>{album.artist}</p>
                                        <p className='text-sm text-muted-text'>
                                            {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Artists Section */}
                    {filteredArtists.length > 0 && (
                        <div className='mb-8'>
                            <h4 className='text-xl font-semibold text-cream-text mb-4'>
                                Artists
                                <span className='text-sm text-muted-text ml-3'>
                                    {filteredArtists.length} {filteredArtists.length === 1 ? 'artist' : 'artists'}
                                </span>
                            </h4>
                            <div className='grid grid-cols-4 gap-6'>
                                {filteredArtists.map((artist, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentView(`artist-${encodeURIComponent(artist.name)}`)}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setArtistContextMenu({
                                                x: e.clientX,
                                                y: e.clientY,
                                                artist:artist
                                            });
                                        }}
                                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'
                                    >
                                        <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                            {artist.artwork ? (
                                                <img src={artist.artwork} alt={artist.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <Mic2 size={48} className='text-muted-text' strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setArtistContextMenu({
                                                            x: rect.left,
                                                            y: rect.bottom + 5,
                                                            artist: artist
                                                        });
                                                    }}
                                                    className='absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition z-10'
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlayArtist(artist);
                                                    }}
                                                    className='absolute bottom-2 right-2 w-12 h-12 bg-primary-purple/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary-purple transition hover:scale-110 z-10'
                                                >
                                                    <Play size={20} className='ml-0.5' />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className='text-base font-semibold text-cream-text truncate mb-1'>
                                            {artist.name}
                                        </h4>
                                        <p className='text-sm text-muted-text'>
                                            {artist.songs.length} {artist.songs.length === 1 ? 'song' : 'songs'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Song Context Menu */}
            {songContextMenu && (
                <ContextMenu
                    x={songContextMenu.x}
                    y={songContextMenu.y}
                    onClose={() => setSongContextMenu(null)}
                >
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add to Playlist
                            </div>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, songContextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${songContextMenu.song.title}'`);
                                        setSongContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddSongToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addToPlaylist(newPlaylist.id, songContextMenu.song);
                                        setToast(`Created '${playlistName}' and added '${songContextMenu.song.title}'`);
                                        setSongContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`album-${encodeURIComponent(songContextMenu.song.album)}`);
                            setSongContextMenu(null);
                        }}
                    >
                        Go to Album
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(songContextMenu.song.artist)}`);
                            setSongContextMenu(null);
                        }}
                    >
                        Go to Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {/* Album Context Menu */}
            {albumContextMenu && (
                <ContextMenu
                    x={albumContextMenu.x}
                    y={albumContextMenu.y}
                    onClose={() => setAlbumContextMenu(null)}
                >
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-sm text-muted-text uppercase tracking-wide'>
                                Add Album to Playlist
                            </div>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addAlbumToPlaylist(newPlaylist.id, albumContextMenu.album);
                                        setToast(`Created '${playlistName}' and added '${albumContextMenu.album.name}'`);
                                        setAlbumContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddAlbumToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addAlbumToPlaylist(newPlaylist.id, albumContextMenu.album);
                                        setToast(`Created '${playlistName}' and added '${albumContextMenu.album.name}'`);
                                        setAlbumContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`album-${encodeURIComponent(albumContextMenu.album.name)}`);
                            setAlbumContextMenu(null);
                        }}
                    >
                        View Album
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(albumContextMenu.album.artist)}`);
                            setAlbumContextMenu(null);
                        }}
                    >
                        View Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {/* Artist Context Menu */}
            {artistContextMenu && (
                <ContextMenu
                    x={artistContextMenu.x}
                    y={artistContextMenu.y}
                    onClose={() => setArtistContextMenu(null)}
                >
                    {playlists.length > 0 ? (
                        <>
                            <div className='px-4 py-2 text-xs text-muted-text uppercase tracking-wide'>
                                Add All Songs to Playlist
                            </div>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addArtistToPlaylist(newPlaylist.id, artistContextMenu.artist);
                                        setToast(`Created '${playlistName}' and added all songs by '${artistContextMenu.artist.name}'`);
                                        setArtistContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                            {playlists.map(playlist => (
                                <ContextMenuItem
                                    key={playlist.id}
                                    onClick={() => handleAddArtistToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </ContextMenuItem>
                            ))}
                            <ContextMenuDivider />
                        </>
                    ) : (
                        <>
                            <ContextMenuItem
                                onClick={() => {
                                    const playlistName = prompt('Enter playlist name:');
                                    if (playlistName && playlistName.trim()) {
                                        const newPlaylist = createPlaylist(playlistName.trim());
                                        addArtistToPlaylist(newPlaylist.id, artistContextMenu.artist);
                                        setToast(`Created '${playlistName}' and added all songs by '${artistContextMenu.artist.name}'`);
                                        setArtistContextMenu(null);
                                    }
                                }}
                            >
                                + Create New Playlist
                            </ContextMenuItem>
                            <ContextMenuDivider />
                        </>
                    )}
                    <ContextMenuItem
                        onClick={() => {
                            setCurrentView(`artist-${encodeURIComponent(artistContextMenu.artist.name)}`);
                            setArtistContextMenu(null);
                        }}
                    >
                        View Artist
                    </ContextMenuItem>
                </ContextMenu>
            )}

            {/* Toast notifications */}
            {toast && (
                <Toast
                    message={toast}
                    onClose={() => setToast(null)}
                />
            )}

        </div>
    );

}

export default MainContent;