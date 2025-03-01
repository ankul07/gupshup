import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Bookmark,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleSavePost } from "../redux/post/postSlice";

const Comment = ({ comment }) => (
  <div className="flex items-start space-x-2 mb-4">
    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium mr-2">{comment?.user?.username}</span>
          <span className="text-sm">{comment?.text}</span>
        </div>
        <Heart
          className={`w-4 h-4 ${
            comment?.isLikedByMe ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </div>
      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
        <span>{new Date(comment?.timestamp).toLocaleDateString()}</span>
        <span>{comment?.likesCount} likes</span>
        <button className="font-medium">Reply</button>
      </div>
    </div>
  </div>
);

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post?.engagement?.likes?.isLikedByMe);
  const [isSaved, setIsSaved] = useState(post?.metadata?.isSavedByMe);
  const [likesCount, setLikesCount] = useState(post?.engagement?.likes?.count);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSave = async (postId) => {
    try {
      setIsSaved(!isSaved);
      const resultAction = await dispatch(toggleSavePost(postId));
      if (toggleSavePost.rejected.match(resultAction)) {
        setIsSaved(isSaved);
        console.error("Failed to toggle save status:", resultAction.payload);
      }
    } catch (error) {
      setIsSaved(isSaved);
      console.error("Error toggling save status:", error);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setNewComment("");
    }
  };

  return (
    <div className="max-w-xl bg-white rounded-lg shadow-md mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          {/* <div className="w-8 h-8 bg-gray-200 rounded-full"> */}
          <img
            className="w-8 h-8 bg-gray-200 rounded-full"
            src={post?.user?.profilePicture}
            alt="user-image"
          />
          {/* </div> */}
          <div>
            <div className="flex items-center">
              <span className="font-medium mr-1">{post?.user?.username}</span>
              {post?.user?.isVerified && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {post?.metadata?.location}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-6 h-6 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {post?.user?.isFollowing ? (
                <button className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50">
                  Unfollow
                </button>
              ) : (
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                  Follow
                </button>
              )}
              <button className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50">
                Report
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                Go to post
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                Share to...
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                Copy link
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50">
                Embed
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
                onClick={() => setShowDropdown(false)}
              >
                Cancel
              </button>
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
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </button>
            <button
              onClick={() => setShowComments(true)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Share className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <button
            onClick={() => handleSave(post.id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? "fill-black text-black" : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Likes & Caption */}
        <div className="mt-2">
          <p className="font-medium">{likesCount} likes</p>
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
        </div>

        {/* Comments Preview */}
        <button
          onClick={() => setShowComments(true)}
          className="mt-2 text-gray-500 text-sm"
        >
          View all {post?.engagement?.comments?.count} comments
        </button>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl h-[80vh] flex rounded-lg overflow-hidden">
            {/* Left: Image */}
            <div className="w-3/5 bg-black flex items-center">
              <img
                src="/api/placeholder/400/400"
                alt="Post"
                className="w-full h-auto"
              />
            </div>

            {/* Right: Comments */}
            <div className="w-2/5 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <span className="font-medium">{post?.user?.username}</span>
                </div>
                <button onClick={() => setShowComments(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4">
                {post?.engagement?.comments?.preview?.map((comment) => (
                  <Comment key={comment?.id} comment={comment} />
                ))}
              </div>

              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="border-t p-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
