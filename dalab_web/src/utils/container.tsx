'use client';

import { Container, ContainerProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export interface ResponsiveContainerProps extends ContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fluid?: boolean;
}

export function ResponsiveContainer({
  children,
  maxWidth = 'lg',
  fluid = false,
  sx,
  ...props
}: ResponsiveContainerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const containerMaxWidth = fluid ? false : maxWidth;

  return (
    <Container
      maxWidth={containerMaxWidth}
      sx={{
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
