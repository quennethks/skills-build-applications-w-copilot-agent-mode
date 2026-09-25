import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

// VITE_CODESPACE_NAME must be defined (e.g. in `.env.local`) when running inside a GitHub Codespace.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Fall back to localhost so the app never requests `https://undefined-8000...` when the var is unset.
const API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCollection(API_URL)
      .then((data) => {
        if (isMounted) setEntries(data);
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

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p className="text-danger">Error loading leaderboard: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id ?? entry._id ?? entry.name}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
