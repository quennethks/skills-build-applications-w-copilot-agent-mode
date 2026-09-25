import { Schema, model, type Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  sport: string;
  members: string[];
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    members: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const Team = model<ITeam>('Team', teamSchema);
