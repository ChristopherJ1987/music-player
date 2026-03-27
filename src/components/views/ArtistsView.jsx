import { useState } from "react";
import { useMusic } from '../../context/MusicContext';
import { usePlayer } from "../../context/PlayerContext";
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import { MoreVertical, Play as PlayIcon, Play, Mic2  } from 'lucide-react';
import Toast from '../ui/Toast';

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

export default ArtistsView;