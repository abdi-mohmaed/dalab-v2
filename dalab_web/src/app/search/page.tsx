'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SearchBar } from '@/components/home/SearchBar';
import { ProductGrid } from '@/components/ProductGrid';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        async function fetchResults() {
            if (!query) {
                setProducts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&page=1&limit=20`);
                if (!res.ok) throw new Error('Failed to fetch search results');
                const result = await res.json();

                setProducts(result.data || []);
                setHasMore(result.pagination.page < result.pagination.totalPages);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [query]);

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
            {/* Header Area */}
            <Box sx={{ pt: 'calc(16px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => router.back()} sx={{ ml: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, ml: 1 }}>
                    Search Results
                </Typography>
            </Box>

            <SearchBar />

            <Container maxWidth="lg" sx={{ mt: 2 }}>
                {query && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Showing results for "<b>{query}</b>"
                    </Typography>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {!isLoading && products.length === 0 && query && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No products found for "{query}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try checking your spelling or use more general terms
                        </Typography>
                    </Box>
                )}

                {isLoading && page === 1 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#FFC644' }} />
                    </Box>
                ) : (
                    <ProductGrid
                        products={products}
                        isLoading={isLoading}
                        hasMore={hasMore}
                        onLoadMore={() => { }} // TODO: Add pagination support
                    />
                )}
            </Container>
        </Box>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FFC644' }} />
            </Box>
        }>
            <SearchContent />
        </Suspense>
    );
}

