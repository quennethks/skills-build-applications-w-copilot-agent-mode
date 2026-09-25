import { Schema, model, type Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type: string;
  duration: number;
  calories: number;
  date: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    calories: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Activity = model<IActivity>('Activity', activitySchema);
