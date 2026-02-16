// src/pages/SearchPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data (replace with real API later)
const mockUsers = [
  {
    _id: '1',
    username: 'anjan_thimi',
    fullname: 'Anjan Shrestha',
    bio: 'Building cool stuff with MERN | Coffee addict ☕ | Nepal 🇳🇵',
    profilePicture: 'https://ui-avatars.com/api/?name=Anjan+Shrestha&background=0D8ABC&color=fff',
  },
  {
    _id: '2',
    username: 'sara_dev',
    fullname: 'Sara Gurung',
    bio: 'Frontend developer • React & Tailwind lover • Always learning',
    profilePicture: 'https://ui-avatars.com/api/?name=Sara+Gurung&background=FF6B6B&color=fff',
  },
  {
    _id: '3',
    username: 'rajesh_code',
    fullname: 'Rajesh Tamang',
    bio: 'Full-stack | Node.js | MongoDB | Open source contributor',
    profilePicture: '',
  },
  {
    _id: '4',
    username: 'priya_art',
    fullname: 'Priya Maharjan',
    bio: 'Digital artist • UI/UX enthusiast • Sharing my sketches 🎨',
    profilePicture: 'https://ui-avatars.com/api/?name=Priya+Maharjan&background=4ECDC4&color=fff',
  },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (query.length === 0) {
      setResults([]);
      return;
    }

    // Simple mock filter
    const filtered = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        (user.fullname && user.fullname.toLowerCase().includes(query))
    );

    setResults(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Search Users
        </h1>

        {/* Search Input */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search by username or full name..."
            value={searchQuery}
            onChange={handleSearch}
            autoFocus
            className="w-full px-5 py-4 pl-12 text-lg bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 rounded-full 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent shadow-sm transition-all duration-200"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Results / Messages */}
        <div className="space-y-4">
          {searchQuery.length > 0 && results.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
              No users found for "{searchQuery}"
            </p>
          )}

          {searchQuery.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
              Start typing to find users...
            </p>
          )}

          {/* User Cards */}
          {results.length > 0 && (
            <div className="grid gap-4">
              {results.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`} // or /users/${user.username}
                  className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 
                           rounded-xl border border-gray-200 dark:border-gray-700 
                           hover:border-blue-500 transition-all duration-200 
                           hover:shadow-md"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=User&background=random';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                    flex items-center justify-center text-white text-xl font-bold">
                        {user.fullname?.[0] || user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        @{user.username}
                      </h3>
                      {user.fullname && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {user.fullname}
                        </span>
                      )}
                    </div>

                    {user.bio && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;