import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import { pickMusicFolder, scanAudioFiles } from '../../utilities/fileScanner';
import { useState } from 'react';
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import Toast from '../ui/Toast';


function MainContent() {
    const { currentView, playlists } = useMusic();
    const { currentTrack, isPlaying } = usePlayer();

    const renderView = () => {
        if (currentView === 'albums') {
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
                                <span className="text-6xl">...</span>
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
    const { albums, setCurrentView, addSongsToLibrary } = useMusic();
    const [sortBy, setSortBy] = useState('name');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
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
            const scannedSongs = await scanAudioFiles(files)

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
                <div className='bg-surface-dark p-4 rounded-lg mb-4'>
                    <p className='text-cream-text mb-2'>
                        Scanning files... {scanProgress.current} / {scanProgress.total}
                    </p>
                    <div className='h-2 bg-graphite rounded-full overflow-hidden'>
                        <div className='h-full bg-gradient-hero transition-all' style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }} />
                    </div>
                </div>
            )}

            {albums.length === 0 ? (
                <div className='text-center py-12'>
                    <p className='text-4xl mb-4'>💿</p>
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
                            className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'>
                            <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                {album.artwork ? (
                                    <img
                                        src={album.artwork}
                                        alt={album.name}
                                        className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-6xl'>
                                        💿
                                    </div>
                                )}
                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                                    <span className='text-6xl'>▶️</span>
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
        </div>
    );
}

function ArtistsView() {
    const { artists, setCurrentView } = useMusic();

    const sortedArtists = [...artists].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const handleArtistClick = (artistName) => {
        setCurrentView(`artist-${encodeURIComponent(artistName)}`);
    };

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
                    <p className='text-4xl mb-4'>🎤</p>
                    <p className='text-xl text-muted-text mb-2'>No artists yet</p>
                    <p className='text-sm text-muted-text'>Add music to see artists</p>
                </div>
            ) : (
                <div className='grid grid-cols-4 gap-6'>
                    {sortedArtists.map((artist, index) => (
                        <div
                            key={index}
                            onClick={() => handleArtistClick(artist.name)}
                            className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'>
                            <div className='aspect-square rounded-lg mb-3 overflow-hidden bg-gradient-accent relative'>
                                {artist.artwork ? (
                                    <img
                                        src={artist.artwork}
                                        alt={artist.name}
                                        className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-6xl'>
                                        🎤
                                    </div>
                                )}
                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                                    <span className='text-6xl'>▶️</span>
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
        </div>
    );
} 

function GenresView() {
    return (
        <div>
            <h3 className='text-2xl font-semibold text-cream-text mb-4'>Genres</h3>
            <div className='text-center py-12'>
                <p className='text-4xl mb-4'>🎸</p>
                <p className='text-xl text-muted-text mb-2'>Genre view coming soon!</p>
                <p className='text-sm text-muted-text'>We'll organize your music by genre here</p>
            </div>
        </div>
    )
}

function PlaylistView({ playlist }) {
    const { removeFromPlaylist } = useMusic();
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
                    <p className='text-4xl mb-4'>📝</p>
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
                                        <span>🎵</span>
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
                                    ⋮
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
                        icon='🗑️'
                    >
                        Remove from Playlist
                    </ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem icon='💿'>
                        Go to Album
                    </ContextMenuItem>
                    <ContextMenuItem icon='🎤'>
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
    )
}

function AlbumDetailView({ albumName }) {
    const { albums } = useMusic();
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
                        <div className='w-full h-full flex items-center justify-center text-8xl'>
                            💿
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
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 transition text-lg font-semibold'>
                            ▶ Play Album
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
                                <span>...</span>
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
                                ⋮
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
                    <ContextMenuItem
                        onClick={() => {
                            const { addToPlaylist, playlists, createPlaylist } = useMusic();
                            setContextMenu(null);
                        }}
                        icon='➕'
                    >
                        Add to Playlist
                    </ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem icon='🎤'>
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
    const { artists } = useMusic();
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
                        <div className='w-full h-full flex items-center justify-center text-8xl'>
                            🎤
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
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 text-lg font-semibold'>
                        ▶ Play All
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
                                <span>🎵</span>
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
                            ⋮
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
                    <ContextMenuItem
                        onClick={() => {
                            setContextMenu(null);
                        }}
                        icon='➕'
                    >
                        Add to Playlist
                    </ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem icon='💿'>
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

export default MainContent;