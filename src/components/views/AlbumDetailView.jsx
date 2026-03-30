import { useState } from "react";
import { useMusic } from "../../context/MusicContext";
import { usePlayer } from "../../context/PlayerContext";
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import { MoreVertical, Play as PlayIcon, Play, Disc3, Music } from 'lucide-react';
import Toast from '../ui/Toast';

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

export default AlbumDetailView;