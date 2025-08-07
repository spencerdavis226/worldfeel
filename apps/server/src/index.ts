import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { initializeIndexes } from './models/Submission.js';

async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize database indexes
    await initializeIndexes();

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`🌐 Environment: ${env.NODE_ENV}`);
      if (env.NODE_ENV === 'development') {
        console.log(`📍 API available at: http://localhost:${env.PORT}/api`);
        console.log(`💚 Health check: http://localhost:${env.PORT}/api/health`);
      }
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);

      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
