import { useState } from "react";
import axios from "axios";

/**
 * UserSelector - allows searching for a user by email and selecting them
 * for a role like 'host' or 'cohosts' in an event.
 */
export default function UserSelector({ type, max = 5, selectedUsers, setSelectedUsers, label }) {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 🔍 Search user by email
  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://schedulo-server-pfcu.onrender.com/users?email=${email}`);
      const user = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;

      if (user) {
        setResult(user);
        setError('');
      } else {
        setResult(null);
        setError('No user found.');
      }
    } catch {
      setResult(null);
      setError('Error finding user.');
    }
  };

  // ➕ Add selected user to state
  const handleAdd = () => {
    console.log('Button clicked')
    if (!result) return;

    if (type === 'host') {
      setSelectedUsers(result);
    } else {
      if (!selectedUsers.some(u => u._id === result._id) && selectedUsers.length < max) {
        setSelectedUsers(prev => [...prev, result]);
      }
    }

    setEmail('');
    setResult(null);
  };

  // ❌ Remove user from selection
  const handleRemove = (id) => {
    if (type === 'host') {
      setSelectedUsers(null);
    } else {
      setSelectedUsers(prev => prev.filter(u => u._id !== id));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="text-xl font-semibold pb-1 text-gray-600">{label}</label>

      {/* Search Box */}
      <div className="flex gap-2 w-[350px] md:w-[600px] lg:w-[800px] xl:w-[1000px] 2xl:w-[400px]">
        <input
          type="text"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered md:w-[500px] flex-1 bg-white ring-1 ring-gray-300 text-gray-600 focus:ring-1 focus:ring-gray-600"
        />
        <button type="button" onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* User Found */}
      {result && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mt-2 w-[350px]  2xl:w-[400px]">
          <div>
            <p className="font-medium">{result.username}</p>
            <p className="text-sm text-gray-500">{result.email}</p>
          </div>
          <button type="button" onClick={handleAdd} className="btn btn-md btn-outline text-white bg-blue-600">
            Add
          </button>
        </div>
      )}

      {/* Selected User(s) */}
      {type === 'host' && selectedUsers && (
        <div className="mt-3 2xl:w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1000px] space-y-2 ">
          <div className="flex justify-between items-center p-2 shadow-lg text-gray-600 font-semibold rounded">
            <span>{selectedUsers.username} ({selectedUsers.email})</span>
            <button type="button" onClick={() => handleRemove(selectedUsers._id)} className="btn btn-xs btn-error">
              Remove
            </button>
          </div>
        </div>
      )}

      {type === 'cohosts' && selectedUsers.length > 0 && (
        <div className="mt-3 2xl:w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1000px] space-y-2">
          {selectedUsers.map(user => (
            <div key={user._id} className="flex justify-between items-center p-2  text-gray-600 font-semibold rounded ">
              <span>{user.username} ({user.email})</span>
              <button type="button" onClick={() => handleRemove(user._id)} className="btn btn-xs btn-error">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
