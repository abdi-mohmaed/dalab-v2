'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import { MarketplaceTabs } from '@/components/home/MarketplaceTabs';
import { BigBanner } from '@/components/home/BigBanner';
import { MiddleBanner } from '@/components/home/MiddleBanner';
import { SmallBanner } from '@/components/home/SmallBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductCard } from '@/components/home/ProductCard';
import { SearchBar } from '@/components/home/SearchBar';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';

import { useProducts } from '@/hooks/useProducts';
import { useDashboard } from '@/context/DashboardContext';
import { useStore } from '@/context/StoreContext';

export default function Home() {
  const { currentStore } = useStore();
  const selectedStore = currentStore?.slug || 'dalab';
  const { homepageSections, categories, isLoading: isDashboardLoading } = useDashboard();
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  const { products: globalProducts, isLoading: isProductsLoading } = useProducts({
    store: selectedStore === 'dalab' ? undefined : selectedStore,
    pageSize: 10
  });

  // Slow Auto-Scroll for Hero Banners
  useEffect(() => {
    const timer = setInterval(() => {
      if (bannerScrollRef.current) {
        const container = bannerScrollRef.current;
        const width = container.offsetWidth;
        const maxScroll = container.scrollWidth - width;

        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: width * 0.9, behavior: 'smooth' });
        }
      }
    }, 6000); // 6 seconds for "slow" feel

    return () => clearInterval(timer);
  }, [homepageSections]);

  const router = useRouter();

  if (isDashboardLoading || (isProductsLoading && globalProducts.length === 0)) {
    return <HomeSkeleton />;
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #FFC644 0%, #FDFBF7 100%)',
        minHeight: '100vh',
      }}
    >
      {/* 1. Store Selection & Brand Header */}
      <MarketplaceTabs
        selectedStore={selectedStore}
        onSelectStore={(slug) => {
          if (slug === 'dalab') {
          } else {
            router.push(`/marketplace/${slug}`);
          }
        }}
      />

      {/* 2. Main Content Area (White Rounded Container) */}
      <Box
        sx={{
          bgcolor: 'background.default',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          mt: -2,
          minHeight: '80vh',
          position: 'relative',
          zIndex: 1,
          pt: 1
        }}
      >
        <Box sx={{ px: 2, mb: 1 }}>
          <SearchBar source="home" placeholder="Search products, brands and categories" />
        </Box>

        {homepageSections
          .filter(s => s.active)
          .sort((a, b) => a.order - b.order)
          .map((section: any) => {
            const elements = [];

            switch (section.type) {
              case 'BANNERS':
                const bigBanners = section.config?.banners || [];
                elements.push(
                  <Box
                    key={section.id}
                    ref={bannerScrollRef}
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 2,
                      px: 3,
                      py: 1.5,
                      scrollSnapType: 'x mandatory',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' }
                    }}
                  >
                    {bigBanners.map((banner: any, idx: number) => (
                      <Box key={idx} sx={{ minWidth: '92%', scrollSnapAlign: 'center' }}>
                        <BigBanner {...banner} />
                      </Box>
                    ))}
                  </Box>
                );
                break;

              case 'MIDDLE_BANNERS':
                const middleBanners = section.config?.banners || [];
                elements.push(
                  <Box
                    key={section.id}
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 2,
                      px: 3,
                      py: 1,
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' }
                    }}
                  >
                    {middleBanners.map((banner: any, idx: number) => (
                      <Box key={idx} sx={{ minWidth: '85%' }}>
                        <MiddleBanner {...banner} />
                      </Box>
                    ))}
                  </Box>
                );
                break;

              case 'SMALL_BANNERS':
                const smallBanners = section.config?.banners || [];
                elements.push(
                  <Box key={section.id} sx={{ px: 3, py: 1 }}>
                    {smallBanners.slice(0, 1).map((banner: any, idx: number) => (
                      <SmallBanner key={idx} {...banner} />
                    ))}
                  </Box>
                );
                break;

              case 'CATEGORIES':
                elements.push(<CategoryGrid key={section.id} />);
                break;

              case 'PRODUCTS':
                // FIX: Use section.products directly from API for better performance and visibility
                const sectionProducts = section.products || [];
                if (sectionProducts.length > 0) {
                  elements.push(
                    <Box key={section.id} sx={{ px: 3, py: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {section.title}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        overflowX: 'auto',
                        px: 3,
                        mx: -3,
                        pb: 1,
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' }
                      }}>
                        {sectionProducts.map((product: any) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.title}
                            price={product.price?.toString() || '0'}
                            rating={product.rating || 0}
                            image={product.image}
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                }
                break;
            }
            return elements;
          })}
      </Box>
    </Box>
  );
}
