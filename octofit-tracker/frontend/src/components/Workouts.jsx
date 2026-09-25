import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

// VITE_CODESPACE_NAME must be defined (e.g. in `.env.local`) when running inside a GitHub Codespace.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Fall back to localhost so the app never requests `https://undefined-8000...` when the var is unset.
const API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCollection(API_URL)
      .then((data) => {
        if (isMounted) setWorkouts(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p className="text-danger">Error loading workouts: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Focus</th>
            <th>Duration (min)</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout.id ?? workout._id ?? workout.name}>
              <td>{workout.name}</td>
              <td>{workout.focus}</td>
              <td>{workout.duration}</td>
              <td>{workout.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Workouts;
