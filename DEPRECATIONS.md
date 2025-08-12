# Deprecations and Technical Debt

This document tracks items that were intentionally left for future cleanup and improvement.

## ESLint Warnings (Intentionally Left)

### TypeScript `any` Types

**Server (`apps/server/src/routes/`)**

- `stats.ts`: 5 warnings - MongoDB aggregation pipeline types
- `submit.ts`: 3 warnings - Express request/response types

**Web (`apps/web/src/`)**

- `GlassyBackground.tsx`: 2 warnings - Canvas context types
- `HomePage.tsx`: 4 warnings - Event handler types
- `ResultsPage.tsx`: 2 warnings - Animation frame types
- `apiClient.ts`: 2 warnings - Error handling types
- `viewTransitions.ts`: 2 warnings - Browser API types

**Shared (`packages/shared/src/`)**

- `types.ts`: 1 warning - Generic constraint type
- `validation.ts`: 1 warning - Zod schema type

**Rationale**: These `any` types are used in contexts where:

1. Browser APIs lack proper TypeScript definitions
2. Third-party libraries (MongoDB, Express) have complex types
3. Generic constraints require flexibility
4. Runtime validation is more important than compile-time types

## Unused Code (Moved to \_graveyard)

### Performance Functions

- `startTimer`, `endTimer`, `logMetric` in `apps/web/src/_graveyard/performance-unused.ts`
- **Reason**: May be useful for future debugging/monitoring

### Design Tokens

- `spacing`, `borderRadius`, `zIndex`, `animation`, `shadows`, `typography`, `breakpoints` in `apps/web/src/_graveyard/tokens-unused.ts`
- **Reason**: May be useful for future design system expansion

### Color Contrast Functions

- `getReadableTextColor`, `getTextShadowForContrast`, `decideHeroStyle` in `apps/web/src/lib/colorContrast.ts`
- **Reason**: These are the original implementations, kept as reference while lazy-loaded versions are used

## Shared Package Exports (False Positives)

The `packages/shared` exports show as unused in ts-prune due to path alias resolution:

- All exports are actually used via `@worldfeel/shared` imports
- These are false positives from the static analysis tool

## Next Tickets

### High Priority

1. **TypeScript Version**: Update to supported version (currently 5.9.2, supported <5.6.0)
2. **MongoDB Types**: Add proper type definitions for aggregation pipelines
3. **Express Types**: Improve request/response type definitions

### Medium Priority

4. **Browser API Types**: Add proper TypeScript definitions for canvas and animation APIs
5. **Error Handling**: Improve error type definitions in API client
6. **Event Handlers**: Add proper event type definitions

### Low Priority

7. **Design System**: Consider re-integrating unused design tokens if needed
8. **Performance Monitoring**: Consider re-integrating unused performance functions if needed
9. **Color Contrast**: Clean up duplicate color contrast implementations

## Bundle Size Improvements

**Achieved**: -2.0% raw size, -1.2% gzip size

- Removed unused devDependencies
- Moved unused functions to \_graveyard
- Fixed ESLint configuration

**Potential Future**: Additional 1-2% reduction by:

- Removing unused color contrast functions
- Optimizing shared package exports
- Tree-shaking improvements
