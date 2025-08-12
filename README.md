# WorldFeel 🌍💭

A real-time MERN application that collects one-word emotions from around the world and visualizes global feelings with a Liquid Glass UI.

## Current Status

Production-ready application with auto-expiring data, privacy-first design, and modern React architecture. Collects daily emotions with 24-hour TTL, provides real-time stats, and features a responsive Liquid Glass interface.

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+
- MongoDB (local or Atlas)

### Installation

```bash
git clone <repo-url> worldfeel
cd worldfeel
npm install
```

### Environment Variables

```bash
# Server (.env)
MONGODB_URI=mongodb://localhost:27017/worldfeel
DAY_SALT_SECRET=your-32-char-secret
WEB_ORIGIN=http://localhost:3000

# Web (.env)
VITE_API_BASE=http://localhost:8080/api
```

### Run Commands

```bash
npm run dev          # Start both server and web
npm run build        # Build all packages
npm run start        # Start production server
```

## Scripts

| Script              | Purpose                       |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start development servers     |
| `npm run build`     | Build all packages            |
| `npm run lint`      | Lint all packages             |
| `npm run lint:fix`  | Fix linting issues            |
| `npm run typecheck` | TypeScript checking           |
| `npm run test`      | Run all tests                 |
| `npm run depcheck`  | Check for unused dependencies |
| `npm run tsprune`   | Find unused exports           |

## Project Layout

```
apps/
├── server/          # Express API with MongoDB
│   └── src/
│       ├── config/      # Environment and DB config
│       ├── models/      # Mongoose schemas
│       ├── routes/      # API endpoints
│       └── utils/       # Crypto, validation helpers
├── web/             # React frontend with Vite
│   └── src/
│       ├── app/         # App entry and routing
│       ├── components/  # Reusable UI components
│       ├── features/    # Page components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utilities and API clients
│       ├── types/       # TypeScript definitions
│       └── styles/      # Global styles
└── packages/
    └── shared/      # Shared types and validation
```

## Coding Standards

### Imports

- Use path aliases: `@components/`, `@lib/`, `@features/`
- Group: external → internal aliased → relative → types
- Import types explicitly: `import type { Stats }`

### Types

- Strict TypeScript with `noUnusedLocals`
- Zod schemas for runtime validation
- Shared types in `packages/shared`

### Naming

- Components: PascalCase (`GlassyBackground`)
- Hooks: camelCase with `use` prefix (`useStats`)
- Files: camelCase for utilities, PascalCase for components

## Run All Checks

```bash
npm run lint && npm run typecheck && npm run test && npm run depcheck && npm run tsprune
```

## Troubleshooting

**Port conflicts**: Change ports in `vite.config.ts` and server config
**MongoDB connection**: Check `MONGODB_URI` and network access
**Build errors**: Clear `node_modules` and reinstall dependencies
**Type errors**: Run `npm run typecheck` to see specific issues
**Lint errors**: Use `npm run lint:fix` for auto-fixable issues
**Missing dependencies**: Run `npm run depcheck` to identify unused packages
**Bundle size**: Check `npm run build:check` for size analysis
**Environment variables**: Ensure all required vars are set in `.env` files
**Hot reload not working**: Check file watchers and restart dev server
