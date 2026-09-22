# Dalab Logo Instructions

## Logo File Location
Place your official Dalab logo image file at:
```
public/dalab-logo.png
```

## Supported Formats
- PNG (recommended)
- SVG
- JPG/JPEG

## File Naming
The logo file must be named exactly: `dalab-logo.png`

## Usage
The logo is automatically used throughout the application via the `DalabLogo` component:
- Splash page
- Navbar
- Footer
- Home page
- All other pages that display the brand

## Fallback
If the logo image is not found, the component will automatically fall back to styled text "dalab" in the brand colors.

## Component Usage
```tsx
import { DalabLogo } from '@/components/splash/DalabLogo';

// Small size
<DalabLogo size="small" />

// Medium size (default for navbar/footer)
<DalabLogo size="medium" />

// Large size (default for splash/home)
<DalabLogo size="large" />

// Custom dimensions
<DalabLogo width={150} height={75} />
```
