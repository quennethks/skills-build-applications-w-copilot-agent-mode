import { Schema, model, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  fitnessLevel: string;
  team?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    fitnessLevel: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    team: { type: String, trim: true }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
