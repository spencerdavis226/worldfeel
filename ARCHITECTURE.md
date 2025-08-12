# Architecture Guide

## Folder Structure

```
src/
├── app/              # App entry, routing, layout
├── features/         # Domain features (pages)
├── components/       # Reusable UI components
├── lib/             # Utilities, API clients, helpers
├── hooks/           # Shared React hooks
├── types/           # TypeScript definitions
├── styles/          # Global styles and tokens
└── _graveyard/      # Deprecated code preservation
```

## Path Aliases

| Alias           | Path               | Purpose                |
| --------------- | ------------------ | ---------------------- |
| `@app/*`        | `src/app/*`        | App-level concerns     |
| `@features/*`   | `src/features/*`   | Page components        |
| `@components/*` | `src/components/*` | Reusable UI            |
| `@lib/*`        | `src/lib/*`        | Utilities and services |
| `@hooks/*`      | `src/hooks/*`      | Custom React hooks     |
| `@types/*`      | `src/types/*`      | TypeScript types       |
| `@styles/*`     | `src/styles/*`     | Global styles          |

### Import Rules

- Use aliases for cross-directory imports
- Use relative paths within same feature
- Group imports: external → aliased → relative → types
- Import types explicitly with `import type`

## File Naming Conventions

| Type       | Convention          | Example                   |
| ---------- | ------------------- | ------------------------- |
| Components | PascalCase          | `GlassyBackground.tsx`    |
| Hooks      | camelCase + `use`   | `useEmotionBackground.ts` |
| Utilities  | camelCase           | `apiClient.ts`            |
| Types      | camelCase           | `stats.ts`                |
| Pages      | PascalCase + `Page` | `HomePage.tsx`            |

## Component vs Feature Placement

### Components (`src/components/`)

- Reusable across multiple features
- Generic UI building blocks
- No business logic
- Examples: `GlassyBackground`, `AnimatedValue`, `StatsPanel`

### Features (`src/features/`)

- Page-level components
- Feature-specific logic
- Business domain concerns
- Examples: `HomePage`, `ResultsPage`, `AboutPage`

## Design Tokens Usage

### Token System (`src/lib/tokens.ts`)

- Centralized design values
- Consistent spacing, colors, animations
- Type-safe token access
- Apple-like margins and spacing

### Available Tokens

- `spacing`: Rem-based spacing units
- `borderRadius`: Border radius values
- `glass`: Glass effect properties
- `animation`: Duration constants
- `shadows`: Shadow definitions
- `typography`: Font sizes and line heights

### Usage Pattern

```typescript
import { spacing, glass } from '@lib/tokens';

// Use in components
style={{ padding: spacing.lg, backdropFilter: glass.blurMd }}
```

## Graveyard System Rules

### Purpose

- Preserve deprecated code for reference
- Prevent accidental deletion of potentially useful code
- Document removal decisions

### Location

- `src/_graveyard/` directory
- Separate files for different types of deprecated code
- README documenting what was removed and why

### When to Use

- Removing unused styles or components
- Deprecating features before deletion
- Preserving code for potential future use
- Documenting architectural decisions

### Restoration Process

1. Move code from graveyard to appropriate location
2. Update imports and references
3. Ensure code is actually used
4. Remove from graveyard
5. Update graveyard documentation

### Current Contents

- Unused CSS classes and animations
- Deprecated glass component styles
- Unused Tailwind extensions
- Legacy design tokens
