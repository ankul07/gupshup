import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { toggleSavePost, toggleLikePost } from "../redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";

const Post = ({ post }) => {
  const [showMenu, setShowMenu] = useState(false);
  // Local state to track saved/liked status for immediate UI updates
  const [localSaved, setLocalSaved] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-render

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Update local state when user state changes
  useEffect(() => {
    if (user?.savedPosts) {
      setLocalSaved(user.savedPosts.includes(post.id));
    }
    if (user?.likedPosts) {
      setLocalLiked(user.likedPosts.includes(post.id));
    }
  }, [user, post.id, forceUpdate]);

  const handleLike = (id) => {
    // Optimistic update - update UI immediately
    setLocalLiked(!localLiked);

    // Send API request
    dispatch(toggleLikePost(id))
      .then(() => {
        // Force component to re-check user state
        setTimeout(() => setForceUpdate((prev) => prev + 1), 100);
      })
      .catch(() => {
        // Revert optimistic update if there's an error
        setLocalLiked(localLiked);
      });
  };

  const handleSave = (id) => {
    // Optimistic update - update UI immediately
    setLocalSaved(!localSaved);

    // Send API request
    dispatch(toggleSavePost(id))
      .then(() => {
        // Force component to re-check user state
        setTimeout(() => setForceUpdate((prev) => prev + 1), 100);
        console.log(id);
      })
      .catch(() => {
        // Revert optimistic update if there's an error
        setLocalSaved(localSaved);
      });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Use local state for UI rendering instead of directly checking user state
  const isSaved = localSaved;
  const isLiked = localLiked;

  return (
    <div className="max-w-xl bg-white rounded-lg shadow-md mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <img
            className="w-8 h-8 bg-gray-200 rounded-full object-cover"
            src={post?.user?.profilePicture}
            alt="user avatar"
          />
          <div>
            <div className="flex items-center">
              <span className="font-medium mr-1">{post?.user?.username}</span>
              {post?.user?.isVerified && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {post?.metadata?.location}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="More options"
          >
            <MoreHorizontal size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  Report
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={toggleMenu}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post?.content?.imageUrl}
          alt="Post content"
          className="w-full object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-2">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button
              onClick={() => handleLike(post.id)}
              className="focus:outline-none"
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart
                size={24}
                className={`${
                  isLiked ? "fill-red-500 text-red-500" : "text-black"
                }`}
              />
            </button>
            <button className="focus:outline-none" aria-label="Comment">
              <MessageCircle size={24} />
            </button>
            <button className="focus:outline-none" aria-label="Share">
              <Send size={24} />
            </button>
          </div>
          <button
            onClick={() => handleSave(post.id)}
            className="focus:outline-none"
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark
              size={24}
              className={`${isSaved ? "fill-black text-black" : "text-black"}`}
            />
          </button>
        </div>

        {/* Post likes count */}
        {post?.metadata?.likes > 0 && (
          <p className="font-medium text-sm mb-1">
            {post?.metadata?.likes.toLocaleString()} likes
          </p>
        )}

        {/* Caption & Tags */}
        <p className="mt-1">
          <span className="font-medium mr-2">{post?.user?.username}</span>
          {post?.content?.text}
        </p>
        <div className="mt-1">
          {post?.metadata?.tags?.map((tag) => (
            <span key={tag} className="text-blue-500 mr-2">
              #{tag}
            </span>
          ))}
        </div>

        {/* View comments link */}
        {post?.metadata?.comments > 0 && (
          <p className="text-gray-500 text-sm mt-1">
            View all {post?.metadata?.comments} comments
          </p>
        )}

        {/* Timestamp */}
        <p className="text-gray-400 text-xs mt-2">
          {post?.metadata?.timestamp}
        </p>
      </div>
    </div>
  );
};

export default Post;
