import { Radio } from 'lucide-react';

function GenresView() {
    return (
        <div>
            <h3 className='text-2xl font-semibold text-cream-text mb-4'>Genres</h3>
            <div className='text-center py-12'>
                <Radio size={64} className='mx-auto mb-4 text-muted-text' strokeWidth={1.5} />
                <p className='text-xl text-muted-text mb-2'>Genre view coming soon!</p>
                <p className='text-sm text-muted-text'>We'll organize your music by genre here</p>
            </div>
        </div>
    )
}

export default GenresView;