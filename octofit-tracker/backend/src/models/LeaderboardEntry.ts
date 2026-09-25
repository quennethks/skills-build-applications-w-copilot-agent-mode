import { Schema, model, type Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: string;
  name: string;
  score: number;
  rank: number;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

export const LeaderboardEntry = model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
