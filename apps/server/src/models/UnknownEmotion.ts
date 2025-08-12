import mongoose, { Schema, Document } from 'mongoose';

interface UnknownEmotionDocument extends Document {
  word: string;
  count: number;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

const unknownEmotionSchema = new Schema<UnknownEmotionDocument>(
  {
    word: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    firstSeenAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
    lastSeenAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

unknownEmotionSchema.index({ word: 1 }, { unique: true });
unknownEmotionSchema.index({ lastSeenAt: -1 });

export const UnknownEmotion = mongoose.model<UnknownEmotionDocument>(
  'UnknownEmotion',
  unknownEmotionSchema
);
