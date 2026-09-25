import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

// VITE_CODESPACE_NAME must be defined (e.g. in `.env.local`) when running inside a GitHub Codespace.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Fall back to localhost so the app never requests `https://undefined-8000...` when the var is unset.
const API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCollection(API_URL)
      .then((data) => {
        if (isMounted) setUsers(data);
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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-danger">Error loading users: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Fitness Level</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id ?? user._id ?? user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.fitnessLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
