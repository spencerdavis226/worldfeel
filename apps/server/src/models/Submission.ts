import mongoose, { Schema, Document } from 'mongoose';
import type { Submission as ISubmission } from '@worldfeel/shared';

export interface SubmissionDocument extends Omit<ISubmission, '_id'>, Document {}

const submissionSchema = new Schema<SubmissionDocument>({
  word: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 20,
    validate: {
      validator: (v: string) => /^[\p{L}]{1,20}$/u.test(v),
      message: 'Word must contain only letters and be 1-20 characters long'
    }
  },
  ipHash: {
    type: String,
    required: true,
    length: 64 // SHA256 hash length
  },
  deviceId: {
    type: String,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  }
}, {
  timestamps: false, // We handle createdAt manually
  versionKey: false
});

// TTL Index - MongoDB will automatically delete expired documents
submissionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for deduplication (sparse to allow multiple docs with same ipHash but different deviceId)
submissionSchema.index({ ipHash: 1, deviceId: 1 }, { sparse: true });

// Query optimization indexes
submissionSchema.index({ word: 1 });
submissionSchema.index({ createdAt: 1 });

// Ensure indexes are created
submissionSchema.set('autoIndex', true);

export const Submission = mongoose.model<SubmissionDocument>('Submission', submissionSchema);

// Initialize indexes on startup
export async function initializeIndexes(): Promise<void> {
  try {
    await Submission.createIndexes();
    console.log('📊 Submission indexes initialized');
  } catch (error) {
    console.error('❌ Failed to initialize indexes:', error);
    throw error;
  }
}
