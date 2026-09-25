import { Schema, model, type Document } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  focus: string;
  duration: number;
  difficulty: string;
}

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    difficulty: { type: String, required: true, enum: ['Easy', 'Moderate', 'Hard'] }
  },
  { timestamps: true }
);

export const Workout = model<IWorkout>('Workout', workoutSchema);
