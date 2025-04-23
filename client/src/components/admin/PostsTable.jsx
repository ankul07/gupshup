import React, { useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark, Flag } from "lucide-react";

const PostsTable = ({ posts, columns, isFullTable = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  // Sort function
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortField === "likes") {
      return sortDirection === "asc"
        ? a.likes.length - b.likes.length
        : b.likes.length - a.likes.length;
    } else if (sortField === "comments") {
      return sortDirection === "asc"
        ? a.comments.length - b.comments.length
        : b.comments.length - a.comments.length;
    } else if (sortField === "shares") {
      return sortDirection === "asc"
        ? a.shares.length - b.shares.length
        : b.shares.length - a.shares.length;
    } else if (sortField === "saves") {
      return sortDirection === "asc"
        ? a.savedBy.length - b.savedBy.length
        : b.savedBy.length - a.savedBy.length;
    } else if (sortField === "reports") {
      return sortDirection === "asc"
        ? a.reportedBy.length - b.reportedBy.length
        : b.reportedBy.length - a.reportedBy.length;
    } else if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return sortDirection === "asc"
        ? (a[sortField] ?? "")
            .toString()
            .localeCompare((b[sortField] ?? "").toString())
        : (b[sortField] ?? "")
            .toString()
            .localeCompare((a[sortField] ?? "").toString());
    }
  });

  // Filter by search term
  const filteredPosts = sortedPosts.filter((post) => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return post.caption && post.caption.toLowerCase().includes(searchTermLower);
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const truncateCaption = (caption, maxLength = 40) => {
    if (!caption) return "";
    return caption.length > maxLength
      ? `${caption.substring(0, maxLength)}...`
      : caption;
  };

  return (
    <div className="overflow-hidden">
      {isFullTable && (
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search posts..."
            className="px-3 py-2 border rounded-lg w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.includes("caption") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("caption")}
                >
                  Content
                  {sortField === "caption" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("user") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user")}
                >
                  User
                  {sortField === "user" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("likes") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("likes")}
                >
                  <div className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    Likes
                    {sortField === "likes" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              )}

              {columns.includes("comments") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("comments")}
                >
                  <div className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    Comments
                    {sortField === "comments" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              )}

              {columns.includes("shares") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("shares")}
                >
                  <div className="flex items-center">
                    <Share2 size={14} className="mr-1" />
                    Shares
                    {sortField === "shares" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              )}

              {columns.includes("saves") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("saves")}
                >
                  <div className="flex items-center">
                    <Bookmark size={14} className="mr-1" />
                    Saves
                    {sortField === "saves" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              )}

              {columns.includes("reports") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("reports")}
                >
                  <div className="flex items-center">
                    <Flag size={14} className="mr-1" />
                    Reports
                    {sortField === "reports" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              )}

              {columns.includes("createdAt") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                  {sortField === "createdAt" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {isFullTable && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPosts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                {columns.includes("caption") && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {post.media?.imageUrl && (
                        <span className="text-blue-500 mr-2">[Image]</span>
                      )}
                      {post.media?.videoUrl && (
                        <span className="text-green-500 mr-2">[Video]</span>
                      )}
                      {truncateCaption(post.caption)}
                    </div>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {post.hashtags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="mr-1">
                            #{tag}
                          </span>
                        ))}
                        {post.hashtags.length > 3 && <span>...</span>}
                      </div>
                    )}
                  </td>
                )}

                {columns.includes("user") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {post.user}
                  </td>
                )}

                {columns.includes("likes") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <Heart size={16} className="text-red-500 mr-1" />
                      {post.likes.length}
                    </span>
                  </td>
                )}

                {columns.includes("comments") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <MessageSquare size={16} className="text-blue-500 mr-1" />
                      {post.comments.length}
                    </span>
                  </td>
                )}

                {columns.includes("shares") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <Share2 size={16} className="text-green-500 mr-1" />
                      {post.shares.length}
                    </span>
                  </td>
                )}

                {columns.includes("saves") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <Bookmark size={16} className="text-purple-500 mr-1" />
                      {post.savedBy.length}
                    </span>
                  </td>
                )}

                {columns.includes("reports") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      <Flag
                        size={16}
                        className={`${
                          post.reportedBy.length > 0
                            ? "text-red-500"
                            : "text-gray-400"
                        } mr-1`}
                      />
                      {post.reportedBy.length}
                    </span>
                  </td>
                )}

                {columns.includes("createdAt") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                )}

                {isFullTable && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFullTable && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * rowsPerPage, filteredPosts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredPosts.length}</span> posts
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsTable;
