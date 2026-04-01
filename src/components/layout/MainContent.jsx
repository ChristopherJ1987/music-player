import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import { Music } from 'lucide-react';
import AlbumsView from '../views/AlbumsView';
import ArtistsView from '../views/ArtistsView';
import GenresView from '../views/GenresView';
import PlaylistView from '../views/PlaylistView';
import AlbumDetailView from '../views/AlbumDetailView';
import ArtistDetailView from '../views/ArtistDetailView';
import SearchResultsView from '../views/SearchResultsView';

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

export default MainContent;