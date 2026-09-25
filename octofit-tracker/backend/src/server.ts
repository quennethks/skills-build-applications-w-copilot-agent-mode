import express, { type Request, type Response } from 'express';
import { connectToDatabase, getApiBaseUrl } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
const port = Number(process.env.PORT) || 8000;
const baseUrl = getApiBaseUrl();

const fallbackData: Record<string, any[]> = {
  users: [
    { id: 'user-1', name: 'Ava Thompson', email: 'ava@example.com', fitnessLevel: 'Advanced' },
    { id: 'user-2', name: 'Liam Patel', email: 'liam@example.com', fitnessLevel: 'Intermediate' }
  ],
  teams: [
    { id: 'team-1', name: 'Trail Blazers', sport: 'Running', members: ['Ava Thompson', 'Liam Patel'] },
    { id: 'team-2', name: 'Peak Performers', sport: 'Cycling', members: ['Maya Chen'] }
  ],
  activities: [
    { id: 'activity-1', userId: 'user-1', type: 'Run', duration: 35, calories: 420, date: '2026-09-25T08:00:00.000Z' },
    { id: 'activity-2', userId: 'user-2', type: 'Strength', duration: 45, calories: 350, date: '2026-09-25T18:30:00.000Z' }
  ],
  leaderboard: [
    { id: 'leaderboard-1', userId: 'user-1', name: 'Ava Thompson', score: 980, rank: 1 },
    { id: 'leaderboard-2', userId: 'user-2', name: 'Liam Patel', score: 870, rank: 2 }
  ],
  workouts: [
    { id: 'workout-1', name: 'Cardio Blast', focus: 'Endurance', duration: 30, difficulty: 'Moderate' },
    { id: 'workout-2', name: 'Core Circuit', focus: 'Strength', duration: 25, difficulty: 'Easy' }
  ]
};

async function fetchCollection<T>(model: any, fallback: T[]): Promise<T[]> {
  try {
    const documents = await model.find({}).lean();

    if (Array.isArray(documents) && documents.length > 0) {
      return documents as T[];
    }
  } catch (error) {
    console.warn(`Using fallback data for ${model.modelName ?? 'collection'}.`, error);
  }

  return fallback;
}

app.use(express.json());

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok', baseUrl });
});

app.get('/api', (_request: Request, response: Response) => {
  response.json({
    name: 'OctoFit Tracker API',
    baseUrl,
    routes: ['/api/users', '/api/teams', '/api/activities', '/api/leaderboard', '/api/workouts']
  });
});

app.get(['/api/users', '/api/users/'], async (_request: Request, response: Response) => {
  const users = await fetchCollection(User, fallbackData.users as Array<Record<string, unknown>>);
  response.json(users);
});

app.post(['/api/users', '/api/users/'], async (request: Request, response: Response) => {
  const payload = request.body ?? {};

  try {
    const user = await User.create(payload);
    response.status(201).json(user);
    return;
  } catch (error) {
    console.warn('Unable to persist user; using fallback in-memory storage.', error);
  }

  const fallbackUser = {
    id: `user-${Date.now()}`,
    ...payload,
    fitnessLevel: payload.fitnessLevel ?? 'Beginner'
  };

  fallbackData.users.push(fallbackUser as never);
  response.status(201).json(fallbackUser);
});

app.get(['/api/teams', '/api/teams/'], async (_request: Request, response: Response) => {
  const teams = await fetchCollection(Team, fallbackData.teams as Array<Record<string, unknown>>);
  response.json(teams);
});

app.post(['/api/teams', '/api/teams/'], async (request: Request, response: Response) => {
  const payload = request.body ?? {};

  try {
    const team = await Team.create(payload);
    response.status(201).json(team);
    return;
  } catch (error) {
    console.warn('Unable to persist team; using fallback in-memory storage.', error);
  }

  const fallbackTeam = {
    id: `team-${Date.now()}`,
    ...payload
  };

  fallbackData.teams.push(fallbackTeam as never);
  response.status(201).json(fallbackTeam);
});

app.get(['/api/activities', '/api/activities/'], async (_request: Request, response: Response) => {
  const activities = await fetchCollection(Activity, fallbackData.activities as Array<Record<string, unknown>>);
  response.json(activities);
});

app.post(['/api/activities', '/api/activities/'], async (request: Request, response: Response) => {
  const payload = request.body ?? {};

  try {
    const activity = await Activity.create(payload);
    response.status(201).json(activity);
    return;
  } catch (error) {
    console.warn('Unable to persist activity; using fallback in-memory storage.', error);
  }

  const fallbackActivity = {
    id: `activity-${Date.now()}`,
    ...payload,
    date: payload.date ?? new Date().toISOString()
  };

  fallbackData.activities.push(fallbackActivity as never);
  response.status(201).json(fallbackActivity);
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_request: Request, response: Response) => {
  const leaderboard = await fetchCollection(LeaderboardEntry, fallbackData.leaderboard as Array<Record<string, unknown>>);
  response.json(leaderboard);
});

app.post(['/api/leaderboard', '/api/leaderboard/'], async (request: Request, response: Response) => {
  const payload = request.body ?? {};

  try {
    const entry = await LeaderboardEntry.create(payload);
    response.status(201).json(entry);
    return;
  } catch (error) {
    console.warn('Unable to persist leaderboard entry; using fallback in-memory storage.', error);
  }

  const fallbackEntry = {
    id: `leaderboard-${Date.now()}`,
    ...payload
  };

  fallbackData.leaderboard.push(fallbackEntry as never);
  response.status(201).json(fallbackEntry);
});

app.get(['/api/workouts', '/api/workouts/'], async (_request: Request, response: Response) => {
  const workouts = await fetchCollection(Workout, fallbackData.workouts as Array<Record<string, unknown>>);
  response.json(workouts);
});

app.post(['/api/workouts', '/api/workouts/'], async (request: Request, response: Response) => {
  const payload = request.body ?? {};

  try {
    const workout = await Workout.create(payload);
    response.status(201).json(workout);
    return;
  } catch (error) {
    console.warn('Unable to persist workout; using fallback in-memory storage.', error);
  }

  const fallbackWorkout = {
    id: `workout-${Date.now()}`,
    ...payload
  };

  fallbackData.workouts.push(fallbackWorkout as never);
  response.status(201).json(fallbackWorkout);
});

app.use((_request: Request, response: Response) => {
  response.status(404).json({ message: 'Route not found' });
});

if (require.main === module) {
  void connectToDatabase();

  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`Base URL: ${baseUrl}`);
  });
}

export { app, baseUrl, port };
export default app;
