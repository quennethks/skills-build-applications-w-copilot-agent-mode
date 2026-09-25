import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

async function seedDatabase() {
  try {
    await connectToDatabase();

    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB is not connected; skipping database seed.');
      return;
    }

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      { name: 'Ava Thompson', email: 'ava@example.com', fitnessLevel: 'Advanced', team: 'Trail Blazers' },
      { name: 'Liam Patel', email: 'liam@example.com', fitnessLevel: 'Intermediate', team: 'Trail Blazers' },
      { name: 'Maya Chen', email: 'maya@example.com', fitnessLevel: 'Beginner', team: 'Peak Performers' }
    ]);

    await Team.insertMany([
      { name: 'Trail Blazers', sport: 'Running', members: users.slice(0, 2).map((user) => user.name) },
      { name: 'Peak Performers', sport: 'Cycling', members: [users[2].name] }
    ]);

    await Activity.insertMany([
      { userId: users[0]._id.toString(), type: 'Run', duration: 35, calories: 420, date: new Date('2026-09-25T08:00:00.000Z') },
      { userId: users[1]._id.toString(), type: 'Strength', duration: 45, calories: 350, date: new Date('2026-09-25T18:30:00.000Z') }
    ]);

    await LeaderboardEntry.insertMany([
      { userId: users[0]._id.toString(), name: users[0].name, score: 980, rank: 1 },
      { userId: users[1]._id.toString(), name: users[1].name, score: 870, rank: 2 }
    ]);

    await Workout.insertMany([
      { name: 'Cardio Blast', focus: 'Endurance', duration: 30, difficulty: 'Moderate' },
      { name: 'Core Circuit', focus: 'Strength', duration: 25, difficulty: 'Easy' }
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
