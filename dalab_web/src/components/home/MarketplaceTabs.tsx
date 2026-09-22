'use client';

import { useState } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import Image from 'next/image';

interface StoreOption {
  id: string;
  name: string;
  logo?: string;
  bgColor: string;
  textColor: string;
  isImage?: boolean; // If true, render logo as image, else text
}

const STORES: StoreOption[] = [
  {
    id: 'dalab',
    name: 'dalab',
    bgColor: '#FFC644', // Brand yellow
    textColor: '#1A1A1A',
    isImage: true,
    logo: '/dalab-logo.png'
  },
  {
    id: 'shein',
    name: 'SHEIN',
    bgColor: '#000000',
    textColor: '#FFFFFF',
    isImage: true,
    logo: '/shein.png'
  },
  {
    id: 'amazon',
    name: 'amazon',
    bgColor: '#131921', // Amazon Dark Navy
    textColor: '#FFFFFF',
    logo: '/amazon.png',
    isImage: true
  },
  {
    id: 'temu',
    name: 'TEMU',
    bgColor: '#FB7701',
    textColor: '#FFFFFF',
    logo: '/temu.png',
    isImage: true
  },
  {
    id: 'supermarket',
    name: 'Super Market',
    bgColor: '#10B981', // Emerald Green for fresh feel
    textColor: '#FFFFFF',
    isImage: false // Fallback to text since no logo
  }
];


interface MarketplaceTabsProps {
  selectedStore: string;
  onSelectStore: (storeId: string) => void;
}

export function MarketplaceTabs({ selectedStore, onSelectStore }: MarketplaceTabsProps) {
  // Removed internal state


  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(180deg, #FFC644 0%, #F7F8FA 100%)',
        pt: 'calc(16px + env(safe-area-inset-top))',
        pb: 3.5,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          px: 2,
          pb: 0.5, // Space for scrollbar if visible (hidden by css)
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Chrome/Safari
          },
        }}
      >
        {STORES.map((store) => {
          const isActive = selectedStore === store.id;

          return (
            <ButtonBase
              key={store.id}
              onClick={() => onSelectStore(store.id)}
              sx={{
                flexShrink: 0,
                height: 80,
                width: 110,
                borderRadius: '24px', // Higher rounding for "squircle" look
                background: store.bgColor.includes('gradient') ? store.bgColor : store.bgColor,
                bgcolor: store.bgColor.includes('gradient') ? 'transparent' : store.bgColor,
                color: store.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 12px 24px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {store.isImage && store.logo ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={store.logo}
                    alt={store.name}
                    fill
                    style={{ objectFit: store.id === 'amazon' ? 'cover' : 'contain' }}
                    sizes="100px"
                    priority
                  />
                </Box>
              ) : (
                <Box sx={{ px: 1, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1, textTransform: 'uppercase' }}>
                    {store.name.split(' ')[0]}
                  </Typography>
                  <Typography variant="caption" fontWeight={800} sx={{ lineHeight: 1, textTransform: 'uppercase', display: 'block' }}>
                    {store.name.split(' ')[1] || ''}
                  </Typography>
                </Box>
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
