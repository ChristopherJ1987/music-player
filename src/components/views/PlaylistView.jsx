import { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import { MoreVertical, ListMusic, Music } from 'lucide-react';
import Toast from '../ui/Toast';


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

export default PlaylistView;