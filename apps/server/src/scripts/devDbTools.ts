import { connectDatabase, mongoose } from '../config/database.js';
import { Submission } from '../models/Submission.js';
import { EmotionColorMap } from '@worldfeel/shared';
import { v4 as uuidv4 } from 'uuid';
import { hashIp } from '../utils/crypto.js';
import { env } from '../config/env.js';

function getRandomArrayItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function randomIp(): string {
  return [
    Math.floor(Math.random() * 223) + 1,
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ].join('.');
}

async function clearSubmissions(): Promise<number> {
  const result = await Submission.deleteMany({}).exec();
  return result.deletedCount || 0;
}

async function seedSubmissions(count: number): Promise<number> {
  const emotionKeys = Array.from(EmotionColorMap.keys());
  const now = Date.now();
  const docs = Array.from({ length: count }).map(() => {
    const word = getRandomArrayItem(emotionKeys);
    const createdAt = new Date(
      now - Math.floor(Math.random() * 24 * 60 * 60 * 1000)
    );
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const deviceId = uuidv4();
    const ipHash = hashIp(randomIp());
    return { word, ipHash, deviceId, createdAt, expiresAt };
  });
  const inserted = await Submission.insertMany(docs, { ordered: false });
  return inserted.length;
}

async function main(): Promise<void> {
  const action = process.argv[2];
  const arg3 = process.argv[3];
  const isYes =
    arg3 === '--yes' ||
    process.argv.includes('--yes') ||
    process.env.CONFIRM === 'YES';
  const count =
    Number(arg3) && !Number.isNaN(Number(arg3))
      ? Number(arg3)
      : Number(process.argv[4]) || 20;

  if (!action || !['clear', 'seed'].includes(action)) {
    console.log(
      'Usage: tsx src/scripts/devDbTools.ts <clear|seed> [count] [--yes]'
    );
    process.exit(1);
  }

  // Never run these tools in production
  if (env.NODE_ENV === 'production') {
    console.error('Refusing to run devDbTools in production environment.');
    process.exit(1);
  }

  await connectDatabase();

  try {
    if (action === 'clear') {
      if (!isYes) {
        console.error('Refusing to clear DB without --yes (or CONFIRM=YES).');
        process.exit(1);
      }
      const deleted = await clearSubmissions();
      console.log(`Cleared submissions: ${deleted}`);
    } else if (action === 'seed') {
      const toInsert = Number.isFinite(count) ? count : 20;
      const inserted = await seedSubmissions(toInsert);
      console.log(`Seeded submissions: ${inserted}`);
    }
  } catch (error) {
    console.error('devDbTools error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
