import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCollection('users')
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
