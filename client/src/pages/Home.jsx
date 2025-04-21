import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  toggleSavePost,
  toggleLikePost,
  getSavedPosts,
  getLikedPosts,
} from "../redux/post/postSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.posts);

  // Track local state of posts with updated like counts

  // Ref for container to maintain scroll position
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getSavedPosts());
    dispatch(getLikedPosts());
  }, [dispatch]);

  const handleToggleSave = async (postId) => {
    try {
      await dispatch(toggleSavePost(postId));
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  // In your Home.jsx file
  const handleToggleLike = async (postId) => {
    try {
      await dispatch(toggleLikePost(postId));
      dispatch(getAllPosts());
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Layout>
      <div ref={containerRef} className="bg-white rounded-lg shadow p-6">
        {loading && (
          <p className="text-gray-500 text-center">Loading posts...</p>
        )}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts available</p>
        )}
        {!loading &&
          posts.length > 0 &&
          posts.map((post) => {
            return (
              <Post
                key={post.id}
                post={post}
                onToggleSave={handleToggleSave}
                onToggleLike={handleToggleLike}
              />
            );
          })}
      </div>
    </Layout>
  );
};

export default Home;
