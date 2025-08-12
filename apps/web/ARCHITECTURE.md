# Architecture Guide

This document explains the organization and conventions for the worldfeel.org web application.

## Directory Structure

```
src/
├── app/              # App entry, routing, layout
├── features/         # Domain features (each in its own folder)
├── components/       # Reusable UI building blocks
├── lib/             # Helpers, API clients, formatting, data utils
├── hooks/           # Shared React hooks
├── types/           # Shared TypeScript types and schemas
├── styles/          # Global styles and design tokens
└── test/            # Test helpers and integration tests
```

## Folder Purposes

### `app/` - Application Entry & Routing

- **Purpose**: App initialization, routing configuration, and layout components
- **Contains**: `App.tsx`, `main.tsx`, router setup
- **When to add**: Only for app-level concerns like routing, providers, or layout

### `features/` - Domain Features

- **Purpose**: Self-contained features that represent business domains
- **Contains**: Page components, feature-specific logic, and related utilities
- **When to add**: When implementing a new page or major feature
- **Examples**: `HomePage.tsx`, `ResultsPage.tsx`, `AboutPage.tsx`

### `components/` - Reusable UI Components

- **Purpose**: Generic, reusable UI building blocks
- **Contains**: Components that can be used across multiple features
- **When to add**: When creating a component that will be reused
- **Examples**: `GlassyBackground.tsx`, `AnimatedValue.tsx`, `StatsPanel.tsx`

### `lib/` - Utilities & Services

- **Purpose**: Helper functions, API clients, data processing, and business logic
- **Contains**: Pure functions, API clients, configuration, and utilities
- **When to add**: When creating utility functions or service classes
- **Examples**: `apiClient.ts`, `deviceId.ts`, `colorContrast.ts`

### `hooks/` - Shared React Hooks

- **Purpose**: Custom React hooks that can be used across components
- **Contains**: Stateful logic that can be shared between components
- **When to add**: When creating reusable stateful logic
- **Examples**: `useEmotionBackground.ts`, `useStats.ts`, `usePageTitle.ts`

### `types/` - Shared TypeScript Types

- **Purpose**: TypeScript type definitions and interfaces
- **Contains**: Types that are used across multiple features
- **When to add**: When creating types that will be shared
- **Examples**: API response types, shared interfaces, enums

### `styles/` - Global Styles

- **Purpose**: Global CSS, design tokens, and theme configuration
- **Contains**: Global styles, CSS variables, and design system tokens
- **When to add**: When adding global styles or design tokens

## Import Rules

### Path Aliases

Use these aliases for clean imports:

```typescript
// App-level imports
import { App } from '@app/App';

// Feature imports
import { HomePage } from '@features/HomePage';

// Component imports
import { GlassyBackground } from '@components/GlassyBackground';

// Utility imports
import { apiClient } from '@lib/apiClient';

// Hook imports
import { useStats } from '@hooks/useStats';

// Type imports
import type { Stats } from '@types/stats';

// Style imports
import '@styles/globals.css';
```

### Import Guidelines

1. **Use aliases over relative paths** when importing from different directories
2. **Use relative paths** only for imports within the same feature folder
3. **Import types explicitly** with `import type` when possible
4. **Group imports** in this order:
   - React and external libraries
   - Internal aliased imports
   - Relative imports
   - Type imports

### Example Import Structure

```typescript
// External libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal aliased imports
import { apiClient } from '@lib/apiClient';
import { GlassyBackground } from '@components/GlassyBackground';
import { useStats } from '@hooks/useStats';

// Relative imports (within same feature)
import { FeatureSpecificComponent } from './FeatureSpecificComponent';

// Type imports
import type { Stats, ApiResponse } from '@types/stats';
```

## When to Create a Feature

Create a new feature when:

- **New page/route** is needed
- **Major functionality** that spans multiple components
- **Business domain** that has its own state and logic
- **Complex user flow** that deserves its own organization

### Feature Structure

```
features/
├── NewFeature/
│   ├── NewFeaturePage.tsx      # Main page component
│   ├── NewFeatureForm.tsx      # Feature-specific components
│   ├── useNewFeature.ts        # Feature-specific hooks
│   └── types.ts               # Feature-specific types
```

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `GlassyBackground.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEmotionBackground.ts`)
- **Utilities**: camelCase (e.g., `apiClient.ts`, `deviceId.ts`)
- **Types**: camelCase (e.g., `stats.ts`, `api.ts`)

### Functions & Variables

- **Components**: PascalCase (e.g., `GlassyBackground`)
- **Hooks**: camelCase with `use` prefix (e.g., `useBackgroundColor`)
- **Utilities**: camelCase (e.g., `getDeviceId`, `apiClient`)

## Adding New Code

### 1. Identify the Purpose

- **UI Component** → `components/`
- **Page/Feature** → `features/`
- **Utility Function** → `lib/`
- **Custom Hook** → `hooks/`
- **Type Definition** → `types/`

### 2. Choose the Right Location

- **Reusable across features** → Shared folders (`components/`, `lib/`, `hooks/`)
- **Feature-specific** → Within the feature folder
- **App-level** → `app/`

### 3. Follow Import Patterns

- Use appropriate path aliases
- Import types explicitly
- Group imports logically

### 4. Update This Document

- Add new patterns or conventions here
- Update examples if needed

## Testing Strategy

- **Unit tests**: Co-located with components/utilities
- **Integration tests**: In `test/` directory
- **E2E tests**: Separate test suite

## Performance Considerations

- **Code splitting**: Features are lazy-loaded by default
- **Bundle size**: Keep shared utilities small and focused
- **Tree shaking**: Use named exports for better tree shaking
