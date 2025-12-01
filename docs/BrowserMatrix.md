# Browser Matrix

This document defines the supported browsers and devices for the Mercy Blade application.

## Supported Browsers

### Desktop

1. **Chrome (Latest)** - Primary target
   - Viewport: 1920x1080
   - Full feature support
   - Primary development browser

2. **Firefox (Latest)**
   - Viewport: 1920x1080
   - Full feature support
   - Check flexbox and grid compatibility

3. **Edge (Latest)**
   - Viewport: 1920x1080
   - Chromium-based, similar to Chrome
   - Full feature support

4. **Safari (macOS Latest)**
   - Viewport: 1440x900
   - Watch for CSS variable quirks
   - Test audio playback carefully

### Mobile

1. **Safari iOS (Latest)** - Primary mobile target
   - Viewport: 390x844 (iPhone 13)
   - Device Pixel Ratio: 3x
   - Watch for:
     - Flex gap support
     - CSS custom properties performance
     - Audio playback restrictions

2. **Safari iOS (Old - iOS 14+)**
   - Viewport: 375x667 (iPhone SE)
   - Device Pixel Ratio: 2x
   - Limited CSS gap support
   - Test graceful degradation

3. **Chrome Android (Latest)**
   - Viewport: 412x915 (Pixel 7)
   - Device Pixel Ratio: 2.625x
   - Primary Android target
   - Full feature support

### Tablets

1. **iPad (Safari Latest)**
   - Viewport: 768x1024
   - Device Pixel Ratio: 2x
   - Test landscape and portrait modes
   - Check split-view layouts

## Critical Features

All browsers must support:

- ✅ CSS Grid
- ✅ Flexbox with gap property
- ✅ CSS custom properties (variables)
- ✅ Intersection Observer
- ✅ ResizeObserver
- ✅ Audio API
- ✅ LocalStorage
- ✅ Fetch API
- ✅ Promises/async-await
- ✅ ES6+ features (arrow functions, destructuring, etc.)

## Known Issues

### Safari iOS Old (iOS 14)

- Limited CSS `gap` support in flex containers - use margin fallback
- CSS custom properties performance issues - avoid heavy nesting
- Buggy Intersection Observer in some cases - add polyfill

### Firefox Desktop

- Minor flexbox differences with `flex-shrink`
- Different default font rendering - test readability

## Test Priority

Test in this order for maximum coverage:

1. **Chrome Desktop** - Primary development
2. **Safari iOS Latest** - Primary mobile
3. **Chrome Android** - Secondary mobile
4. **Firefox Desktop** - Alternative desktop
5. **Safari iOS Old** - Legacy support
6. **Edge Desktop** - Additional coverage

## Device Simulation

Use the device presets defined in `src/simulator/device/DevicePresets.ts`:

- `iphone_se` - Worst-case mobile viewport
- `iphone_13` - Standard modern iPhone
- `ipad` - Tablet viewport
- `android_small` - Small Android phone
- `android_large` - Large Android phone
- `low_end_laptop` - Old laptop with slow CPU
- `old_desktop` - Legacy desktop system

## Browser Matrix Configuration

See `config/browserMatrix.json` for detailed browser configurations used in automated testing.

## Testing Strategy

1. **Local Development**: Chrome Desktop
2. **Manual Testing**: Safari iOS + Chrome Android
3. **Automated Testing**: All browsers in matrix via Playwright
4. **Performance Testing**: Low-end devices (android_small, low_end_laptop)
5. **Accessibility Testing**: All browsers with screen readers

## Unsupported Browsers

The following browsers are NOT officially supported:

- Internet Explorer (any version)
- Safari < iOS 14
- Chrome Android < version 90
- Old Android browsers (pre-Chrome)

Users on these browsers will see a warning message encouraging them to upgrade.
