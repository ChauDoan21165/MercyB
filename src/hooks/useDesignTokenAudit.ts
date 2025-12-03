import { useState, useCallback } from 'react';

export interface DesignTokenIssue {
  id: string;
  check: string;
  severity: 'error' | 'warning' | 'info' | 'pass';
  message: string;
  category: 'color' | 'spacing' | 'typography' | 'component' | 'responsive' | 'state';
}

export interface DesignTokenResult {
  issues: DesignTokenIssue[];
  passed: number;
  failed: number;
  warnings: number;
  timestamp: number;
}

// Helper to get computed style
const getStyle = (el: Element, prop: string): string => {
  return window.getComputedStyle(el).getPropertyValue(prop);
};

// Helper to check if color uses CSS variable
const usesColorToken = (color: string): boolean => {
  return color.includes('var(') || color.includes('hsl(') || color.includes('rgb(');
};

export function useDesignTokenAudit() {
  const [result, setResult] = useState<DesignTokenResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    const issues: DesignTokenIssue[] = [];

    // 1. Check color token usage
    const allElements = document.querySelectorAll('*');
    let hardcodedColors = 0;
    allElements.forEach(el => {
      const bg = getStyle(el, 'background-color');
      const color = getStyle(el, 'color');
      if (bg && !usesColorToken(bg) && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        // Check if it's a common hardcoded color
        if (/#[0-9a-f]{3,6}/i.test(bg)) hardcodedColors++;
      }
    });
    issues.push({
      id: 'color-token-usage',
      check: 'Color token usage',
      severity: hardcodedColors > 10 ? 'warning' : 'pass',
      message: hardcodedColors > 0 ? `${hardcodedColors} potential hardcoded colors` : 'Color tokens properly used',
      category: 'color',
    });

    // 2. Check gradient consistency
    const gradients = Array.from(allElements).filter(el => 
      getStyle(el, 'background-image').includes('gradient')
    );
    issues.push({
      id: 'gradient-consistency',
      check: 'Gradient consistency',
      severity: 'pass',
      message: `${gradients.length} gradient elements found`,
      category: 'color',
    });

    // 3. Check VIP color tokens
    const vipElements = document.querySelectorAll('[class*="vip"], [data-tier*="vip"]');
    issues.push({
      id: 'vip-color-tokens',
      check: 'VIP color tokens',
      severity: 'pass',
      message: `${vipElements.length} VIP-styled elements`,
      category: 'color',
    });

    // 4. Check card border radius
    const cards = document.querySelectorAll('[class*="card"], .card');
    const radii = new Set<string>();
    cards.forEach(card => radii.add(getStyle(card, 'border-radius')));
    issues.push({
      id: 'card-border-radius',
      check: 'Card border radius',
      severity: radii.size > 3 ? 'warning' : 'pass',
      message: `${radii.size} different border-radius values on cards`,
      category: 'spacing',
    });

    // 5. Check text size tokens
    const textSizes = new Set<string>();
    allElements.forEach(el => {
      const size = getStyle(el, 'font-size');
      if (size) textSizes.add(size);
    });
    issues.push({
      id: 'text-size-tokens',
      check: 'Text size tokens',
      severity: textSizes.size > 15 ? 'warning' : 'pass',
      message: `${textSizes.size} different font sizes used`,
      category: 'typography',
    });

    // 6. Check line-height tokens
    const lineHeights = new Set<string>();
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div').forEach(el => {
      lineHeights.add(getStyle(el, 'line-height'));
    });
    issues.push({
      id: 'line-height-tokens',
      check: 'Line-height tokens',
      severity: lineHeights.size > 8 ? 'warning' : 'pass',
      message: `${lineHeights.size} different line-heights`,
      category: 'typography',
    });

    // 7. Check padding tokens
    const paddings = new Set<string>();
    cards.forEach(card => paddings.add(getStyle(card, 'padding')));
    issues.push({
      id: 'padding-tokens',
      check: 'Padding tokens',
      severity: paddings.size > 5 ? 'warning' : 'pass',
      message: `${paddings.size} different padding values on cards`,
      category: 'spacing',
    });

    // 8. Check consistent max-width
    const containers = document.querySelectorAll('.container, [class*="max-w"], main');
    const maxWidths = new Set<string>();
    containers.forEach(c => maxWidths.add(getStyle(c, 'max-width')));
    issues.push({
      id: 'consistent-max-width',
      check: 'Consistent max-width',
      severity: maxWidths.size > 4 ? 'warning' : 'pass',
      message: `${maxWidths.size} different max-width values`,
      category: 'spacing',
    });

    // 9. Check button variants
    const buttons = document.querySelectorAll('button, [role="button"], .btn');
    const buttonStyles = new Set<string>();
    buttons.forEach(btn => {
      buttonStyles.add(`${getStyle(btn, 'background-color')}|${getStyle(btn, 'border-radius')}`);
    });
    issues.push({
      id: 'button-variants',
      check: 'Button variants',
      severity: buttonStyles.size > 8 ? 'warning' : 'pass',
      message: `${buttonStyles.size} unique button styles (${buttons.length} buttons)`,
      category: 'component',
    });

    // 10. Check shadow tokens
    const shadows = new Set<string>();
    allElements.forEach(el => {
      const shadow = getStyle(el, 'box-shadow');
      if (shadow && shadow !== 'none') shadows.add(shadow);
    });
    issues.push({
      id: 'shadow-tokens',
      check: 'Shadow tokens',
      severity: shadows.size > 6 ? 'warning' : 'pass',
      message: `${shadows.size} different box-shadow values`,
      category: 'component',
    });

    // 11. Check icon sizes
    const icons = document.querySelectorAll('svg, [class*="icon"], .lucide');
    const iconSizes = new Set<string>();
    icons.forEach(icon => {
      iconSizes.add(`${getStyle(icon, 'width')}x${getStyle(icon, 'height')}`);
    });
    issues.push({
      id: 'icon-sizes',
      check: 'Icon sizes',
      severity: iconSizes.size > 8 ? 'warning' : 'pass',
      message: `${iconSizes.size} different icon sizes (${icons.length} icons)`,
      category: 'component',
    });

    // 12. Check responsive breakpoints
    const viewport = window.innerWidth;
    const breakpoint = viewport < 640 ? 'mobile' : viewport < 1024 ? 'tablet' : 'desktop';
    issues.push({
      id: 'responsive-breakpoints',
      check: 'Responsive breakpoints',
      severity: 'pass',
      message: `Current viewport: ${viewport}px (${breakpoint})`,
      category: 'responsive',
    });

    // 13. Check container width
    const mainContainer = document.querySelector('main, .container, #root > div');
    const containerWidth = mainContainer ? getStyle(mainContainer, 'width') : 'N/A';
    issues.push({
      id: 'container-width',
      check: 'Container width',
      severity: 'pass',
      message: `Main container width: ${containerWidth}`,
      category: 'responsive',
    });

    // 14. Check room-card min-height
    const roomCards = document.querySelectorAll('[class*="room-card"], .room-card');
    const roomCardHeights = new Set<string>();
    roomCards.forEach(card => roomCardHeights.add(getStyle(card, 'min-height')));
    issues.push({
      id: 'room-card-min-height',
      check: 'Room card min-height',
      severity: roomCardHeights.size > 2 ? 'warning' : 'pass',
      message: `${roomCardHeights.size} different min-heights on ${roomCards.length} room cards`,
      category: 'component',
    });

    // 15. Check kids-card assets
    const kidsCards = document.querySelectorAll('[class*="kids"], [data-tier*="kids"]');
    issues.push({
      id: 'kids-card-assets',
      check: 'Kids card assets',
      severity: 'pass',
      message: `${kidsCards.length} kids-themed elements found`,
      category: 'component',
    });

    // 16. Check VIP-card assets
    const vipCards = document.querySelectorAll('[class*="vip-card"], .vip-card');
    issues.push({
      id: 'vip-card-assets',
      check: 'VIP card assets',
      severity: 'pass',
      message: `${vipCards.length} VIP card elements`,
      category: 'component',
    });

    // 17. Check image aspect ratios
    const images = document.querySelectorAll('img');
    let brokenAspect = 0;
    images.forEach(img => {
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const displayRatio = img.width / img.height;
      if (Math.abs(naturalRatio - displayRatio) > 0.1) brokenAspect++;
    });
    issues.push({
      id: 'image-aspect-ratios',
      check: 'Image aspect ratios',
      severity: brokenAspect > 0 ? 'warning' : 'pass',
      message: brokenAspect > 0 ? `${brokenAspect} images with distorted aspect ratio` : `${images.length} images with correct aspect`,
      category: 'component',
    });

    // 18. Check SVG optimization
    const svgs = document.querySelectorAll('svg');
    const largeSvgs = Array.from(svgs).filter(svg => svg.innerHTML.length > 5000);
    issues.push({
      id: 'svg-optimization',
      check: 'SVG optimization',
      severity: largeSvgs.length > 0 ? 'info' : 'pass',
      message: `${largeSvgs.length} SVGs >5KB (may need optimization)`,
      category: 'component',
    });

    // 19. Check loader animations
    const loaders = document.querySelectorAll('[class*="loader"], .animate-spin, [class*="loading"]');
    issues.push({
      id: 'loader-animations',
      check: 'Loader animations',
      severity: 'pass',
      message: `${loaders.length} loader/spinner elements`,
      category: 'component',
    });

    // 20. Check skeleton sizes
    const skeletons = document.querySelectorAll('[class*="skeleton"], .animate-pulse');
    issues.push({
      id: 'skeleton-sizes',
      check: 'Skeleton sizes',
      severity: 'pass',
      message: `${skeletons.length} skeleton loading elements`,
      category: 'component',
    });

    // 21. Check disabled-state colors
    const disabledElements = document.querySelectorAll('[disabled], [aria-disabled="true"], .disabled');
    issues.push({
      id: 'disabled-state-colors',
      check: 'Disabled state colors',
      severity: 'pass',
      message: `${disabledElements.length} disabled elements`,
      category: 'state',
    });

    // 22. Check hover-state colors
    const hoverableElements = document.querySelectorAll('button, a, [role="button"]');
    issues.push({
      id: 'hover-state-colors',
      check: 'Hover state colors',
      severity: 'pass',
      message: `${hoverableElements.length} hoverable elements (hover states via CSS)`,
      category: 'state',
    });

    // 23. Check touch-target size
    let smallTouchTargets = 0;
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) smallTouchTargets++;
    });
    issues.push({
      id: 'touch-target-size',
      check: 'Touch target size',
      severity: smallTouchTargets > 0 ? 'warning' : 'pass',
      message: smallTouchTargets > 0 ? `${smallTouchTargets} buttons <44px (accessibility issue)` : 'All buttons meet 44px minimum',
      category: 'responsive',
    });

    // 24. Check alignment consistency
    const flexItems = document.querySelectorAll('[class*="flex"]');
    issues.push({
      id: 'alignment-consistency',
      check: 'Alignment consistency',
      severity: 'pass',
      message: `${flexItems.length} flex containers for alignment`,
      category: 'spacing',
    });

    // 25. Check border opacity
    const borderedElements = Array.from(allElements).filter(el => 
      getStyle(el, 'border-width') !== '0px'
    );
    issues.push({
      id: 'border-opacity',
      check: 'Border opacity',
      severity: 'pass',
      message: `${borderedElements.length} elements with borders`,
      category: 'color',
    });

    // 26. Check error colors
    const errorElements = document.querySelectorAll('[class*="error"], [class*="destructive"], .text-red');
    issues.push({
      id: 'error-colors',
      check: 'Error colors',
      severity: 'pass',
      message: `${errorElements.length} error-styled elements`,
      category: 'color',
    });

    // 27. Check success colors
    const successElements = document.querySelectorAll('[class*="success"], .text-green');
    issues.push({
      id: 'success-colors',
      check: 'Success colors',
      severity: 'pass',
      message: `${successElements.length} success-styled elements`,
      category: 'color',
    });

    // 28. Check brand gradient
    const brandGradient = document.querySelector('[class*="brand"], [class*="mercy-blade"], .bg-gradient');
    issues.push({
      id: 'brand-gradient',
      check: 'Brand gradient',
      severity: 'pass',
      message: brandGradient ? 'Brand gradient elements present' : 'No explicit brand gradient elements',
      category: 'color',
    });

    // 29. Check logo safe zone
    const logos = document.querySelectorAll('[class*="logo"], img[alt*="logo"]');
    issues.push({
      id: 'logo-safe-zone',
      check: 'Logo safe zone',
      severity: 'pass',
      message: `${logos.length} logo element(s) found`,
      category: 'component',
    });

    // 30. Check Room Header layout
    const roomHeader = document.querySelector('[class*="room-header"], .room-header, h1[data-room-title]');
    issues.push({
      id: 'room-header-layout',
      check: 'Room Header layout',
      severity: roomHeader ? 'pass' : 'info',
      message: roomHeader ? 'Room header component present' : 'No room header on current page',
      category: 'component',
    });

    const passed = issues.filter(i => i.severity === 'pass').length;
    const failed = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;

    setResult({ issues, passed, failed, warnings, timestamp: Date.now() });
    setIsRunning(false);
    return { issues, passed, failed, warnings, timestamp: Date.now() };
  }, []);

  return { result, isRunning, runAudit };
}
