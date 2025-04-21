import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Search as SearchIcon, X } from "lucide-react";
import api from "../services/api";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Search users from backend with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        searchUsers(searchQuery);
      } else {
        setUsers([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const searchUsers = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await api.get(
        `/v1/user/search-users?q=${encodeURIComponent(query)}`
      );
      console.log(response);
      const data = response.data;
      setUsers(data);
      setShowResults(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setUsers([]);
    setShowResults(false);
  };

  // Navigate to user profile when a user is clicked
  const handleUserClick = (user) => {
    navigate(`/profile/${user.username}`, { state: { user } });
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto py-4 px-4">
        {/* Search Header */}
        <div className="text-xl font-semibold mb-6 text-center">Search</div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-100 w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="bg-white rounded-md shadow">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            ) : users?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <img
                      src={user?.profilePictureUrl || "/api/placeholder/50/50"}
                      alt={user?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-gray-500 text-sm">{user?.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Empty state when no search is active */}
        {!showResults && !searchQuery && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <SearchIcon className="h-12 w-12 mb-4" />
            <p>Search for users</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
