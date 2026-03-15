/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const audioRef = useRef(null)

    useEffect(() => {
        const audio = new Audio()
        audio.preload = 'metadata'
        audioRef.current = audio
        document.body.appendChild(audio)

        return () => {
            if (audio.parentNode) {
                document.body.removeChild(audio)
            }
        }
    }, []);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(75);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off');

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }
    }, [volume]);

    
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            playNext();
        }

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        }
    }, [queue, repeatMode, isShuffle, currentTrack])

    const play = (track, newQueue = []) => {
        if (!track) return

        if (currentTrack?.id !== track.id) {
            audioRef.current.src = track.filePath
            setCurrentTrack(track);
            if (newQueue.length > 0) {
                setQueue(newQueue);
            }
        }

        audioRef.current.play();
        setIsPlaying(true);
    }

    const pause = () => {
        audioRef.current.pause()
        setIsPlaying(false);
    }

    const togglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            if (currentTrack) {
                audioRef.current.play()
                setIsPlaying(true);
            }
        }
    }

    const playNext = () => {
        if (queue.length === 0) return

        const currentIndex = queue.findIndex(song => song.id === currentTrack?.id);
        console.log('playNext called - currentIndex:', currentIndex, 'queue.length:', queue.length)

        if (repeatMode === 'one') {
            audioRef.current.currentTime = 0
            audioRef.current.play()
            setIsPlaying(true)
            return
        }

        let nextIndex

        if (isShuffle) {
            const availableIndices = queue
                .map((_, i) => i)
                .filter(i => i !== currentIndex)
            nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        } else {
            nextIndex = currentIndex + 1

            if (nextIndex >= queue.length) {
                if (repeatMode === 'all') {
                    nextIndex = 0
                } else {
                    setIsPlaying(false)
                    return
                }
            }
        }

        play(queue[nextIndex], queue);
    }

    const playPrevious = () => {
        if (queue.length === 0) return

        if (currentTime > 3) {
            audioRef.current.currentTime = 0
            setCurrentTime(0)
            return
        }

        const currentIndex = queue.findIndex(song => song.id === currentTrack?.id);

        if (repeatMode === 'one') {
            audioRef.current.currentTime = 0
            audioRef.current.play()
            setIsPlaying(true)
            return
        }

        let prevIndex

        if (isShuffle) {
            const availableIndices = queue.map((_, i) => i).filter(i => i !== currentIndex)
            prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        } else {
            prevIndex = currentIndex - 1

            if (prevIndex < 0) {
                if (repeatMode === 'all') {
                    prevIndex = queue.length - 1
                } else {
                    prevIndex = 0
                }
            }
        }

        play(queue[prevIndex], queue);
    }

    const seek = (time) => {
        audioRef.current.currentTime = time
        setCurrentTime(time);
    }

    const toggleShuffle = () => {
        setIsShuffle(prev => !prev)
    }

    const toggleRepeat = () => {
        setRepeatMode(prev => {
            if (prev === 'off') return 'all'
            if (prev === 'all') return 'one'
            return 'off'
        })
    }

    const value = {
        currentTrack,
        isPlaying,
        queue,
        currentTime,
        duration,
        volume,
        isShuffle,
        repeatMode,
        play,
        pause,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        audioRef,
    }

    return(
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    )

}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within PlayerProvider')
    }
    return context
}