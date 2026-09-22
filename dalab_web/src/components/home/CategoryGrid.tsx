'use client';

import { Box, Grid, Typography, Paper } from '@mui/material';
import { useDashboard } from '@/context/DashboardContext';
import Link from 'next/link';
import Image from 'next/image';

export function CategoryGrid() {
  const { categories } = useDashboard();

  return (
    <Box sx={{
      px: 2,
      py: 2,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' }
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateRows: 'repeat(2, auto)',
        gridAutoFlow: 'column',
        gap: 2,
        width: 'max-content'
      }}>
        {categories.map((category) => (
          <Box key={category.id} sx={{ width: 170 }}>
            <Link href={`/category/${category.id || category.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: 160,
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(180deg, #F7CD07 0%, #FFFFFF 92%)',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Category Image */}
                  {category.image && (
                    <Box sx={{ position: 'relative', width: '80%', height: '80%', zIndex: 1 }}>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="160px"
                        quality={90}
                      />
                    </Box>
                  )}
                </Paper>

                {/* Category Name Below Box */}
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
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
            </Link>
          </Box>
        ))}
      </Box>
    </Box >
  );
}
