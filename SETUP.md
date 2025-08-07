# Setup Guide

## Environment Variables

### Environment Configuration

Copy and customize the `.env.example` files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

## Development Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Create environment files:**

   ```bash
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```

   - Edit `apps/server/.env` and generate a secure DAY_SALT_SECRET (32+ characters)
   - Edit `apps/web/.env` if needed for different API endpoint

3. **Start MongoDB:**

   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas cloud database
   ```

4. **Start development servers:**

   ```bash
   pnpm dev
   ```

5. **Open browsers:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8080/api/health

## Production Deployment

### Server (Render.com)

1. Connect GitHub repository
2. Select "Web Service"
3. Build Command: `pnpm build --filter server`
4. Start Command: `pnpm --filter server start`
5. Add environment variables (use production values)

### Frontend (Vercel)

1. Connect GitHub repository
2. Framework: Vite
3. Build Command: `pnpm build --filter web`
4. Output Directory: `apps/web/dist`
5. Add `VITE_API_BASE=https://your-api-domain.com`

### Database (MongoDB Atlas)

1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Whitelist `0.0.0.0/0` for serverless deployments
4. Use connection string in `MONGODB_URI`
