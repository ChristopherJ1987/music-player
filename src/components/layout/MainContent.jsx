import { useMusic } from '../../context/MusicContext';
import { usePlayer } from '../../context/PlayerContext';
import { pickMusicFolder, scanAudioFiles } from '../../utilities/fileScanner';
import { useState } from 'react';

function MainContent() {
    const { currentView, filteredSongs, playlists } = useMusic();
    const { currentTrack, isPlaying } = usePlayer();

    const renderView = () => {
        if (currentView === 'library') {
            return <LibraryView songs={filteredSongs} />
        } else if (currentView === 'genres') {
            return <GenresView />
        } else if (currentView.startsWith('playlist-')) {
            const playlistId = currentView.replace('playlist-', '');
            const playlist = playlists.find(p => p.id === playlistId);
            return <PlaylistView playlist={playlist} />
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
    
function LibraryView({ songs }) {
    const { addSongsToLibrary } = useMusic();
    const { play } = usePlayer();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

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

    const handlePlaySong = (song) => {
        play(song,songs)
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-semibold text-cream-text mb-4'>Library</h3>
                <button
                    onClick={handleAddMusic}
                    disabled={isScanning}
                    className='bg-gradient-hero text-cream-text px-6 py-2 rounded-lg hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isScanning ? 'Scanning...' : '+ Add Music'}
                </button>
            </div>

            {isScanning && (
                <div className='bg-surface-dark p-4 rounded-lg mb-4'>
                    <p className='text-cream-text mb-2'>
                        Scanning files... {scanProgress.current} / {scanProgress.total}
                    </p>
                    <div className='h-2 bg-graphite rounded-full overflow-hidden'>
                        <div className='h-full bg-gradient-hero transition-all' style={{ width: `${(scanProgress.current / scanProgress.total) * 100}` }} />
                    </div>
                </div>
            )}

            {songs.length === 0 ? (
                <div className='text-center py-12'>
                    <p className='text-4xl mb-4'>🎵</p>
                    <p className='text-xl text-muted-text mb-2'>No music yet</p>
                    <p className='text-sm text-muted-text'>Add a folder to get started</p>
                    <button
                        onClick={handleAddMusic}
                        className='bg-gradient-hero text-cream-text px-8 py-3 rounded-lg hover:opacity-80 transition text-lg'>
                            Add Music Folder
                        </button>
                </div>
            ) : (
                <div className='grid grid-cols-5 gap-4'>
                    {songs.map((song) => (
                        <div
                            key={song.id}
                            onClick={() => handlePlaySong(song)}
                            className='bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer group'>
                            <div className='aspect-square rounded-lg mb-3 flex items-center justify-center overflow-hidden bg-gradient-accent relative'>
                                {song.artwork ? (
                                    <img
                                        src={song.artwork}
                                        alt={song.album}
                                        className='w-full h-full object-cover' />
                                ) : (
                                    <span className='text-4xl'>🎵</span>
                                )}
                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                                    <span className='text-5xl'>▶️</span>
                                </div>
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