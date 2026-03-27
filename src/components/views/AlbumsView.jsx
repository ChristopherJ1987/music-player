import { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import { pickMusicFolder, scanAudioFiles } from '../../utilities/fileScanner';
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import { MoreVertical, Play, Disc3  } from 'lucide-react';
import Toast from '../ui/Toast';


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

export default AlbumsView;