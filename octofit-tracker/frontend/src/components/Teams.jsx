import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

// VITE_CODESPACE_NAME must be defined (e.g. in `.env.local`) when running inside a GitHub Codespace.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Fall back to localhost so the app never requests `https://undefined-8000...` when the var is unset.
const API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCollection(API_URL)
      .then((data) => {
        if (isMounted) setTeams(data);
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

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p className="text-danger">Error loading teams: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sport</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id ?? team._id ?? team.name}>
              <td>{team.name}</td>
              <td>{team.sport}</td>
              <td>{Array.isArray(team.members) ? team.members.join(', ') : team.members}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Teams;
