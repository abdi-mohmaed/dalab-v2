'use client';

import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

interface DalabLogoProps {
  size?: 'small' | 'medium' | 'large';
  width?: number;
  height?: number;
}

export function DalabLogo({ 
  size = 'large', 
  width, 
  height 
}: DalabLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Default sizes based on size prop
  const sizeMap = {
    small: { width: 80, height: 40 },
    medium: { width: 120, height: 60 },
    large: { width: 200, height: 100 },
  };

  const logoWidth = width || sizeMap[size].width;
  const logoHeight = height || sizeMap[size].height;

  // Fallback text styling
  const textSizeMap = {
    small: { fontSize: '1.5rem' },
    medium: { fontSize: '2rem' },
    large: { fontSize: '3rem' },
  };

  if (imageError) {
    return (
      <Typography
        component="div"
        sx={{
          fontFamily: 'sans-serif',
          fontSize: {
            xs: textSizeMap[size].fontSize,
            md: size === 'large' ? '4rem' : textSizeMap[size].fontSize,
          },
          fontWeight: 700,
          color: '#1a237e',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        dalab
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: {
          xs: logoWidth,
          md: size === 'large' ? logoWidth * 1.2 : logoWidth,
        },
        height: {
          xs: logoHeight,
          md: size === 'large' ? logoHeight * 1.2 : logoHeight,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/dalab-logo.png"
        alt="Dalab Logo"
        width={logoWidth}
        height={logoHeight}
        priority
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onError={() => setImageError(true)}
      />
    </Box>
  );
}
