import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Bookmark,
  Tag,
  Menu,
  X,
  Settings,
  Info,
  HelpCircle,
  Save,
  Shield,
  LogOut,
  Camera,
  Heart,
  MessageCircle,
} from "lucide-react";
import Layout from "../components/Layout";
import EditProfileModal from "../components/EditProfileModal";
import FollowersModal from "../components/FollowersModal";
import { logout, updateProfileImage } from "../redux/auth/authSlice";
import SavedPostItem from "../components/SavedPostItem";
import { toast } from "react-toastify";
import { logoutPostState } from "../redux/post/postSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { error, message, success, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  // console.log(user);

  const handleProfileUpdate = (updatedData) => {
    console.log("Profile updated:", updatedData);
    // Handle the profile update logic here
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file); // name should match with backend
      dispatch(updateProfileImage(formData));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  const tabs = [
    { id: "posts", icon: Grid, label: "Posts" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    { id: "tagged", icon: Tag, label: "Tagged" },
  ];

  // Function to render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {user?.posts && user?.posts.length > 0 ? (
              user?.posts.map((post) => (
                <div
                  key={post._id}
                  className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <img
                    src={post.media?.imageUrl || "/api/placeholder/400/400"}
                    alt={post.caption || "Post image"}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with engagement stats on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-8 text-white">
                      <div className="flex items-center">
                        <Heart
                          size={20}
                          className="fill-white text-white mr-2"
                        />
                        <span className="text-lg font-bold">
                          {post.likes?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={20} className="text-white mr-2" />
                        <span className="text-lg font-bold">
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-xl mb-4">No posts yet</p>
                <p>When you share photos and videos, they'll appear here.</p>
              </div>
            )}
          </div>
        );
      case "saved":
        return (
          <>
            {user?.savedPosts && user?.savedPosts?.length > 0 ? (
              <div className="grid grid-cols-1 gap-1 md:gap-4">
                {user?.savedPosts.map((postId) => (
                  <SavedPostItem key={postId} postId={postId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-4">
                  Only you can see what you've saved
                </p>
                <p>When you save photos and videos, they'll appear here.</p>
              </div>
            )}
          </>
        );
      case "tagged":
        return (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-4">Photos of you</p>
            <p>When people tag you in photos, they'll appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

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

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Mobile Menu Icon */}
        <button
          className="absolute top-4 right-4 md:hidden bg-gray-100 p-2 rounded-full shadow"
          onClick={toggleMenu}
        >
          <Menu size={28} className="text-gray-700" />
        </button>

        {/* Enhanced Right Side Menu */}
        {menuOpen && (
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl flex flex-col z-50 border-l">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                  GupShup
                </h1>
                <button className="p-2" onClick={toggleMenu}>
                  <X size={28} className="text-gray-700" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* <NavLink
                to="/settings"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-500 text-lg"
              >
                <Settings size={24} /> Settings
              </NavLink>
              <NavLink
                to="/about"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-500 text-lg"
              >
                <Info size={24} /> About
              </NavLink>
              <NavLink
                to="/help"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-500 text-lg"
              >
                <HelpCircle size={24} /> Help
              </NavLink>
              <NavLink
                to="/saved"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-500 text-lg"
              >
                <Save size={24} /> Saved
              </NavLink>
              <NavLink
                to="/blocked"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-500 text-lg"
              >
                <Shield size={24} /> Blocked
              </NavLink> */}
            </div>

            <div className="p-6 border-t">
              <NavLink
                to="#"
                onClick={handleLogout}
                className="flex items-center gap-4 text-red-500 hover:text-red-600 text-lg"
              >
                <LogOut size={24} /> Logout
              </NavLink>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="relative w-32 h-32 group">
            <div className="rounded-full overflow-hidden ring-2 ring-purple-500 p-1 w-full h-full">
              <img
                src={
                  imagePreview ||
                  user?.profilePictureUrl ||
                  "/api/placeholder/150/150"
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Image Upload Overlay */}
            <div
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors"
            >
              <Camera size={16} className="text-white" />
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              name="profileImage"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{user?.username}</h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Edit profile
              </button>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div className="text-center md:text-left">
                <span className="font-bold">{user?.posts?.length || 0}</span>
                <span className="ml-1">posts</span>
              </div>
              <button
                onClick={() => setShowFollowersModal(true)}
                className="text-center md:text-left"
              >
                <span className="font-bold">
                  {user?.followers?.length || 0}
                </span>
                <span className="ml-1">followers</span>
              </button>
              <button
                onClick={() => setShowFollowingModal(true)}
                className="text-center md:text-left"
              >
                <span className="font-bold">
                  {user?.following?.length || 0}
                </span>
                <span className="ml-1">following</span>
              </button>
            </div>

            <div className="text-center md:text-left">
              <h2 className="font-bold">{user?.fullName}</h2>
              <p className="whitespace-pre-line text-gray-600">
                {user?.bio || "No bio yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-t-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              {/* Left: Image */}
              <div className="w-full md:w-3/5 bg-black flex items-center">
                <img
                  src={
                    selectedPost.media?.imageUrl || "/api/placeholder/600/600"
                  }
                  alt={selectedPost.caption || "Post"}
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
              </div>

              {/* Right: Post details */}
              <div className="w-full md:w-2/5 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profilePictureUrl || "/api/placeholder/40/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.username}</span>
                    {selectedPost.location && (
                      <span className="text-sm text-gray-500">
                        • {selectedPost.location}
                      </span>
                    )}
                  </div>
                  <button onClick={closePostModal}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Caption and Comments */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Caption */}
                  {selectedPost.caption && (
                    <div className="flex items-start space-x-3 mb-4 pb-4 border-b">
                      <img
                        src={user.profilePictureUrl || "/api/placeholder/40/40"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p>
                          <span className="font-medium mr-2">
                            {user.username}
                          </span>
                          {selectedPost.caption}
                        </p>
                        {/* Hashtags */}
                        {selectedPost.hashtags &&
                          selectedPost.hashtags.length > 0 && (
                            <p className="mt-2">
                              {selectedPost.hashtags.map((tag) => (
                                <span key={tag} className="text-blue-500 mr-1">
                                  #{tag}
                                </span>
                              ))}
                            </p>
                          )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(
                            selectedPost.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 mb-4"
                      >
                        <img
                          src="/api/placeholder/32/32"
                          alt="Commenter"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p>
                            <span className="font-medium mr-2">
                              {comment.user.username || "User"}
                            </span>
                            {comment.text}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <span>{comment.likes?.length || 0} likes</span>
                            <button className="font-medium">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No comments yet.</p>
                      <p>Be the first to comment on this post.</p>
                    </div>
                  )}
                </div>

                {/* Engagement */}
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Heart
                          className={`w-6 h-6 ${
                            selectedPost.likes?.includes(user._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-700"
                          }`}
                        />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MessageCircle className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                      <Bookmark
                        className={`w-6 h-6 ${
                          selectedPost.savedBy?.includes(user._id)
                            ? "fill-black text-black"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="font-medium mb-2">
                    {selectedPost.likes?.length || 0} likes
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedPost.createdAt
                      ? new Date(selectedPost.createdAt).toLocaleString()
                      : "Recently"}
                  </p>
                </div>

                {/* Add Comment */}
                <form className="border-t p-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full outline-none"
                  />
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={user}
          onUpdate={handleProfileUpdate}
        />

        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          type="Followers"
          users={user?.followers}
        />

        <FollowersModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          type="Following"
          users={user?.following}
        />
      </div>
    </Layout>
  );
};

export default Profile;
