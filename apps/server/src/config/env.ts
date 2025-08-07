import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  MONGODB_URI: z.string().url('Invalid MongoDB URI'),
  DB_NAME: z.string().default('worldfeeling'),
  WEB_ORIGIN: z.string().url('Invalid web origin URL'),
  DAY_SALT_SECRET: z.string().min(32, 'Day salt secret must be at least 32 characters'),
  ENABLE_IP_FALLBACK: z.coerce.boolean().default(false),
  IP_FALLBACK_URL: z.string().url().default('https://ipapi.co/json/'),
});

export type Environment = z.infer<typeof envSchema>;

function validateEnv(): Environment {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = validateEnv();

// Log startup configuration (without secrets)
if (env.NODE_ENV === 'development') {
  console.log('🔧 Server Configuration:');
  console.log(`  - Environment: ${env.NODE_ENV}`);
  console.log(`  - Port: ${env.PORT}`);
  console.log(`  - Database: ${env.DB_NAME}`);
  console.log(`  - Web Origin: ${env.WEB_ORIGIN}`);
  console.log(`  - IP Fallback: ${env.ENABLE_IP_FALLBACK ? 'Enabled' : 'Disabled'}`);
}
