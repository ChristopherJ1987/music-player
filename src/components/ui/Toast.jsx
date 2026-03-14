import { useEffect } from 'react';

function Toast({ message, onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div className='fixed bottom-24 right-6 bg-surface-dark border-primary-purple rounded-lg px-6 py-3 shadow-xl z-50 animate-slide-up'>
            <p className='text-cream-text flex items-center gap-2'>
                <span className='text-xl'>✓</span>
                {message}
            </p>
        </div>
    )
}

export default Toast;