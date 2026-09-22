'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

interface SearchBarProps {
  source?: string;
  placeholder?: string;
}

import { Suspense } from 'react';

function SearchBarContent({ source, placeholder = 'Search products, brands and categories' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = () => {
    if (query.trim()) {
      let url = `/search?q=${encodeURIComponent(query.trim())}`;
      if (source) {
        url += `&source=${source}`;
      }
      router.push(url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  return (
    <Box
      sx={{
        bgcolor: 'transparent',
        px: 2,
        py: 1,
        position: 'relative',
        zIndex: 50,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          maxWidth: 1200,
          mx: 'auto',
          bgcolor: '#f5f5f5',
          borderRadius: '24px',
          px: 2,
          py: 0.75,
          border: '1px solid #eeeeee'
        }}
      >
        <IconButton
          onClick={handleSearch}
          size="small"
          sx={{ color: '#666' }}
        >
          <SearchIcon />
        </IconButton>

        <TextField
          fullWidth
          placeholder={placeholder}
          variant="standard"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            disableUnderline: true,
            style: { fontSize: '0.95rem' }
          }}
          sx={{
            '& .MuiInputBase-input': { p: 0.5 }
          }}
        />
      </Box>
    </Box>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={null}>
      <SearchBarContent {...props} />
    </Suspense>
  );
}
