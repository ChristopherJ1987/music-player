function PlaybackBar() {
    return (
        <div className="h-20 bg-surface-dark border-t border-graphite flex items-center justify-between px-6">

            {/* Left: Track info */}
            <div className="flex items-center gap-4 w-80">
                <div className="w-14 h-14 bg-gradient-hero rounded flex items-center justify-center">
                    ...
                </div>
                <div>
                    <p className="text-sm font-semibold text-cream-text">Current Songs</p>
                    <p className="text-xs text-muted-text">Artist Name</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-center gap-6">
                    <button className="text-2xl text-muted-text hover:text-cream-text transition">
                        ⏮
                    </button>
                    <button className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-2xl hover:opacity-80 transition">
                        ▶
                    </button>
                    <button className="text-2xl text-muted-text hover:text-cream-text transition">
                        ⏭
                    </button>
                </div>

                {/* Progress bar placeholder */}
                <div className="w-full max-w-lg">
                    <div className="h-1 bg-graphite rounded-full">
                        <div className="h-1 bg-primary-purple rounded-full w-1/3"></div>
                    </div>
                </div>
            </div>

            {/* Right: Volume & extras */}
            <div className="flex items-center gap-4 w-80 justify-end">
                <button className="text-xl text-muted-text hover:text-cream-text transition">
                    🔊
                </button>
                <button className="text-xl text-muted-text hover:text-accent-orange transition">
                    ●
                </button>
            </div>

        </div>
    )
}

export default PlaybackBar;