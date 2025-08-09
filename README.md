# How Is The World Feeling? 🌍💭

A beautiful, real-time MERN application that collects one-word emotions from around the world and visualizes global feelings with a stunning Liquid Glass UI.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)

## ✨ Features

- **One word per person per day** - Simple, focused emotional expression
- **Real-time global stats** - See how the world feels right now
- **Liquid Glass UI** - Modern, beautiful interface with frosted glass effects
- (Legacy) Location filtering removed
- **Auto-expiring data** - MongoDB TTL ensures data freshens every 24 hours
- **Privacy-first** - No IP storage, only hashed identifiers
- **Emotion-based colors** - Dynamic backgrounds based on dominant feelings
- **Mobile-friendly** - Responsive design that works everywhere

## 🏗️ Architecture

This is a monorepo built with npm workspaces:

```
worldfeel/
├── apps/
│   ├── server/     # Express.js API (Node.js + TypeScript)
│   └── web/        # React frontend (Vite + TailwindCSS)
├── packages/
│   └── shared/     # Shared types, validation, and utilities
└── package.json    # Root workspace config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm 9+** - Comes with Node.js 20+
- **MongoDB** - [Local install](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/atlas)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo-url> worldfeel
   cd worldfeel
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy and customize the example files
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```

   Edit the `.env` files with your actual values, especially generate a secure `DAY_SALT_SECRET`.

3. **Start development servers:**

   ```bash
   npm run dev
   ```

   This runs both the API server (`:8080`) and web app (`:3000`) concurrently.

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:8080/api/health

## 📁 Project Structure

### Shared Package (`packages/shared/`)

- **Types** - TypeScript interfaces for API and data models
- **Validation** - Zod schemas for request/response validation
- **Colors** - Emotion-to-color mapping with 150+ feelings
- **Utilities** - Common functions used by both frontend and backend

### Server (`apps/server/`)

```
src/
├── config/          # Environment and database configuration
├── models/          # Mongoose schemas with TTL indexes
├── routes/          # Express route handlers
├── utils/           # Crypto, profanity filter, helpers
└── index.ts         # Server entry point
```

### Web App (`apps/web/`)

```
src/
├── components/      # React UI components (Liquid Glass themed)
├── hooks/           # Custom React hooks for state management
├── pages/           # Route components
├── utils/           # API client, device management, geolocation
└── main.tsx         # React entry point
```

## 🔌 API Documentation

### Base URL

- Development: `http://localhost:8080/api`
- Production: `https://your-api-domain.com/api`

### Endpoints

#### `POST /submit`

Submit a daily emotion word.

**Request:**

```json
{
  "word": "happy",
  "deviceId": "uuid-v4-string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 1543,
    "top": { "word": "happy", "count": 234 },
    "top5": [
      { "word": "happy", "count": 234 },
      { "word": "tired", "count": 187 }
    ],
    "yourWord": {
      "word": "happy",
      "count": 234,
      "rank": 1,
      "percentile": 85
    },
    "colorHex": "#FFD166",
    "topPalette": ["#FFD166", "#FFA726", "#FF8C42"]
  },
  "message": "Thank you for sharing how you feel!",
  "canEdit": true,
  "editWindowMinutes": 5
}
```

#### `GET /stats`

Get current global emotion statistics.

**Query Parameters:**

- `yourWord` (optional) - Get rank info for specific word

**Response:** Same as POST /submit data field

#### `GET /color`

Get color mapping for any emotion word.

**Query Parameters:**

- `word` (required) - The emotion word

**Response:**

```json
{
  "success": true,
  "data": {
    "hex": "#FFD166",
    "shadeHex": "#CC9F3D"
  }
}
```

// GeoIP endpoint (legacy) removed

#### `POST /flag`

Report inappropriate content (no-op stub).

#### `GET /health`

Server health check.

## 🎨 UI Design System

The app uses a **Liquid Glass** design language with:

### Components

- **Glass Cards** - Frosted glass containers with subtle borders and shadows
- **Glass Buttons** - Interactive elements with hover states and inner highlights
- **Glass Inputs** - Form fields with backdrop blur and focus states
- **Glass Panels** - Content sections with enhanced transparency

### Color System

- **Emotion Mapping** - 150+ feelings mapped to accessible colors
- **Dynamic Backgrounds** - Subtle gradients that shift based on dominant emotion
- **HSL Fallbacks** - Generated colors for unknown words using stable hashing
- **WCAG Compliance** - Contrast ratios meet accessibility standards

### Animations

- **Smooth Transitions** - 200ms ease-out for all interactive states
- **Floating Elements** - Subtle particle animations in background
- **Gradient Shifts** - Slow background color transitions
- **Scale Transforms** - Button press feedback and hover effects

## 🗄️ Database Schema

### Submissions Collection

```javascript
{
  _id: ObjectId,
  word: String,           // lowercase, letters-only, max 20 chars
  ipHash: String,         // sha256(ip + daySalt), 64 chars
  deviceId: String,       // uuid v4, optional
  createdAt: Date,        // auto-generated
  expiresAt: Date         // createdAt + 24 hours
}
```

### Indexes

- `{ expiresAt: 1 }` - TTL index with `expireAfterSeconds: 0`
- `{ ipHash: 1, deviceId: 1 }` - Compound index for deduplication (sparse)
- `{ word: 1 }` - Query optimization
  // Location index removed (legacy)

## 🔒 Security & Privacy

### Privacy Measures

- **No IP Storage** - Only SHA256 hashes with daily salt rotation
- **Device ID Cookies** - Client-side UUID for duplicate prevention
- **Data Expiry** - Automatic cleanup after 24 hours via MongoDB TTL
  // Optional Geolocation (legacy) removed

### Security Features

- **Rate Limiting** - 60 requests/minute per IP
- **CORS Protection** - Locked to specified web origin
- **Input Validation** - Zod schemas on all endpoints
- **Helmet Security** - Standard security headers
- **Profanity Filter** - Basic word filtering (expandable)

### Edit Window

- **5-minute edit window** after initial submission
- **Same-day limit** - One emotion per person per day
- **Update capability** - Modify word within edit window

## 📱 Deployment

### Environment Setup

**Production Environment Setup:**

- Use secure MongoDB Atlas connection string in `MONGODB_URI`
- Generate a cryptographically secure `DAY_SALT_SECRET` (32+ characters)
- Set `WEB_ORIGIN` to your frontend domain
- Set `VITE_API_BASE` to your API domain

### Render.com Deployment

1. **Deploy Server:**
   - Connect your GitHub repo
   - Choose "Web Service"
   - Build command: `npm run build --workspace=apps/server`
   - Start command: `npm run start --workspace=apps/server`
   - Add environment variables from above

2. **Deploy Database:**
   - Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
   - Create cluster and get connection string
   - Add IP `0.0.0.0/0` to whitelist for Render

### Vercel Deployment

1. **Deploy Web App:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from web app directory
   cd apps/web
   vercel
   ```

2. **Configure Build:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add `VITE_API_BASE` environment variable

### Docker Support

Create `Dockerfile` in server directory:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start", "--workspace=apps/server"]
```

## 🛠️ Development

### Available Scripts

**Root:**

- `npm run dev` - Start both server and web in development
- `npm run build` - Build all packages for production
- `npm run lint` - Lint all packages
- `npm run typecheck` - TypeScript checking across all packages

### Dev-only database helpers

The following helpers are available only in non-production environments. They refuse to run with `NODE_ENV=production`.

- Clear all submissions (requires confirmation):

```bash
npm run db:clear
```

- Seed random submissions (default 20):

```bash
npm run db:seed
```

To seed a different count directly from the server workspace:

```bash
npm --workspace=apps/server run db:seed -- 50
```

**Server:**

- `npm run dev --workspace=apps/server` - Development server with hot reload
- `npm run build --workspace=apps/server` - Build TypeScript to JavaScript
- `npm run start --workspace=apps/server` - Start production server

**Web:**

- `npm run dev --workspace=apps/web` - Development server with HMR
- `npm run build --workspace=apps/web` - Build for production
- `npm run preview --workspace=apps/web` - Preview production build

### Code Quality

- **ESLint** - Consistent code style across packages
- **Prettier** - Automated code formatting
- **TypeScript** - Strict type checking with latest features
- **Zod** - Runtime validation matching TypeScript types

## 🧪 Testing

Basic test setup included:

**Server Tests:**

```bash
npm run test --workspace=apps/server
```

**Test Structure:**

- Unit tests for color mapping and validation
- API integration tests with Supertest
- MongoDB in-memory testing for models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run linting: `npm run lint`
5. Run type checking: `npm run typecheck`
6. Commit with conventional commits
7. Push and create a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

// Country State City (legacy) removed

- **MongoDB** - TTL collections for auto-expiring data
- **TailwindCSS** - Utility-first CSS framework
- **Zod** - TypeScript-first schema validation
- **React** - Modern UI library
- **Vite** - Fast development build tool

---

Made with ❤️ for understanding global emotions, one word at a time.
