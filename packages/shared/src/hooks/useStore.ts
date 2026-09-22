import { useState } from 'react';

export function useStore() {
    const [currentStore, setCurrentStore] = useState<{ id: string; name: string; slug: string }>({
        id: '1',
        name: 'Dalab',
        slug: 'dalab',
    });

    return {
        currentStore,
        setCurrentStore,
    };
}
