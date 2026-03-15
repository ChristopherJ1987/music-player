import { usePlayer } from '../../context/PlayerContext';

function PlaybackBar() {
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isShuffle,
        repeatMode,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
    } = usePlayer();

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleProgressClick = (e) => {
        if (!duration) return
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        seek(newTime)
    }

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value)
        console.log('Volume slider changed to:',newVolume)
        setVolume(Number(e.target.value))
    }

    return (
        <div className='h-20 bg-surface-dark border-t border-graphite flex items-center justify-between px-6'>
            <div className='flex items-center gap-4 w-80'>
                <div className='w-14 h-14 bg-gradient-hero rounded flex items-center justify-center overflow-hidden'>
                    {currentTrack?.artwork ? (
                        <img
                            src={currentTrack.artwork}
                            alt={currentTrack.album}
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <span className='text-2xl'>...</span>
                    )}
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-cream-text truncate'>
                        {currentTrack?.title || 'No song playing'}
                    </p>
                    <p className='text-xs text-muted-text truncate'>
                        {currentTrack?.artist || 'Select a song'}
                    </p>
                </div>
            </div>
            <div className='flex-1 flex flex-col items-center gap-2 max-w-2xl'>
                <div className='flex items-center gap-6'>
                    <button
                        onClick={toggleShuffle}
                        disabled={!currentTrack}
                        className={`text-xl transition disabled:opacity-30 disabled:cursor-not-allowed ${isShuffle ? 'text-primary-purple' : 'text-muted-text hover:text-cream-text'}`}
                        title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
                    >
                        🔀
                    </button>
                    <button
                        onClick={playPrevious}
                        disabled={!currentTrack}
                        className='text-2xl text-muted-text hover:text-cream-text transition disabled:opacity-30 disabled:cursor-not-allowed'>
                            ⏮
                    </button>
                    <button
                        onClick={togglePlay}
                        disabled={!currentTrack}
                        className='w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-2xl hover:opacity-80 transition disabled:opacity-30 disabled:cursor-not-allowed'>
                            {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button
                        onClick={playNext}
                        disabled= {!currentTrack}
                        className='text-2xl text-muted-text hover:text-cream-text transition disabled:opacity-30 disabled:cursor-not-allowed'>
                            ⏭
                    </button>
                    <button
                        onClick={toggleRepeat}
                        disabled={!currentTrack}
                        className={`text-xl transition disabled:opacity-30 disabled:cursor-not-allowed ${repeatMode !== 'off' ? 'text-primary-purple' : 'text-muted-text hover:text-cream-text'}`}
                        title={repeatMode === 'off' ? 'Repeat off' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}
                    >
                        {repeatMode === 'one' ? '🔂' : '🔁'}
                    </button>
                </div>
                <div className='w-full flex items-center gap-2'>
                    <span className='text-xs text-muted-text min-w-[40px]'>
                        {formatTime(currentTime)}
                    </span>
                    <div
                        onClick={handleProgressClick}
                        className='flex-1 h-1 bg-graphite rounded-full cursor-pointer group'>
                        <div
                            className='h-full bg-primary-purple rounded-full relative transition-all'
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
                            <div className='absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cream-text rounded-full opacity-0 group-hover:opacity-100 transition' />
                        </div>
                    </div>
                    <span className='text-xs text-muted-text min-w-[40px]'>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
            <div className='flex items-center gap-4 w-80 justify-end'>
                <span className='text-xl'>
                    {volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
                </span>
                <input
                    type='range'
                    min='0'
                    max='100'
                    value={volume}
                    onChange={handleVolumeChange}
                    className='w-24 h-1 bg-graphite rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-cream-text
                        [&::-moz-range-thumb]:w-3
                        [&::-moz-range-thumb]:h-3
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-cream-text
                        [&::-moz-range-thumb]:border-0'
                />
            </div>
        </div>
    )
}


export default PlaybackBar;