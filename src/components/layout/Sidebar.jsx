import { useMusic } from '../../context/MusicContext';
import { useState } from 'react';
import ContextMenu, { ContextMenuItem, ContextMenuDivider } from '../ui/ContextMenu';
import Toast from '../ui/Toast';
import { Plus } from 'lucide-react';

function Sidebar() {
    const { currentView, setCurrentView, playlists, createPlaylist, removePlaylist, renamePlaylist } = useMusic();
    const [playlistContextMenu, setPlaylistContextMenu] = useState(null);
    const [toast, setToast] = useState(null);

    const handleCreatePlaylist = () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            createPlaylist(name);
        }
    };

    const handleRemovePlaylist = () => {
        removePlaylist(playlistContextMenu.playlist.id);
        setToast(`Deleted playlist '${playlistContextMenu.playlist.name}'`);
        setPlaylistContextMenu(null);

        if (currentView === `playlist-${playlistContextMenu.playlist.id}`) {
            setCurrentView('albums');
        }
    };

    const handleRenamePlaylist = () => {
        const newName = prompt('Enter new playlist name:', playlistContextMenu.playlist.name);
        if (newName && newName.trim() && newName.trim() !== playlistContextMenu.playlist.name) {
            renamePlaylist(playlistContextMenu.playlist.id, newName.trim());
            setToast(`Renamed playlist to '${newName.trim()}'`);
        }

        setPlaylistContextMenu(null);
    };

    return (
        <div className="w-60 bg-surface-dark border-r border-graphite flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-graphite">
                <h1 className="font-bitcount text-2xl bg-gradient-hero bg-clip-text text-transparent">
                    BB
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">

                    <button 
                        onClick={() => setCurrentView('albums')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${
                            currentView === 'albums'
                                ? 'text-primary-purple bg-primary-purple/10'
                                : 'text-muted-text hover:text-cream-text'
                            }`}
                    >
                        Albums
                    </button>

                    <button
                        onClick={() => setCurrentView('artists')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${currentView === 'artists' ? 'text-primary-purple bg-primary-purple/10' : 'text-muted-text hover:text-cream-text'}`}
                    >
                        Artists
                    </button>

                    <button
                        onClick={() => setCurrentView('genres')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${
                            currentView === 'genres'
                            ? 'text-primary-purple bg-primary-purple/10'
                            : 'text-muted-text hover:text-cream-text'
                        }`}
                    >
                        Genres
                    </button>

                </div>

                {/* Playlists Section */}
                <div className="pt-6">
                    <div className='px-4 mb-2'>
                        <h1 className="px-4 text-sm font-semibold text-muted-text uppercase tracking-wider mb-2">
                            Playlists
                        </h1>
                    </div>

                    <div className='space-y-1'>
                        {playlists.map(playlist => (
                            <div
                                key={playlist.id}
                                onClick={() => setCurrentView(`playlist-${playlist.id}`)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setPlaylistContextMenu({
                                        x: e.clientX,
                                        y: e.clientY,
                                        playlist: playlist
                                    });
                                }}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer ${currentView === `playlist-${playlist.id}` ? 'bg-primary-purple text-cream-text' : 'text-muted-text hover:text-cream-text hover:bg-graphite'}`}
                            >
                                <span className='truncate'>
                                    {playlist.name}
                                </span>
                            </div>
                        ))}
                        <button
                            onClick={handleCreatePlaylist}
                            className='w-full px-4 py-2 text-left text-muted-text hover:text-primary-purple transition flex items-center gap-3'
                        >
                            <Plus size={16} />
                            <span>Create New Playlist</span>
                        </button>
                    </div>
                </div>

            </nav>

            {/* Playlist context menu */}
            {playlistContextMenu && (
                <ContextMenu
                    x={playlistContextMenu.x}
                    y={playlistContextMenu.y}
                    onClose={() => setPlaylistContextMenu(null)}
                >
                    <ContextMenuItem
                        onClick={handleRenamePlaylist}
                    >
                        Rename Playlist
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={handleRemovePlaylist}
                    >
                        Remove Playlist
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

export default Sidebar;