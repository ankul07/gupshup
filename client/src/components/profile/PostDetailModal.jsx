// File: src/components/post/PostDetailModal.jsx
import React from "react";
import { X, Heart, MessageCircle, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSavePost, toggleLikePost } from "../../redux/post/postSlice";

const PostDetailModal = ({ post, user, onClose }) => {
  const dispatch = useDispatch();
  console.log(post);
  // const { user } = useSelector((state) => state.auth);
  const isSaved = user?.savedPosts?.includes(post.id);
  const isLiked = user?.likedPosts?.includes(post.id);
  const handleLike = (id) => {
    dispatch(toggleLikePost(id));
  };

  const handleSave = (id) => {
    // setSaved(!saved);
    dispatch(toggleSavePost(id));
    console.log(id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left: Image */}
        <div className="w-full md:w-3/5 bg-black flex items-center">
          <img
            src={post?.content?.imageUrl || "/api/placeholder/600/600"}
            alt={"Post"}
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
              {post?.metadata?.location && (
                <span className="text-sm text-gray-500">
                  • {post?.metadata?.location}
                </span>
              )}
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Caption and Comments */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Caption */}
            {post?.content && (
              <div className="flex items-start space-x-3 mb-4 pb-4 border-b">
                <img
                  src={user.profilePictureUrl || "/api/placeholder/40/40"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p>
                    <span className="font-medium mr-2">{user.username}</span>
                    {post.content.text}
                  </p>
                  {/* Hashtags */}
                  {post?.metadata && post?.metadata.tags.length > 0 && (
                    <p className="mt-2">
                      {post.metadata.tags.map((tag) => (
                        <span key={tag} className="text-blue-500 mr-1">
                          #{tag}
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(post?.content?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Comments */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 mb-4">
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
                      post?.engagement?.likes?.isLikedByMe == true
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
                    post.savedBy?.includes(user._id)
                      ? "fill-black text-black"
                      : "text-gray-700"
                  }`}
                />
              </button>
            </div>
            <p className="font-medium mb-2">
              {post.engagement.likes?.count || 0} likes
            </p>
            <p className="text-xs text-gray-500">
              {post.content.createdAt
                ? new Date(post.content.createdAt).toLocaleString()
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
  );
};

export default PostDetailModal;
