import { useEffect, useRef } from 'react';

function ContextMenu({ x, y, onClose, children }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose()
            }
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    return (
        <div
            ref={menuRef}
            className='fixed bg-surface-dark border border-graphite rounded-lg shadow-xl py-2 z-50 min-w-[200px]'
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            {children}
        </div>
    )
}

export function ContextMenuItem({ onClick, children, icon }) {
    return (
        <button
            onClick={onClick}
            className='w-full px-4 py-2 text-left text-cream-text hover:bg-graphite transition flex items-center gap-3'
        >
            {icon && <span className='text-lg'>{icon}</span>}
            <span>{children}</span>
        </button>
    )
}

export function ContextMenuDivider() {
    return <div className='h-px bg-graphite my-1' />
}

export default ContextMenu;