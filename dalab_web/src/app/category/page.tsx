'use client';

import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Grid, Button, Divider, Badge, Paper } from '@mui/material';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

import { useDashboard } from '@/context/DashboardContext';

export default function CategoryPage() {
  const router = useRouter();
  const { categories } = useDashboard();

  // Default to the first category if available, or a fallback
  const firstCategoryName = categories.length > 0 ? categories[0].name : 'best deals today';
  const [selectedCategory, setSelectedCategory] = useState<string>(firstCategoryName);

  const { products, hasMore, isLoading, loadMore } = useProducts({
    category: selectedCategory === 'best deals today' ? undefined : selectedCategory,
    pageSize: 8
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 4 }}>
      {/* Custom Header matching the uploaded design */}
      <Box
        sx={{
          width: '100%',
          pt: 'calc(32px + env(safe-area-inset-top))',
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
          sx={{ position: 'absolute', top: 'calc(10px + env(safe-area-inset-top))', left: 10, color: '#000' }}
          onClick={() => router.back()}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#000000',
            letterSpacing: '-1px'
          }}
        >
          Categories
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <Grid item xs={4} key={category.id}>
                <Box
                  onClick={() => handleCategoryClick(category.name)}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: 'linear-gradient(180deg, #F7CD07 0%, #FFFFFF 92%)',
                      borderRadius: '24px',
                      position: 'relative',
                      overflow: 'hidden',
                      border: isSelected ? '3px solid #000' : '1px solid rgba(0,0,0,0.05)', // Sharper border for selection
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Category Image */}
                    {category.image && (
                      <Box sx={{ position: 'relative', width: '70%', height: '70%', zIndex: 1 }}>
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          style={{ objectFit: 'contain' }}
                          sizes="(max-width: 600px) 33vw, 20vw"
                        />
                      </Box>
                    )}
                  </Paper>

                  {/* Category Name Below Box */}
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      color: isSelected ? '#000' : '#666',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      lineHeight: 1.1,
                      textTransform: 'lowercase',
                      maxWidth: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>


      {/* Title Header */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase' }}>
          {selectedCategory}
        </Typography>
      </Box>

      {/* Filtered Products Grid */}
      <Box sx={{ px: 2 }}>
        <ProductGrid
          products={products}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage={selectedCategory ? "No products found in this category." : "Select a category to view products."}
        />
      </Box>
    </Box>
  );
}