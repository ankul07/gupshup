import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "./PostItem";
import { getSavedPosts } from "../../redux/post/postSlice";
import SavedPostItem from "./SavedPostItem";

const ProfileContent = ({
  activeTab,
  onPostClick,
  onLikePost,
  onSavePost,
  isOwnProfile,
}) => {
  const dispatch = useDispatch();
  const { selecteduserPosts, savedPosts, loading } = useSelector(
    (state) => state.posts
  );

  console.log("profile content", selecteduserPosts);

  // Remove the unnecessary useEffect that dispatches getSelectedUserPost
  // since this is already being handled in the parent Profile component

  useEffect(() => {
    // Fetch saved posts when viewing the saved tab on own profile
    if (isOwnProfile && activeTab === "saved") {
      dispatch(getSavedPosts());
    }
  }, [isOwnProfile, activeTab, dispatch]);

  const renderPostsGrid = () => {
    if (loading) {
      return (
        <div className="col-span-3 text-center py-12">Loading posts...</div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {selecteduserPosts && selecteduserPosts.length > 0 ? (
          selecteduserPosts.map((post) => (
            <PostItem
              key={post.id || post._id}
              post={post}
              type="grid"
              onClick={() => onPostClick(post)}
              onLike={onLikePost}
              onSave={onSavePost}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            <p className="text-xl mb-4">No posts yet</p>
            <p>When you share photos and videos, they'll appear here.</p>
          </div>
        )}
      </div>
    );
  };

  const renderSavedPosts = () => {
    // Only show saved posts to the profile owner
    if (!isOwnProfile) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">This content isn't available</p>
          <p>Saved posts are only visible to the account owner.</p>
        </div>
      );
    }

    if (loading) {
      return <div className="text-center py-12">Loading saved posts...</div>;
    }
    return (
      <>
        {savedPosts && savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {savedPosts.map((post) => (
              <SavedPostItem
                key={post.id || post._id}
                post={post}
                type="grid"
                onClick={() => onPostClick(post)}
                onLike={onLikePost}
                onSave={onSavePost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-4">Only you can see what you've saved</p>
            <p>When you save photos and videos, they'll appear here.</p>
          </div>
        )}
      </>
    );
  };

  switch (activeTab) {
    case "posts":
      return renderPostsGrid();
    case "saved":
      return renderSavedPosts();
    default:
      return null;
  }
};

export default ProfileContent;
