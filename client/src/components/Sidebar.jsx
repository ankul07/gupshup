import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { logoutPostState } from "../redux/post/postSlice";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, success, user } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Handle logout success
    if (isLoggingOut && success) {
      toast.success(message || "Logged out successfully!");
      dispatch(logoutPostState());
      navigate("/login");
      setIsLoggingOut(false);
    }

    // Handle logout error
    if (isLoggingOut && error) {
      toast.error(error || "Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  }, [success, error, message, isLoggingOut, navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logout());
  };

  const navigation = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    // { icon: Compass, label: "Explore", path: "/explore" },
    // { icon: Film, label: "Reels", path: "/reels" },
    // { icon: MessageCircle, label: "Messages", path: "/messages" },
    // { icon: Heart, label: "Notifications", path: "/notifications" },
    { icon: PlusSquare, label: "Create", path: "/create" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="p-4">
          <div className="py-6 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              GupShup
            </h1>
          </div>

          <div className="flex flex-col space-y-1 flex-1">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                Icon={item.icon}
                label={item.label}
                path={item.path}
              />
            ))}

            <NavItem
              path={`/profile/${user?.username}`}
              label="Profile"
              customIcon={
                <img
                  className="h-6 w-6 rounded-full"
                  src={user?.profilePictureUrl}
                  alt="user-image"
                />
              }
            />

            <div className="mt-auto pt-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-4 p-3 rounded-lg transition-colors w-full text-left hover:bg-gray-50"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <div className="flex justify-around items-center h-14">
          <NavLink to="/" className="hover:text-purple-600">
            <Home className="h-6 w-6" />
          </NavLink>
          <NavLink to="/search" className="hover:text-purple-600">
            <Search className="h-6 w-6" />
          </NavLink>
          <NavLink to="/create" className="hover:text-purple-600">
            <PlusSquare className="h-6 w-6" />
          </NavLink>
          {/* <NavLink to="/reels" className="hover:text-purple-600">
            <Film className="h-6 w-6" />
          </NavLink> */}
          <NavLink
            to={`/profile/${user?.username}`}
            className="hover:text-purple-600"
          >
            <img
              className="h-6 w-6 rounded-full "
              src={user?.profilePictureUrl}
              alt="user-image"
            />
          </NavLink>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ Icon, label, customIcon, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center space-x-4 p-3 rounded-lg transition-colors ${
        isActive
          ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 font-medium"
          : "hover:bg-gray-50"
      }`
    }
  >
    {customIcon ? customIcon : Icon && <Icon className="h-6 w-6" />}
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default Sidebar;
