function TopBar() {
    return (
        <div className="h-16 bg-surface-dark border-b border-graphite flex items-center justify-between px-6">
            {/* Left: Search placeholder */}
            <div className="flex-1 max-w-md">
                <div className="bg-graphite rounded-lg px-4 py-2 text-muted-text">
                    🔍 Search for songs, artists, albums...
                </div>
            </div>

            {/* Right: Settings placeholder */}
            <div className="flex items-center gap-4">
                <button className="text-muted-text hover:text-cream-text transition">
                    ⚙️ Settings
                </button>
            </div>

        </div>
    )
}

export default TopBar;