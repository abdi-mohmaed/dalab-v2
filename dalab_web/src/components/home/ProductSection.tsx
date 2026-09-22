'use client';

import { Box, Typography } from '@mui/material';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  image?: string;
}

interface ProductSectionProps {
  title: string;
  products?: Product[];
  loading?: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'm1',
    name: 'Apple iPhone 17pro max 256 GB cosmi',
    price: '$99.99',
    rating: 5.5,
  },
  {
    id: 'm2',
    name: 'Apple iPhone 17pro max 256 GB cosmi',
    price: '$99.99',
    rating: 5.5,
  },
  {
    id: 'm3',
    name: 'Apple iPhone 17pro max 256 GB cosmi',
    price: '$99.99',
    rating: 5.5,
  },
  {
    id: 'm4',
    name: 'Apple iPhone 17pro max 256 GB cosmi',
    price: '$99.99',
    rating: 5.5,
  },
];

export function ProductSection({ title, products = mockProducts, loading = false }: ProductSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          px: 2,
          fontSize: { xs: '1.4rem', md: '1.6rem' },
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>

      {/* Horizontal Scroll Container */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          px: 2,
          pb: 2,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: '#f5f5f5',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#cccccc',
            borderRadius: 3,
            '&:hover': {
              bgcolor: '#aaaaaa',
            },
          },
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
      </Box>
    </Box>
  );
}
