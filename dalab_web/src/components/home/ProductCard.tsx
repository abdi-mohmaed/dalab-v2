import Link from 'next/link';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import Image from 'next/image';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  rating: number;
  image?: string;
}

export function ProductCard({ id, name, price, rating, image = '/phone-product-image.jpg' }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);
  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          minWidth: 180,
          maxWidth: 180,
          position: 'relative',
          bgcolor: '#ffffff',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Bookmark Icon - Top Left */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 4,
            left: 4,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1,
            '&:hover': {
              bgcolor: '#ffffff',
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            // Handle bookmark
          }}
        >
          <BookmarkBorderIcon fontSize="small" />
        </IconButton>

        {/* Product Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 180,
            bgcolor: '#f5f5f5',
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Product Info */}
        <Box sx={{ p: 1.5 }}>
          {/* Product Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              mb: 1,
              fontSize: '0.875rem',
              lineHeight: 1.3,
              minHeight: 36,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <StarIcon sx={{ fontSize: 16, color: '#FFC644' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
              {rating}
            </Typography>

          </Box>

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#000000',
              mb: 1,
              fontSize: '1rem',
            }}
          >
            {price}
          </Typography>


        </Box>

        {/* Heart Icon - Bottom Right */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1,
            color: isWishlisted ? '#f44336' : 'inherit',
            '&:hover': {
              bgcolor: '#ffffff',
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(id);
          }}
        >
          {isWishlisted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Link>
  );
}
