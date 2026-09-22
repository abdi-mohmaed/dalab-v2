'use client';

import { useState, useEffect, use } from 'react';
import { Box, Typography, IconButton, InputBase, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { CategoryProductList } from '@/components/category/CategoryProductList';
import { BigBanner } from '@/components/home/BigBanner';
import { ProductRow } from '@/components/home/ProductRow';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { SmallBanner } from '@/components/home/SmallBanner';

interface CategoryPageProps {
    params: Promise<{ id: string }>;
}

export default function DynamicCategoryPage({ params }: CategoryPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [categoryName, setCategoryName] = useState<string>('');
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Category Details (for name)
                // We'll use a simple find check via API or just fetch all categories and find one
                // Optimized way: distinct API or check DashboardContext if available. 
                // For now, let's fetch from the generic categories API or just infer? 
                // Better to simple fetch. I'll use the existing categories API but it returns all.
                // Let's rely on the fact that we can get it or just render "Category" until loaded?
                // Actually, let's fetch from /api/categories which returns all and find it.
                // OR create a specific fetch.
                const catRes = await fetch('/api/categories');
                const catsData = await catRes.json();
                const currentCat = (catsData.data || []).find((c: any) => c.id === id || c.name.toLowerCase() === id.toLowerCase()); // Fallback for slug-like usage
                if (currentCat) {
                    setCategoryName(currentCat.name);
                } else {
                    setCategoryName('Category');
                }

                // 2. Fetch Layout Sections
                const sectionsRes = await fetch(`/api/category-sections/${id}`);
                const sectionsData = await sectionsRes.json();
                if (sectionsData.sections) {
                    setSections(sectionsData.sections);
                }

            } catch (error) {
                console.error("Failed to load category data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 4 }}>
            {/* Header - Yellow Gradient */}
            <Box
                sx={{
                    width: '100%',
                    pt: 4,
                    pb: 8,
                    background: 'linear-gradient(180deg, #FFC644 0%, #FFFFFF 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <IconButton
                    sx={{ position: 'absolute', top: 10, left: 10, color: '#000' }}
                    onClick={() => router.back()}
                >
                    <ArrowBackIcon />
                </IconButton>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 900,
                        color: '#000000',
                        letterSpacing: '-1px',
                        textTransform: 'lowercase' // Matches "beauty" in image
                    }}
                >
                    {categoryName || <CircularProgress size={20} color="inherit" />}
                </Typography>
            </Box>

            {/* Search Bar - Purple Container */}
            <Box sx={{ px: 2, mt: -4, mb: 3, position: 'relative', zIndex: 10 }}>
                <Box
                    sx={{
                        bgcolor: '#eae6f0',
                        borderRadius: '30px',
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                >
                    <SearchIcon sx={{ color: '#666', mr: 1, flexShrink: 0 }} />
                    <InputBase
                        placeholder="search here"
                        sx={{ ml: 1, flex: 1, fontSize: '0.95rem', color: '#333' }}
                    />
                </Box>
            </Box>

            {/* Content: Layout Sections OR Default Product List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : sections.length > 0 ? (
                // Dynamic Layout Engine
                <Box sx={{ pb: 4 }}>
                    {sections.map((section: any) => {
                        if (!section.active) return null;
                        switch (section.type) {
                            case 'BANNERS':
                                // Simplified banner rendering (BigBanner slider)
                                const banners = section.config?.banners || [];
                                if (banners.length === 0) return null;
                                return (
                                    <Box key={section.id} sx={{ mb: 2 }}>
                                        {/* Assume simplified slider or single banner for now */}
                                        <BigBanner
                                            title={(banners as any[])[0].title}
                                            src={(banners as any[])[0].image}
                                        />
                                    </Box>
                                );
                            case 'PRODUCTS':
                                return (
                                    <ProductRow
                                        key={section.id}
                                        title={section.title}
                                        products={section.products || []}
                                    />
                                );
                            case 'SMALL_BANNERS':
                                const sb = section.config?.banners?.[0];
                                if (!sb) return null;
                                return (
                                    <Box key={section.id} sx={{ px: 2, py: 1 }}>
                                        <SmallBanner title={sb.title} src={sb.image} type={sb.mediaType} bgcolor={sb.bgcolor} />
                                    </Box>
                                );
                            default:
                                return null;
                        }
                    })}
                    {/* Append Infinite List at bottom if desired, or replace? User said "optional layout... default is products". 
                        Usually layout replaces default. But let's assume if sections exist, they take over. 
                        If user wants products, they add a PRODUCT section.
                     */}
                </Box>
            ) : (
                // Default Layout: All Products Infinite Load
                <CategoryProductList categoryId={id} />
            )}
        </Box>
    );
}
