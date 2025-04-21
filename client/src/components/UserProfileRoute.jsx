import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProfilePage from "../../../ProfilePage";
import api from "../services/api";

const UserProfileRoute = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user data is passed through navigation state, use it
    if (location.state && location.state.user) {
      setUser(location.state.user);
      setLoading(false);
      return;
    }

    // Otherwise fetch user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/v1/user/profile/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return <ProfilePage user={user} />;
};

export default UserProfileRoute;
