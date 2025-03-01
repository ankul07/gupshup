// Home.jsx
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/post/postSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6">
        {loading && (
          <p className="text-gray-500 text-center">Loading posts...</p>
        )}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts available</p>
        )}
        {!loading &&
          posts.length > 0 &&
          posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </Layout>
  );
};

export default Home;
