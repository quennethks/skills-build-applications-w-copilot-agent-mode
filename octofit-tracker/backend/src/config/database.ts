import mongoose from 'mongoose';

export const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export const getApiBaseUrl = (): string => {
  const codespaceName = process.env.CODESPACE_NAME;

  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
};

export async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB is unavailable; continuing without the database connection.', error);
    return mongoose.connection;
  }
}

export default mongoose.connection;
