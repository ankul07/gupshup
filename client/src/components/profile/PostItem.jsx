import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useSelector } from "react-redux";

const PostItem = ({
  post,
  type = "grid",
  onClick,
  onLike,
  onSave,
  hideActions,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { selecteduserPosts } = useSelector((state) => state.posts);
  // Add local state for likes count and liked status
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.engagement?.likes?.isLikedByMe);
  const [isSaved, setIsSaved] = useState(post?.metadata?.isSavedByMe);
  const [likesCount, setLikesCount] = useState(post?.engagement?.likes?.count);
  console.log("get selected post component", selecteduserPosts);

  // Handle different data structures between post types
  const postImage =
    post.media?.imageUrl ||
    post.content?.imageUrl ||
    "/api/placeholder/400/400";
  const postCaption = post.caption || post.content?.text || "";
  const commentsCount =
    post.comments?.length || post.engagement?.comments?.count || 0;
  const postId = post._id || post.id;

  // Initialize local state based on post props
  useEffect(() => {
    setLocalLikesCount(
      post.likes?.length || post.engagement?.likes?.count || 0
    );
    setLocalIsLiked(post.isLikedByMe || false);
    setLocalIsSaved(post.isSaved || false);
  }, [post]);
  // This effect syncs the component with any changes to the post props
  useEffect(() => {
    setIsLiked(post?.engagement?.likes?.isLikedByMe);
    setLikesCount(post?.engagement?.likes?.count);
    setIsSaved(post?.metadata?.isSavedByMe);
  }, [
    post?.engagement?.likes?.isLikedByMe,
    post?.engagement?.likes?.count,
    post?.metadata?.isSavedByMe,
  ]);
  // Handle like action with local state update
  const handleLike = async () => {
    try {
      // Calculate new state before updating
      const newIsLiked = !isLiked;
      const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;

      // Update local state first for responsive UI
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      // Use the prop function instead of direct dispatch
      await onToggleLike(post.id);
    } catch (error) {
      // Revert UI changes if there's an error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      console.error("Error toggling like status:", error);
    }
  };

  // Handle save action with local state update
  const handleSave = (e) => {
    e.stopPropagation();
    setLocalIsSaved(!localIsSaved);
    onSave && onSave(post);
  };

  // Render grid item (used in Posts and Tagged tabs)
  if (type === "grid") {
    return (
      <div
        key={postId}
        className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative cursor-pointer"
        onClick={() => onClick && onClick(post)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={postImage}
          alt={postCaption || "Post image"}
          className="w-full h-full object-cover"
        />

        {/* Overlay with engagement stats on hover */}
        {!hideActions && (
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 ${
              isHovered ? "opacity-100" : "opacity-0"
            } transition-opacity flex items-center justify-center`}
          >
            <div className="flex gap-8 text-white">
              <div className="flex items-center">
                <Heart size={20} className="fill-white text-white mr-2" />
                <span className="text-lg font-bold">{localLikesCount}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle size={20} className="text-white mr-2" />
                <span className="text-lg font-bold">{commentsCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render full item (used in Saved tab)
  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-md mb-6 mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <img
            className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full object-cover"
            src={post?.user?.profilePicture || "/api/placeholder/40/40"}
            alt={post?.user?.username || "User"}
          />
          <div>
            <div className="flex items-center">
              <span className="font-medium mr-1 text-sm sm:text-base">
                {post?.user?.username || "User"}
              </span>
              {post?.user?.isVerified && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              {post?.metadata?.location || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative w-full">
        {post?.content?.videoUrl ? (
          <video
            src={post.content.videoUrl}
            className="w-full max-h-96"
            controls
          ></video>
        ) : (
          <img
            src={postImage}
            alt="Post content"
            className="w-full object-cover max-h-96"
          />
        )}
      </div>

      {/* Action Buttons */}
      {!hideActions && (
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleLike}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    localIsLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
            <button
              onClick={handleSave}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Bookmark
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  localIsSaved ? "fill-black text-black" : "text-gray-700"
                }`}
              />
            </button>
          </div>

          {/* Likes & Caption */}
          <div className="mt-2">
            <p className="font-medium text-sm sm:text-base">
              {localLikesCount} likes
            </p>
            <p className="mt-1 text-xs sm:text-sm">
              <span className="font-medium mr-2">
                {post?.user?.username || "User"}
              </span>
              {postCaption}
            </p>
          </div>

          {/* Time and Comments Preview */}
          <p className="mt-1 text-gray-500 text-xs">
            {new Date(
              post?.content?.createdAt || post?.createdAt || Date.now()
            ).toLocaleDateString()}
          </p>
          <button className="mt-2 text-gray-500 text-xs sm:text-sm">
            View all {commentsCount} comments
          </button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
