# Tahajjud Timer

A React-based web application that calculates and displays optimal Tahajjud prayer times based on Islamic lunar calculations. The app automatically detects user location and provides real-time countdowns for the blessed last third of the night.

## Key Technical Features

The application demonstrates several advanced web development patterns:

- **[Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)** integration with graceful fallback handling for location access denial
- **[Framer Motion](https://www.framer.com/motion/)** animations including staggered entrance effects, continuous rotations, and state-based transitions
- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)** for dynamic theming with HSL color space calculations
- **[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)**-style animations using Framer Motion's viewport detection
- **[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)**-compatible time calculations that handle timezone edge cases
- **[CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)** for glassmorphism effects on prayer time cards
- **[SVG Path Animation](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)** for the circular countdown progress indicator

## Notable Libraries and Technologies

- **[Radix UI](https://www.radix-ui.com/)** - Headless component primitives for dialogs, tooltips, and form controls
- **[Class Variance Authority](https://cva.style/docs)** - Type-safe component variant management
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Intelligent Tailwind class conflict resolution
- **[Lucide React](https://lucide.dev/)** - Feather-inspired icon library with tree-shaking support
- **[AlAdhan API](https://aladhan.com/prayer-times-api)** - Islamic prayer time calculations with multiple jurisprudence methods
- **[BigDataCloud Geocoding API](https://www.bigdatacloud.com/)** - Reverse geocoding for location name resolution

## Project Structure

```
src/
├── components/
│   └── ui/
├── services/
├── utils/
├── types/
└── lib/
dist/
```

- **`src/components/ui/`** - Reusable UI primitives built on Radix with Tailwind styling
- **`src/services/`** - External API integration layers with error handling and caching
- **`src/utils/`** - Pure functions for Islamic time calculations and date manipulation
- **`src/types/`** - TypeScript interfaces for prayer times, location data, and countdown states
- **`src/lib/`** - Utility functions including the `cn()` helper for conditional class merging

The [`src/utils/timeCalculations.ts`](src/utils/timeCalculations.ts) file contains the core Islamic jurisprudence logic for calculating the last third of the night. The [`src/services/prayerTimeService.ts`](src/services/prayerTimeService.ts) handles API integration with proper error boundaries and timeout handling.

The component architecture in [`src/components/`](src/components/) follows a composition pattern where each prayer time card, countdown timer, and location display is an isolated, testable unit with its own animation lifecycle.