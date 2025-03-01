import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Grid,
  Bookmark,
  Tag,
  Heart,
  MessageCircle,
  Camera,
} from "lucide-react";
import FollowersModal from "../components/FollowersModal";

const ProfilePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Handle post click to show post detail
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  // Close post modal
  const closePostModal = () => {
    setSelectedPost(null);
  };

  // Tab definitions
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
                  key={post}
                  className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <img
                    src="/api/placeholder/400/400"
                    alt="Post image"
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
                        <span className="text-lg font-bold">0</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={20} className="text-white mr-2" />
                        <span className="text-lg font-bold">0</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {user?.savedPosts.map((postId) => (
                  <div
                    key={postId}
                    className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <img
                      src="/api/placeholder/400/400"
                      alt="Saved post"
                      className="w-full h-full object-cover"
                    />
                  </div>
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

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="relative w-32 h-32 group">
            <div className="rounded-full overflow-hidden ring-2 ring-purple-500 p-1 w-full h-full">
              <img
                src={user?.profilePictureUrl || "/api/placeholder/150/150"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h2 className="text-xl font-medium">{user?.username}</h2>
              <button className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity">
                Follow
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
              <p className="text-xs text-gray-500 mt-2">
                Joined {formatDate(user?.createdAt)}
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

        {/* Followers Modal */}
        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          type="Followers"
          users={user?.followers}
        />

        {/* Following Modal */}
        <FollowersModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          type="Following"
          users={user?.following}
        />

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              {/* Left: Image */}
              <div className="w-full md:w-3/5 bg-black flex items-center">
                <img
                  src="/api/placeholder/600/600"
                  alt="Post"
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
              </div>

              {/* Right: Post details */}
              <div className="w-full md:w-2/5 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.profilePictureUrl || "/api/placeholder/40/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <button onClick={closePostModal}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Caption and Comments */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="text-center py-6 text-gray-500">
                    <p>No comments yet.</p>
                    <p>Be the first to comment on this post.</p>
                  </div>
                </div>

                {/* Engagement */}
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Heart className="w-6 h-6 text-gray-700" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MessageCircle className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                      <Bookmark className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                  <p className="font-medium mb-2">0 likes</p>
                  <p className="text-xs text-gray-500">Recently</p>
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
      </div>
    </Layout>
  );
};

export default ProfilePage;
