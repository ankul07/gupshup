// File: src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedUserProfile,
  logout,
  updateProfileImage,
} from "../redux/auth/authSlice";
import { getSelectedUserPost, logoutPostState } from "../redux/post/postSlice";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileContent from "../components/profile/ProfileContent";
import SideMenu from "../components/profile/SideMenu";
import PostDetailModal from "../components/profile/PostDetailModal";
import EditProfileModal from "../components/profile/EditProfileModal";
import FollowersModal from "../components/profile/FollowersModal";
import { Menu } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const { error, message, success, user, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { selecteduserPosts } = useSelector((state) => state.posts);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { username } = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleProfileUpdate = (updatedData) => {
    // console.log("Profile updated:", updatedData);
    // Handle the profile update logic here
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      dispatch(updateProfileImage(formData));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (isLoggingOut && success) {
      toast.success(message || "Logged out successfully!");
      dispatch(logoutPostState());
      navigate("/login");
      setIsLoggingOut(false);
    }

    if (isLoggingOut && error) {
      toast.error(error || "Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  }, [success, error, message, isLoggingOut, navigate, dispatch]);
  useEffect(() => {
    console.log("Dispatching getSelectedUserPost with username:", username);
    dispatch(getSelectedUserProfile(username));
    dispatch(getSelectedUserPost(username));
  }, [username, dispatch]);

  // Check if the profile being viewed is the logged-in user's profile
  useEffect(() => {
    if (user && selectedUser) {
      setIsOwnProfile(user.username === selectedUser.username);
    } else if (user && username) {
      setIsOwnProfile(user.username === username);
    }
  }, [user, selectedUser, username]);
  const profileData = isOwnProfile ? user : selectedUser;
  // console.log("Profile Data", profileData);

  if (!profileData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Mobile Menu Toggle Button - Only show on own profile */}

        <button
          className="absolute top-4 right-4 md:hidden bg-gray-100 p-2 rounded-full shadow"
          onClick={toggleMenu}
        >
          <Menu size={28} className="text-gray-700" />
        </button>

        <SideMenu
          isOpen={menuOpen}
          onClose={toggleMenu}
          onLogout={handleLogout}
        />

        {/* Profile Header - Pass necessary props including isOwnProfile flag */}
        <ProfileHeader
          user={profileData}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onImageChange={handleImageChange}
          onEditProfile={() => setIsEditModalOpen(true)}
          onShowFollowers={() => setShowFollowersModal(true)}
          onShowFollowing={() => setShowFollowingModal(true)}
          isOwnProfile={isOwnProfile}
          currentUser={user}
        />

        {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Profile Content based on active tab */}
        <ProfileContent
          activeTab={activeTab}
          user={profileData}
          onPostClick={handlePostClick}
          isOwnProfile={isOwnProfile}
        />

        {/* Modals */}
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            user={profileData}
            onClose={closePostModal}
            isOwnPost={isOwnProfile && selectedPost.userId === user.id}
          />
        )}

        {/* Edit Modal - Only for own profile */}
        {isOwnProfile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profileData={user}
            onUpdate={handleProfileUpdate}
          />
        )}

        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          type="Followers"
          users={profileData?.followers}
          currentUser={user}
        />

        <FollowersModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          type="Following"
          users={profileData?.following}
          currentUser={user}
        />
      </div>
    </Layout>
  );
};

export default Profile;
