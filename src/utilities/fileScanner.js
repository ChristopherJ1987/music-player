import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

/**
 * Scans audio files and extracts metadata
 * @param {FileList} files - Files from input or directory picker
 * @returns {Promise<Array>} - Array of song objects with metadata
 */

export async function scanAudioFiles(files) {
    const songs = [];
    const supportedFormats = ['.mp3', '.flac', '.wav', '.m4a', '.ogg', '.aac'];

    for (const file of files) {
        try {
            // Check if file is an audio file
            const isAudioFile = supportedFormats.some(format => 
                file.name.toLowerCase().endsWith(format)
            )

            if (!isAudioFile) {
                console.log(`Skipping non-audio file: ${file.name}`)
                continue
            }

            // Read metadata from file
            const metadata = await mm.parseBlob(file);

            // Extract album art (if available)
            let albumArt = null;
            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0];
                const blob = new Blob([picture.data], { type: picture.format });
                albumArt = URL.createObjectURL(blob)
            }

            // Create song object
            const song = {
                id: `${file.name}-${Date.now()}-${Math.random()}`, // Unique id
                title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ''), // Fallback to filename
                artist: metadata.common.artist || 'Unknown Artist',
                album: metadata.common.album || 'Unknown Album',
                albumArtist: metadata.common.albumartist || metadata.common.artist || 'Unknown Artist',
                year: metadata.common.year || null,
                genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown',
                duration: metadata.format.duration || 0,
                artwork: albumArt,
                filePath: URL.createObjectURL(file), // Create playable URL
                fileSize: file.size,
                format: metadata.format.container || file.name.split('.').pop(),
                fileName: file.name,
            }
            songs.push(song)
            console.log(`✅ Scanned: ${song.title} - ${song.artist}`)
        } catch (error) {
            console.error(`❌ Error Scanning ${file.name}:`, error)
            // Continue with next file even if one fails
        }
    }

    return songs
}

/**
 * Triggers file picker for user to select audio files
 * @returns {Promise<FileList>} - Selected files
 */

export async function pickAudioFiles() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file'
        input.accept = 'audio/*'

        input.onChange = (e) => {
            resolve(e.target.files)
        }

        input.click()
    })
}

/**
 * Triggers directory picker (works in Chrome/Edge, not Safari)
 * @returns {Promise<Array>} - Array of files from directory
 */

export async function pickMusicFolder() {
    try {
        // Check if browser supports picker
        if (!window.showDirectoryPicker) {
            console.warn('Directory picker not supported, falling back to file picker')
            return await pickAudioFiles()
        }

        // Open directory picker
        const dirHandle = await window.showDirectoryPicker();

        // Recursively get all files
        const files = await getAllFilesFromDirectory(dirHandle)

        return files
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('User cancelled folder selection')
            return []
        }
        throw error
    }
}

/**
 * Recursively gets all files from a directory
 * @param {FileSystemDirectoryHandle} dirHandle
 * @returns {Promise<Array>} - Array of file objects
 */

async function getAllFilesFromDirectory(dirHandle) {
    const files = [];

    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
            const file = await entry.getFile();
            files.push(file)
        } else if (entry.kind === 'directory') {
            // Recursively scan subdirectories
            const subFiles = await getAllFilesFromDirectory(entry);
            files.push(...subFiles)
        }
    }

    return files
}