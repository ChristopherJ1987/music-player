/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const audioRef = useRef(new Audio());

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(75);

    useEffect(() => {
        audioRef.current.volume - volume / 100
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            PlayerContext();
        }

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        }
    }, [queue])

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
        const nextIndex = (currentIndex + 1) % queue.length;
        play(queue[nextIndex],queue);
    }

    const playPrevious = () => {
        if (queue.length === 0) return

        const currentIndex = queue.findIndex(song => song.id === currentTrack?.id);
        const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        play(queue[prevIndex], queue);
    }

    const seek = (time) => {
        audioRef.current.currentTime = time
        setCurrentTime(time);
    }

    const value = {
        currentTrack,
        isPlaying,
        queue,
        currentTime,
        duration,
        volume,
        play,
        pause,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        audioRef,
    }

    return (
        <PlayerContext.Provider value={ value }>
            { children }
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