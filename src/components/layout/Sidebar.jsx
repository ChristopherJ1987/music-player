import { useMusic } from '../../context/MusicContext';

function Sidebar() {
    const { currentView, setCurrentView, playlists, createPlaylist } = useMusic();

    const handleCreatePlaylist = () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            createPlaylist(name);
        }
    }

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
                        onClick={() => setCurrentView('library')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${
                            currentView === 'library'
                                ? 'text-primary-purple bg-primary-purple/10'
                                : 'text-muted-text hover:text-cream-text'
                            }`}
                    >
                        🏠 Library
                    </button>

                    <button
                        onClick={() => setCurrentView('albums')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${currentView === 'albums' ? 'text-primary-purple bg-primary-purple/10' : 'text-muted-text hover:text-cream-text'}`}
                    >
                        💿 Albums
                    </button>

                    <button
                        onClick={() => setCurrentView('genres')}
                        className={`w-full px-4 py-2 rounded-lg text-left transition ${
                            currentView === 'genres'
                            ? 'text-primary-purple bg-primary-purple/10'
                            : 'text-muted-text hover:text-cream-text'
                        }`}
                    >
                        🎵 Genres
                    </button>

                </div>

                {/* Playlists Section */}
                <div className="mt-8">
                    <h3 className="px-4 text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">
                        Playlists
                    </h3>
                    <div className="space-y-1">
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => setCurrentView(`playlist-${playlist.id}`)}
                                className={`w-full px-4 py-2 rounded-lg text-left transition ${
                                    currentView === `playlist-${playlist.id}`
                                        ? 'text-primary-purple bg-primary-purple/10'
                                        : 'text-muted-text hover:text-cream-text'
                                }`}
                            >
                                { playlist.name }
                            </button>
                        ))}

                        <button
                            onClick={handleCreatePlaylist}
                            className='w-full px-4 py-2 text-left text-muted-text hover:text-primary-purple transition'
                        >
                            + New Playlist
                        </button>                        
                    </div>
                </div>

            </nav>

        </div>
    )
}

export default Sidebar;