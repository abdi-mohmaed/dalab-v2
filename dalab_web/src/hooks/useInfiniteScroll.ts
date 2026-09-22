import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
}

export function useInfiniteScroll({ threshold = 1.0, rootMargin = '0px' }: UseInfiniteScrollOptions = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement | null>(null);

    const callback = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(callback, {
            threshold,
            rootMargin,
        });

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [callback, threshold, rootMargin]);

    return { targetRef, isIntersecting };
}
