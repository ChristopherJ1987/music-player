import { useMusic } from '../../context/MusicContext';

function MainContent() {
    const { currentView, filteredSongs, playlists } = useMusic();

    const renderView = () => {
        if (currentView === 'library') {
            return <LibraryView songs={filteredSongs} />
        } else if (currentView === 'genres') {
            return <GenresView />
        } else if (currentView.startsWith('playlist-')) {
            const playlistId = currentView.replace('playlist-', '');
            const playlist = playlists.find(p => p.id === playlistId);
            return <PlaylistView playlist={playlist} />
        };
    }

    return (
        <div className="flex-1 bg-bg-dark overflow-y-auto">
            <div className="p-6">

                {/* Now Playing Card */}
                <div className="bg-surface-dark border-2 border-primary-purple rounded-xl p-8 mb-8">
                    <div className="flex items-center gap-6">

                        {/* Album Art Placeholder */}
                        <div className="w-72 h-72 bg-gradient-hero rounded-lg flex items-center justify-center">
                            <span className="text-6xl">...</span>
                        </div>

                        {/* Track Info */}
                        <div className="flex-1">
                            <h2 className="font-bitcount text-4xl text-cream-text mb-2">
                                Song Title
                            </h2>
                            <p className="text-xl text-muted-text mb-1">Artist Name</p>
                            <p className="text-lg text-muted-text">Album Name</p>
                        </div>

                    </div>
                </div>

                {renderView()}
            </div>
        </div>
    )
}
    
function LibraryView({ songs }) {
    return (
        <div>
        <h3 className='text-2xl font-semibold text-cream-text mb-4'>Library</h3>
        {songs.length === 0 ? (
            <div className='text-center py-12'>
                <p className='text-4xl mb-4'>🎵</p>
                <p className='text-xl text-muted-text mb-2'>No music yet</p>
                <p className='text-sm text-muted-text'>Add a folder to get started</p>
            </div>
        ) : (
            <div className='grid grid-cols-5 gap-4'>
                {songs.map((song, i) => (
                    <div
                    key={i}
                    className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer'>
                        <div className='aspect-square bg-gradient-accent rounded-lg mb-3 flex items-center justify-center'>
                            <span className='text-4xl'>🎵</span>
                        </div>
                        <h4 className='text-sm font-semibold text-cream-text truncate'>
                            {song.title || 'Unknown Song'}
                        </h4>
                        <p className='text-sm text-muted-text truncate'>
                            {song.artist || 'Unknown Artist'}
                        </p>
                    </div>
                ))}
            </div>
        )}
        </div>
    )
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
    if (!playlist) {
        return (
            <div className='text-center py-12'>
                <p className='text-xl text-muted-text'>Playlist not found</p>
            </div>
        )
    }
    
    return (
        <div>
            <h3 className='text-2xl font-semibold text-cream-text mb-4'>
                {playlist.name}
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
                        className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer flex items-center gap-4'>
                                <span className='text-muted-text'>{i + 1}</span>
                                <div className='flex-1'>
                                    <p className='text-cream-text font-semibold'>{song.title}</p>
                                    <p className='text-sm text-muted-text'>{song.artist}</p>
                                </div>
                            </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MainContent;