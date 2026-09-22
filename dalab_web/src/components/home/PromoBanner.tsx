import Image from 'next/image';
import { Box } from '@mui/material';

interface PromoBannerProps {
  src: string;
  alt: string;
  size?: 'small' | 'big';
  priority?: boolean;
}

export const PromoBanner = ({ src, alt, size = 'small', priority = false }: PromoBannerProps) => {
  const height = size === 'big' ? 200 : 100; // Example heights

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0,
        minWidth: size === 'big' ? '80%' : '100%',
        bgcolor: 'transparent',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'contain' }}
        priority={priority}
        unoptimized
      />
    </Box>
  );
};