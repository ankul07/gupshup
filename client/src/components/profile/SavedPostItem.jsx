// import React, { useState, useEffect } from "react";
// import {
//   Heart,
//   MessageCircle,
//   Share,
//   MoreHorizontal,
//   Bookmark,
//   X,
// } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { toggleSavePost } from "../../redux/post/postSlice";
// import api from "../../services/api";

// const Comment = ({ comment }) => (
//   <div className="flex items-start space-x-2 mb-4">
//     <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0">
//       {comment?.user?.profilePicture && (
//         <img
//           src={comment?.user?.profilePicture}
//           alt={comment?.user?.username}
//           className="w-full h-full rounded-full object-cover"
//         />
//       )}
//     </div>
//     <div className="flex-1">
//       <div className="flex items-center justify-between">
//         <div>
//           <span className="font-medium mr-2">{comment?.user?.username}</span>
//           <span className="text-sm">{comment?.text}</span>
//         </div>
//         <Heart
//           className={`w-4 h-4 ${
//             comment?.isLikedByMe ? "fill-red-500 text-red-500" : "text-gray-400"
//           }`}
//         />
//       </div>
//       <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
//         <span>{new Date(comment?.timestamp).toLocaleDateString()}</span>
//         <span>{comment?.likesCount} likes</span>
//         <button className="font-medium">Reply</button>
//       </div>
//     </div>
//   </div>
// );

// const SavedPostItem = ({ postId }) => {
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isSaved, setIsSaved] = useState(true); // Default to true since it's a saved post
//   const [likesCount, setLikesCount] = useState(0);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchPostData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/v1/post/single-post/${postId}`);
//         if (response.data.success) {
//           setPost(response.data.data);
//           setIsLiked(response.data.data?.engagement?.likes?.isLikedByMe);
//           setLikesCount(response.data.data?.engagement?.likes?.count);
//         } else {
//           setError("Failed to load post");
//         }
//       } catch (err) {
//         setError("Error loading post: " + err.message);
//         console.error("Error fetching post:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (postId) {
//       fetchPostData();
//     }
//   }, [postId]);

//   const handleLike = async () => {
//     try {
//       setIsLiked(!isLiked);
//       setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
//       // You would likely have an API call here to update the like status
//       // await api.post(`/route/like-post/${postId}`);
//     } catch (error) {
//       // Revert state if API call fails
//       setIsLiked(isLiked);
//       setLikesCount(post?.engagement?.likes?.count);
//       console.error("Error toggling like status:", error);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaved(!isSaved);
//       const resultAction = await dispatch(toggleSavePost(postId));
//       if (toggleSavePost.rejected.match(resultAction)) {
//         setIsSaved(isSaved);
//         console.error("Failed to toggle save status:", resultAction.payload);
//       }
//     } catch (error) {
//       setIsSaved(isSaved);
//       console.error("Error toggling save status:", error);
//     }
//   };

//   const handleSubmitComment = (e) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       // Here you would handle submitting the comment to your API
//       setNewComment("");
//     }
//   };

//   if (loading) return <div className="p-4 text-center">Loading post...</div>;
//   if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
//   if (!post) return <div className="p-4 text-center">Post not found</div>;

//   return (
//     <div className="w-full max-w-xl bg-white rounded-lg shadow-md mb-6 mx-auto">
//       {/* Post Header */}
//       <div className="flex items-center justify-between p-3 sm:p-4">
//         <div className="flex items-center space-x-2">
//           <img
//             className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full object-cover"
//             src={post?.user?.profilePicture}
//             alt={post?.user?.username}
//           />
//           <div>
//             <div className="flex items-center">
//               <span className="font-medium mr-1 text-sm sm:text-base">
//                 {post?.user?.username}
//               </span>
//               {post?.user?.isVerified && (
//                 <span className="text-blue-500">✓</span>
//               )}
//             </div>
//             <span className="text-xs sm:text-sm text-gray-500">
//               {post?.metadata?.location}
//             </span>
//           </div>
//         </div>
//         <div className="relative">
//           <button
//             onClick={() => setShowDropdown(!showDropdown)}
//             className="p-1 hover:bg-gray-100 rounded-full"
//           >
//             <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
//           </button>

//           {showDropdown && (
//             <div className="absolute right-0 top-full mt-2 w-36 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//               {post?.user?.isFollowing ? (
//                 <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left text-red-500 hover:bg-gray-50">
//                   Unfollow
//                 </button>
//               ) : (
//                 <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50">
//                   Follow
//                 </button>
//               )}
//               <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left text-red-500 hover:bg-gray-50">
//                 Report
//               </button>
//               <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50">
//                 Go to post
//               </button>
//               <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50">
//                 Share to...
//               </button>
//               <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50">
//                 Copy link
//               </button>
//               <button className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50">
//                 Embed
//               </button>
//               <button
//                 className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm text-left hover:bg-gray-50"
//                 onClick={() => setShowDropdown(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Post Image */}
//       <div className="relative w-full">
//         {post?.content?.imageUrl ? (
//           <img
//             src={post.content.imageUrl}
//             alt="Post content"
//             className="w-full object-cover max-h-96"
//           />
//         ) : post?.content?.videoUrl ? (
//           <video
//             src={post.content.videoUrl}
//             className="w-full max-h-96"
//             controls
//           ></video>
//         ) : (
//           <div className="h-48 sm:h-64 bg-gray-100 flex items-center justify-center">
//             <span className="text-gray-400 text-sm sm:text-base">No media</span>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="p-3 sm:p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             <button
//               onClick={handleLike}
//               className="p-1 hover:bg-gray-100 rounded-full"
//             >
//               <Heart
//                 className={`w-5 h-5 sm:w-6 sm:h-6 ${
//                   isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
//                 }`}
//               />
//             </button>
//             <button
//               onClick={() => setShowComments(true)}
//               className="p-1 hover:bg-gray-100 rounded-full"
//             >
//               <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
//             </button>
//             <button className="p-1 hover:bg-gray-100 rounded-full">
//               <Share className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
//             </button>
//           </div>
//           <button
//             onClick={handleSave}
//             className="p-1 hover:bg-gray-100 rounded-full"
//           >
//             <Bookmark
//               className={`w-5 h-5 sm:w-6 sm:h-6 ${
//                 isSaved ? "fill-black text-black" : "text-gray-700"
//               }`}
//             />
//           </button>
//         </div>

//         {/* Likes & Caption */}
//         <div className="mt-2">
//           <p className="font-medium text-sm sm:text-base">{likesCount} likes</p>
//           <p className="mt-1 text-xs sm:text-sm">
//             <span className="font-medium mr-2">{post?.user?.username}</span>
//             {post?.content?.text}
//           </p>
//           <div className="mt-1">
//             {post?.metadata?.tags?.map((tag) => (
//               <span key={tag} className="text-blue-500 mr-2 text-xs sm:text-sm">
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Time and Comments Preview */}
//         <p className="mt-1 text-gray-500 text-xs">
//           {new Date(post?.content?.createdAt).toLocaleDateString()}
//         </p>
//         <button
//           onClick={() => setShowComments(true)}
//           className="mt-2 text-gray-500 text-xs sm:text-sm"
//         >
//           View all {post?.engagement?.comments?.count} comments
//         </button>
//       </div>

//       {/* Comments Modal - Responsive design */}
//       {showComments && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-4xl h-[80vh] flex flex-col md:flex-row rounded-lg overflow-hidden">
//             {/* Image/Video - Full width on mobile, left side on larger screens */}
//             <div className="w-full md:w-3/5 bg-black flex items-center">
//               {post?.content?.imageUrl ? (
//                 <img
//                   src={post.content.imageUrl}
//                   alt="Post"
//                   className="w-full h-auto max-h-60 md:max-h-full object-contain"
//                 />
//               ) : post?.content?.videoUrl ? (
//                 <video
//                   src={post.content.videoUrl}
//                   className="w-full h-auto"
//                   controls
//                 ></video>
//               ) : (
//                 <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//                   <span className="text-gray-400">No media</span>
//                 </div>
//               )}
//             </div>

//             {/* Comments section - Full width on mobile, right side on larger screens */}
//             <div className="w-full md:w-2/5 flex flex-col h-full md:max-h-[80vh]">
//               {/* Header */}
//               <div className="p-3 sm:p-4 border-b flex justify-between items-center">
//                 <div className="flex items-center space-x-2">
//                   <img
//                     className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full object-cover"
//                     src={post?.user?.profilePicture}
//                     alt={post?.user?.username}
//                   />
//                   <span className="font-medium text-sm sm:text-base">
//                     {post?.user?.username}
//                   </span>
//                 </div>
//                 <button onClick={() => setShowComments(false)}>
//                   <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//               </div>

//               {/* Comments List - Scrollable */}
//               <div className="flex-1 overflow-y-auto p-3 sm:p-4">
//                 {post?.engagement?.comments?.preview?.map((comment) => (
//                   <Comment key={comment?.id} comment={comment} />
//                 ))}
//               </div>

//               {/* Add Comment - Fixed at bottom */}
//               <form
//                 onSubmit={handleSubmitComment}
//                 className="border-t p-3 sm:p-4"
//               >
//                 <input
//                   type="text"
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Add a comment..."
//                   className="w-full outline-none text-sm sm:text-base py-1"
//                 />
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SavedPostItem;

import React from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

const SavedPostItem = ({
  post,
  type = "grid",
  onClick,
  onLike,
  onSave,
  hideActions,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Handle different data structures between post types
  const postImage =
    post.media?.imageUrl ||
    post.content?.imageUrl ||
    "/api/placeholder/400/400";
  const postCaption = post.caption || post.content?.text || "";
  const likesCount = post.likes?.length || post.engagement?.likes?.count || 0;
  const commentsCount =
    post.comments?.length || post.engagement?.comments?.count || 0;
  const postId = post._id || post.id;

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
                <span className="text-lg font-bold">{likesCount}</span>
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
        <div className="text-xs sm:text-sm text-gray-500 font-medium">
          Saved
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
                onClick={(e) => {
                  e.stopPropagation();
                  onLike && onLike(post);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    post.isLikedByMe
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700"
                  }`}
                />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave && onSave(post);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Bookmark
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  post.isSaved ? "fill-black text-black" : "text-gray-700"
                }`}
              />
            </button>
          </div>

          {/* Likes & Caption */}
          <div className="mt-2">
            <p className="font-medium text-sm sm:text-base">
              {likesCount} likes
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

export default SavedPostItem;
