import React, { useState, useMemo } from 'react';

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  theme?:
    | 'hex-red'
    | 'hex-green'
    | 'hex-gold'
    | 'nem-bui'
    | 'nem-chua'
    | 'nem-ngua'
    | 'combo'
    | 'hero';
  angleIndex?: number;
}

function createHeritageArtworkDataUri(
  theme: ImgProps['theme'] = 'hex-red',
  angleIndex: number = 1,
  srcHint: string = ''
): string {
  let resolvedTheme = theme;
  if (srcHint.includes('nem-bui')) resolvedTheme = 'nem-bui';
  else if (srcHint.includes('nem-chua')) resolvedTheme = 'nem-chua';
  else if (srcHint.includes('nem-ngua')) resolvedTheme = 'nem-ngua';
  else if (srcHint.includes('binh-an') || srcHint.includes('chon-set')) resolvedTheme = 'hex-green';
  else if (srcHint.includes('doc-ban') || srcHint.includes('qua-tet')) resolvedTheme = 'hex-gold';
  else if (srcHint.includes('combo') || srcHint.includes('khong-gian')) resolvedTheme = 'combo';
  else if (srcHint.includes('hero')) resolvedTheme = 'hero';

  const palettes = {
    'hex-red': {
      bg1: '#7E111B',
      bg2: '#42070C',
      accent: '#E8C574',
      paper: '#FFF5E4',
      inner: '#951722',
      leaf: '#1F3D2A',
    },
    'hex-green': {
      bg1: '#1F3D2A',
      bg2: '#0F2116',
      accent: '#E6C67C',
      paper: '#FFF5E4',
      inner: '#1F3D2A',
      leaf: '#951722',
    },
    'hex-gold': {
      bg1: '#231D18',
      bg2: '#6B1018',
      accent: '#F3D27A',
      paper: '#FFF5E4',
      inner: '#951722',
      leaf: '#B8860B',
    },
    'nem-bui': {
      bg1: '#26462E',
      bg2: '#15281A',
      accent: '#E8C468',
      paper: '#FFF5E4',
      inner: '#2C5234',
      leaf: '#951722',
    },
    'nem-chua': {
      bg1: '#721820',
      bg2: '#243D2B',
      accent: '#F0CF7F',
      paper: '#FFF5E4',
      inner: '#951722',
      leaf: '#1F3D2A',
    },
    'nem-ngua': {
      bg1: '#4D1A18',
      bg2: '#1B3424',
      accent: '#E5C168',
      paper: '#FFF5E4',
      inner: '#7A2022',
      leaf: '#1F3D2A',
    },
    combo: {
      bg1: '#6D1019',
      bg2: '#183222',
      accent: '#F5D680',
      paper: '#FFF5E4',
      inner: '#951722',
      leaf: '#1F3D2A',
    },
    hero: {
      bg1: '#5E0D15',
      bg2: '#162C1E',
      accent: '#F2CF78',
      paper: '#FFF5E4',
      inner: '#951722',
      leaf: '#1F3D2A',
    },
  };

  const p = palettes[resolvedTheme || 'hex-red'];

  // Distinct rich artisanal illustration for each of the 5 gallery angles
  let centerScene = '';
  if (angleIndex === 1) {
    // Angle 1: Iconic Hexagonal Gift Box with Double Đông Hồ Frame & Silk Ribbon
    centerScene = `
      <g transform="translate(400, 300)">
        <!-- Outer shadow & glow -->
        <polygon points="0,-195 170,-98 170,98 0,195 -170,98 -170,-98" fill="#000000" fill-opacity="0.25" transform="translate(0, 12)"/>
        <!-- Hexagonal Box Body -->
        <polygon points="0,-190 165,-95 165,95 0,190 -165,95 -165,-95" fill="${p.paper}" stroke="${p.accent}" stroke-width="6"/>
        <polygon points="0,-170 147,-85 147,85 0,170 -147,85 -147,-85" fill="none" stroke="${p.inner}" stroke-width="2.5"/>
        <polygon points="0,-156 135,-78 135,78 0,156 -135,78 -135,-78" fill="${p.inner}" fill-opacity="0.07" stroke="${p.inner}" stroke-width="1" stroke-dasharray="6 4"/>
        <!-- Corner Đông Hồ clouds/petals -->
        <circle cx="0" cy="-145" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="125" cy="-72" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="125" cy="72" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="0" cy="145" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="-125" cy="72" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="-125" cy="-72" r="8" fill="${p.accent}" stroke="${p.inner}" stroke-width="2"/>
        <!-- Center Monogram Cartouche -->
        <rect x="-56" y="-70" width="112" height="140" rx="24" fill="${p.paper}" stroke="${p.inner}" stroke-width="4"/>
        <rect x="-46" y="-60" width="92" height="120" rx="18" fill="none" stroke="${p.accent}" stroke-width="2"/>
        <!-- Woodblock Lotus & Sun Motif -->
        <circle cx="0" cy="-18" r="24" fill="${p.accent}" fill-opacity="0.4" stroke="${p.inner}" stroke-width="2.5"/>
        <path d="M-28,22 Q0,-12 28,22 Q0,42 -28,22 Z" fill="${p.inner}" fill-opacity="0.85"/>
        <path d="M-40,28 Q-15,2 0,28 Q15,2 40,28 Q0,48 -40,28 Z" fill="${p.leaf}" fill-opacity="0.85"/>
        <circle cx="0" cy="-18" r="6" fill="${p.inner}"/>
      </g>`;
  } else if (angleIndex === 2) {
    // Angle 2: Open 6-Petal Hexagonal Box Revealing Đông Hồ Folk Artwork
    centerScene = `
      <g transform="translate(400, 300)">
        <!-- 6 Open Petals -->
        <polygon points="0,-220 55,-125 -55,-125" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <polygon points="190,-110 135,-15 80,-110" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <polygon points="190,110 80,110 135,15" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <polygon points="0,220 -55,125 55,125" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <polygon points="-190,110 -135,15 -80,110" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <polygon points="-190,-110 -80,-110 -135,-15" fill="${p.paper}" stroke="${p.accent}" stroke-width="3"/>
        <!-- Inner Hexagonal Tray -->
        <polygon points="0,-135 117,-68 117,68 0,135 -117,68 -117,-68" fill="${p.paper}" stroke="${p.inner}" stroke-width="4"/>
        <!-- 6 Compartments of Artisanal Nem & Ceramic Dipping Bowl -->
        <line x1="0" y1="-135" x2="0" y2="135" stroke="${p.accent}" stroke-width="2"/>
        <line x1="-117" y1="-68" x2="117" y2="68" stroke="${p.accent}" stroke-width="2"/>
        <line x1="-117" y1="68" x2="117" y2="-68" stroke="${p.accent}" stroke-width="2"/>
        <circle cx="0" cy="0" r="46" fill="${p.inner}" stroke="${p.accent}" stroke-width="4"/>
        <circle cx="0" cy="0" r="32" fill="${p.accent}" fill-opacity="0.9"/>
        <circle cx="0" cy="0" r="14" fill="${p.inner}"/>
      </g>`;
  } else if (angleIndex === 3) {
    // Angle 3: Artisanal Nem Kinh Bắc, Golden Roasted Rice Powder (Thính Gạo) & Banana Leaves
    centerScene = `
      <g transform="translate(400, 300)">
        <!-- Bamboo Platter (Mẹt tre) -->
        <circle cx="0" cy="0" r="185" fill="#D9B882" stroke="${p.accent}" stroke-width="8"/>
        <circle cx="0" cy="0" r="168" fill="#EED7B0" stroke="#8C5828" stroke-width="2" stroke-dasharray="10 5"/>
        <!-- Fresh Banana Leaf Bed -->
        <path d="M-135,-45 Q0,-155 135,-45 Q155,65 0,135 Q-155,65 -135,-45 Z" fill="#295233" stroke="#3F704B" stroke-width="3"/>
        <!-- Nem Bùi & Thính Gạo Golden Mound -->
        <circle cx="-48" cy="-20" r="64" fill="#E6B86A" stroke="#FFF5E4" stroke-width="3"/>
        <circle cx="-48" cy="-20" r="48" fill="#D49B4B"/>
        <!-- Ceramic Dipping Sauce Bowl -->
        <circle cx="68" cy="-32" r="42" fill="#FFF5E4" stroke="#1F3D2A" stroke-width="4"/>
        <circle cx="68" cy="-32" r="30" fill="#B01B1B"/>
        <circle cx="62" cy="-36" r="5" fill="#F3D27A"/>
        <circle cx="76" cy="-26" r="4" fill="#F3D27A"/>
        <!-- Fig Leaves (Lá sung) -->
        <path d="M-20,75 Q45,35 95,85 Q45,125 -20,75 Z" fill="#3B6E47" stroke="#FFF5E4" stroke-width="2"/>
      </g>`;
  } else if (angleIndex === 4) {
    // Angle 4: Close-up Shimmering Điệp Paper & Woodblock Print Craftsmanship
    centerScene = `
      <g transform="translate(400, 300)">
        <rect x="-210" y="-145" width="420" height="290" rx="18" fill="${p.paper}" stroke="${p.accent}" stroke-width="5"/>
        <rect x="-192" y="-128" width="384" height="256" rx="12" fill="none" stroke="${p.inner}" stroke-width="2"/>
        <!-- Woodblock Folk Pattern -->
        <circle cx="-95" cy="0" r="68" fill="${p.inner}" fill-opacity="0.12" stroke="${p.inner}" stroke-width="3"/>
        <circle cx="-95" cy="0" r="42" fill="${p.accent}" fill-opacity="0.45" stroke="${p.inner}" stroke-width="2"/>
        <circle cx="95" cy="0" r="68" fill="${p.leaf}" fill-opacity="0.12" stroke="${p.leaf}" stroke-width="3"/>
        <circle cx="95" cy="0" r="42" fill="${p.accent}" fill-opacity="0.45" stroke="${p.leaf}" stroke-width="2"/>
        <polygon points="0,-55 48,0 0,55 -48,0" fill="${p.inner}" stroke="${p.accent}" stroke-width="3"/>
        <circle cx="0" cy="0" r="14" fill="${p.paper}"/>
      </g>`;
  } else {
    // Angle 5: Complete Gift Presentation with Điệp Paper Bag & Seal
    centerScene = `
      <g transform="translate(400, 300)">
        <!-- Gift Bag on Left -->
        <rect x="-185" y="-110" width="165" height="220" rx="12" fill="${p.paper}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M-135,-110 C-135,-165 -70,-165 -70,-110" fill="none" stroke="${p.accent}" stroke-width="5"/>
        <rect x="-135" y="-50" width="65" height="82" rx="12" fill="none" stroke="${p.inner}" stroke-width="2.5"/>
        <!-- Hexagonal Gift Box on Right -->
        <polygon points="85,-125 190,-62 190,62 85,125 -20,62 -20,-62" fill="${p.inner}" stroke="${p.accent}" stroke-width="5"/>
        <polygon points="85,-95 165,-46 165,46 85,95 5,46 5,-46" fill="${p.paper}" stroke="${p.accent}" stroke-width="2"/>
        <circle cx="85" cy="0" r="28" fill="${p.inner}"/>
        <circle cx="85" cy="0" r="12" fill="${p.accent}"/>
      </g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.bg1}"/>
        <stop offset="100%" stop-color="${p.bg2}"/>
      </linearGradient>
      <pattern id="diep" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="1.3" fill="${p.accent}" fill-opacity="0.22"/>
        <circle cx="26" cy="22" r="1.6" fill="#FFF5E4" fill-opacity="0.14"/>
        <path d="M0 18 H36 M18 0 V36" stroke="${p.accent}" stroke-width="0.4" stroke-opacity="0.14"/>
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    <rect width="800" height="600" fill="url(#diep)"/>
    <!-- Double Đông Hồ Border -->
    <rect x="24" y="24" width="752" height="552" rx="18" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-opacity="0.7"/>
    <rect x="36" y="36" width="728" height="528" rx="12" fill="none" stroke="${p.paper}" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="8 5"/>
    <!-- Corner Ornaments -->
    <rect x="46" y="46" width="22" height="22" fill="none" stroke="${p.accent}" stroke-width="2"/>
    <rect x="732" y="46" width="22" height="22" fill="none" stroke="${p.accent}" stroke-width="2"/>
    <rect x="46" y="532" width="22" height="22" fill="none" stroke="${p.accent}" stroke-width="2"/>
    <rect x="732" y="532" width="22" height="22" fill="none" stroke="${p.accent}" stroke-width="2"/>
    ${centerScene}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  theme = 'hex-red',
  angleIndex = 1,
  className = '',
  ...rest
}) => {
  const fallbackDataUri = useMemo(
    () => createHeritageArtworkDataUri(theme, angleIndex, src),
    [theme, angleIndex, src]
  );

  const [hasError, setHasError] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!src || src.endsWith('.svg') && src.includes('/products/')) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const cleanPath = src.startsWith('/') ? src : `/${src}`;
    return `${base}${cleanPath}`;
  }, [src]);

  const effectiveSrc = !resolvedSrc || hasError ? fallbackDataUri : resolvedSrc;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
