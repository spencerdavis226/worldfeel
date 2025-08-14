# WorldFeel 🌍💭

A real-time emotion collection app that gathers one-word feelings from around the world and visualizes global sentiment with a beautiful glass-morphism interface.

## ✨ Features

- **Daily Emotion Collection**: Submit one word describing how you feel
- **Real-time Global Stats**: See what the world is feeling right now
- **Device-Specific Privacy**: Each device has its own submission cooldown (no cross-device lockouts)
- **Smart Device Identification**: Advanced fingerprinting ensures reliable device tracking
- **Auto-Expiring Data**: Submissions automatically expire after 24 hours
- **Responsive Glass UI**: Modern, Apple-inspired interface with liquid glass effects
- **Color-Coded Emotions**: Each emotion gets a unique color representation
- **Live Updates**: Real-time statistics with 15-second refresh intervals

## 🚀 Quick Start

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

### Environment Setup

Create environment files for both server and web apps:

```bash
# Server environment
cp apps/server/.env.example apps/server/.env

# Web environment
cp apps/web/.env.example apps/web/.env
```

Configure the environment variables:

```bash
# Server (.env)
MONGODB_URI=mongodb://localhost:27017/worldfeel
DAY_SALT_SECRET=your-32-character-secret-key
WEB_ORIGIN=http://localhost:3000
SUBMIT_COOLDOWN_SECONDS=3600  # 1 hour per device in production

# Web (.env)
VITE_API_BASE=http://localhost:8080/api
```

### Development

```bash
npm run dev          # Start both server and web apps
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api

## 📁 Project Structure

```
worldfeel/
├── apps/
│   ├── server/          # Express API with MongoDB
│   │   └── src/
│   │       ├── config/      # Environment and DB config
│   │       ├── models/      # Mongoose schemas
│   │       ├── routes/      # API endpoints
│   │       └── utils/       # Crypto, validation helpers
│   └── web/             # React frontend with Vite
│       └── src/
│           ├── app/         # App entry and routing
│           ├── components/  # Reusable UI components
│           ├── features/    # Page components
│           ├── hooks/       # Custom React hooks
│           ├── lib/         # Utilities and API clients
│           └── types/       # TypeScript definitions
└── packages/
    └── shared/          # Shared types and validation
```

## 🛠️ Available Scripts

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

## 🏗️ Architecture

### Frontend (React + Vite)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with custom glass-morphism effects
- **Routing**: React Router for SPA navigation
- **State Management**: React hooks and context
- **Device Identification**: Advanced fingerprinting with localStorage backup

### Backend (Express + MongoDB)

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, CORS, Helmet
- **Validation**: Zod schemas for runtime validation
- **Caching**: In-memory stats caching (5-second TTL)
- **Device Tracking**: Device-specific cooldown enforcement

### Shared Package

- **Types**: Common TypeScript interfaces
- **Validation**: Zod schemas for API validation
- **Utilities**: Shared helper functions

## 🔧 Development Guidelines

### Code Organization

- Use path aliases: `@components/`, `@lib/`, `@features/`
- Group imports: external → internal aliased → relative → types
- Import types explicitly: `import type { Stats }`

### Naming Conventions

- **Components**: PascalCase (`UniversalBackground`)
- **Hooks**: camelCase with `use` prefix (`useStats`)
- **Files**: camelCase for utilities, PascalCase for components

### TypeScript

- Strict TypeScript configuration
- Zod schemas for runtime validation
- Shared types in `packages/shared`

## 🚀 Deployment

### Frontend (Vercel)

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render/Railway)

- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Production Node.js

### Database

- MongoDB Atlas (recommended)
- Whitelist `0.0.0.0/0` for serverless deployments

## 🔍 API Endpoints

### Public API (Read-only)

- `GET /api/health` - Health check
- `GET /api/public/emotion-of-the-day` - Get current emotion and color of the day
- `GET /api/stats` - Get global statistics (supports `yourWord` and `deviceId` query params)
- `GET /api/color?word=<emotion>` - Get color hex for a specific emotion
- `GET /api/emotions/search?q=<query>&limit=<number>` - Search emotions with fuzzy matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all checks: `npm run lint && npm run typecheck && npm run test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
