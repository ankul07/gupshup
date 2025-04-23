import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const UserTable = ({ users, columns, isFullTable = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  // Sort function
  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === "followers") {
      return sortDirection === "asc"
        ? a.followers.length - b.followers.length
        : b.followers.length - a.followers.length;
    } else if (sortField === "following") {
      return sortDirection === "asc"
        ? a.following.length - b.following.length
        : b.following.length - a.following.length;
    } else if (sortField === "posts") {
      return sortDirection === "asc"
        ? a.posts.length - b.posts.length
        : b.posts.length - a.posts.length;
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
  const filteredUsers = sortedUsers.filter((user) => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTermLower))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
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

  return (
    <div className="overflow-hidden">
      {isFullTable && (
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
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
              {columns.includes("username") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username
                  {sortField === "username" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("email") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortField === "email" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("fullName") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("fullName")}
                >
                  Full Name
                  {sortField === "fullName" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("role") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
                  {sortField === "role" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("followers") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("followers")}
                >
                  Followers
                  {sortField === "followers" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("following") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("following")}
                >
                  Following
                  {sortField === "following" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("posts") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("posts")}
                >
                  Posts
                  {sortField === "posts" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("isVerified") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("isVerified")}
                >
                  Verified
                  {sortField === "isVerified" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              )}

              {columns.includes("createdAt") && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Joined
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
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {columns.includes("username") && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                )}

                {columns.includes("email") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                )}

                {columns.includes("fullName") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.fullName}
                  </td>
                )}

                {columns.includes("role") && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                )}

                {columns.includes("followers") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.followers.length}
                  </td>
                )}

                {columns.includes("following") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.following.length}
                  </td>
                )}

                {columns.includes("posts") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.posts.length}
                  </td>
                )}

                {columns.includes("isVerified") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.isVerified ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </td>
                )}

                {columns.includes("createdAt") && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                )}

                {isFullTable && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    {user.role !== "admin" && (
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
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
              {Math.min(currentPage * rowsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span> users
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

export default UserTable;
