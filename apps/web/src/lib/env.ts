import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE: z
    .string()
    .url('Invalid API base URL')
    .default('http://localhost:8080'),
});

type Environment = z.infer<typeof envSchema>;

function validateEnv(): Environment {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    // Return defaults for development
    return {
      VITE_API_BASE: 'http://localhost:8080',
    };
  }
}

export const env = validateEnv();
