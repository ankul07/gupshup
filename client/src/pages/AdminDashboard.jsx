import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/admin/StatCard";
import UserTable from "../components/admin/UserTable";
import PostsTable from "../components/admin/PostsTable";
import EngagementChart from "../components/admin/EngagementChart";
import HashtagCloud from "../components/admin/HashtagCloud";
import {
  Users,
  FileText,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  // State for data
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate data fetching - replace with actual API calls
    const fetchData = async () => {
      try {
        // In a real app, replace with actual API calls
        // const usersResponse = await fetch('/api/admin/users');
        // const postsResponse = await fetch('/api/admin/posts');
        // setUsers(await usersResponse.json());
        // setPosts(await postsResponse.json());

        // Mock data based on your schemas
        setUsers([
          {
            _id: "u1",
            username: "john_doe",
            email: "john@example.com",
            fullName: "John Doe",
            isVerified: true,
            role: "admin",
            followers: Array(120).fill("placeholder"),
            following: Array(45).fill("placeholder"),
            posts: Array(15).fill("placeholder"),
            createdAt: new Date(2023, 5, 15).toISOString(),
          },
          {
            _id: "u2",
            username: "jane_smith",
            email: "jane@example.com",
            fullName: "Jane Smith",
            isVerified: true,
            role: "user",
            followers: Array(85).fill("placeholder"),
            following: Array(90).fill("placeholder"),
            posts: Array(8).fill("placeholder"),
            createdAt: new Date(2023, 7, 22).toISOString(),
          },
          {
            _id: "u3",
            username: "alex_jones",
            email: "alex@example.com",
            fullName: "Alex Jones",
            isVerified: false,
            role: "user",
            followers: Array(35).fill("placeholder"),
            following: Array(42).fill("placeholder"),
            posts: Array(5).fill("placeholder"),
            createdAt: new Date(2023, 9, 10).toISOString(),
          },
          {
            _id: "u4",
            username: "sarah_wilson",
            email: "sarah@example.com",
            fullName: "Sarah Wilson",
            isVerified: true,
            role: "user",
            followers: Array(210).fill("placeholder"),
            following: Array(120).fill("placeholder"),
            posts: Array(25).fill("placeholder"),
            createdAt: new Date(2023, 4, 5).toISOString(),
          },
        ]);

        setPosts([
          {
            _id: "p1",
            user: "u1",
            caption: "Beautiful sunset today #nature #photography",
            media: { imageUrl: "sunset.jpg" },
            likes: Array(45).fill("placeholder"),
            comments: Array(12).fill({ text: "Great shot!" }),
            shares: Array(5).fill("placeholder"),
            savedBy: Array(8).fill("placeholder"),
            reportedBy: [],
            hashtags: ["nature", "photography"],
            createdAt: new Date(2023, 10, 1).toISOString(),
          },
          {
            _id: "p2",
            user: "u2",
            caption: "My new project #coding #webdev",
            media: { imageUrl: "code.jpg" },
            likes: Array(32).fill("placeholder"),
            comments: Array(8).fill({ text: "Looking good!" }),
            shares: Array(3).fill("placeholder"),
            savedBy: Array(6).fill("placeholder"),
            reportedBy: Array(1).fill("placeholder"),
            hashtags: ["coding", "webdev"],
            createdAt: new Date(2023, 10, 5).toISOString(),
          },
          {
            _id: "p3",
            user: "u3",
            caption: "Morning workout #fitness #health",
            media: { videoUrl: "workout.mp4" },
            likes: Array(78).fill("placeholder"),
            comments: Array(15).fill({ text: "Keep it up!" }),
            shares: Array(7).fill("placeholder"),
            savedBy: Array(12).fill("placeholder"),
            reportedBy: [],
            hashtags: ["fitness", "health"],
            createdAt: new Date(2023, 10, 8).toISOString(),
          },
          {
            _id: "p4",
            user: "u4",
            caption: "New recipe #food #cooking",
            media: { imageUrl: "recipe.jpg" },
            likes: Array(56).fill("placeholder"),
            comments: Array(9).fill({ text: "Looks delicious!" }),
            shares: Array(4).fill("placeholder"),
            savedBy: Array(15).fill("placeholder"),
            reportedBy: [],
            hashtags: ["food", "cooking"],
            createdAt: new Date(2023, 10, 12).toISOString(),
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute stats for the dashboard
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const verifiedUsers = users.filter((user) => user.isVerified).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;

  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce(
    (sum, post) => sum + post.comments.length,
    0
  );
  const totalShares = posts.reduce((sum, post) => sum + post.shares.length, 0);
  const totalSaves = posts.reduce((sum, post) => sum + post.savedBy.length, 0);
  const reportedPosts = posts.filter(
    (post) => post.reportedBy.length > 0
  ).length;

  // Collect all hashtags for the tag cloud
  const allHashtags = posts.reduce((tags, post) => {
    return [...tags, ...(post.hashtags || [])];
  }, []);

  // Count occurrences of each hashtag
  const hashtagCounts = allHashtags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  // Format for hashtag cloud
  const hashtagData = Object.entries(hashtagCounts).map(([tag, count]) => ({
    text: tag,
    value: count,
  }));

  // Stats for display
  const overviewStats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Posts",
      value: totalPosts,
      icon: <FileText size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      icon: <CheckCircle size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Admin Users",
      value: adminUsers,
      icon: <Users size={24} />,
      color: "bg-yellow-500",
    },
  ];

  const engagementStats = [
    {
      title: "Total Likes",
      value: totalLikes,
      icon: <Heart size={24} />,
      color: "bg-red-500",
    },
    {
      title: "Total Comments",
      value: totalComments,
      icon: <MessageSquare size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Shares",
      value: totalShares,
      icon: <Share2 size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Saved Posts",
      value: totalSaves,
      icon: <Bookmark size={24} />,
      color: "bg-purple-500",
    },
  ];

  const moderationStats = [
    {
      title: "Reported Posts",
      value: reportedPosts,
      icon: <Flag size={24} />,
      color: "bg-red-500",
    },
  ];

  // Engagement data for chart
  const engagementData = [
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
    { name: "Shares", value: totalShares },
    { name: "Saves", value: totalSaves },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 mr-2 ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-2 px-4 mr-2 ${
                  activeTab === "users"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                className={`py-2 px-4 mr-2 ${
                  activeTab === "posts"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "engagement"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("engagement")}
              >
                Engagement
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {overviewStats.map((stat, index) => (
                    <StatCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                    />
                  ))}
                </div>

                {/* Recent Users and Posts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="mr-2" size={20} />
                      Recent Users
                    </h2>
                    <UserTable
                      users={users.slice(0, 5)}
                      columns={["username", "email", "role", "isVerified"]}
                    />
                    <div className="mt-4 text-right">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setActiveTab("users")}
                      >
                        View All Users
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="mr-2" size={20} />
                      Recent Posts
                    </h2>
                    <PostsTable
                      posts={posts.slice(0, 5)}
                      columns={["caption", "likes", "comments", "reports"]}
                    />
                    <div className="mt-4 text-right">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setActiveTab("posts")}
                      >
                        View All Posts
                      </button>
                    </div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="bg-white p-4 rounded-lg shadow mb-8">
                  <h2 className="text-lg font-semibold mb-4">
                    Engagement Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {engagementStats.map((stat, index) => (
                      <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                      />
                    ))}
                  </div>
                </div>

                {/* Moderation Stats */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Moderation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {moderationStats.map((stat, index) => (
                      <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">All Users</h2>
                <UserTable
                  users={users}
                  columns={[
                    "username",
                    "email",
                    "fullName",
                    "role",
                    "followers",
                    "following",
                    "posts",
                    "isVerified",
                    "createdAt",
                  ]}
                  isFullTable={true}
                />
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">All Posts</h2>
                <PostsTable
                  posts={posts}
                  columns={[
                    "caption",
                    "user",
                    "likes",
                    "comments",
                    "shares",
                    "saves",
                    "reports",
                    "createdAt",
                  ]}
                  isFullTable={true}
                />
              </div>
            )}

            {/* Engagement Tab */}
            {activeTab === "engagement" && (
              <>
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Engagement Metrics
                  </h2>
                  <EngagementChart data={engagementData} />
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">
                    Popular Hashtags
                  </h2>
                  <HashtagCloud tags={hashtagData} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
