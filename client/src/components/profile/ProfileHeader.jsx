import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({
  user,
  imagePreview,
  fileInputRef,
  onImageChange,
  onEditProfile,
  onShowFollowers,
  onShowFollowing,
  isOwnProfile,
  currentUser,
}) => {
  const handleImageClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFollow = () => {
    // Implement follow functionality here
    console.log("Follow user:", user?.username);
  };

  const handleUnfollow = () => {
    // Implement unfollow functionality here
    console.log("Unfollow user:", user?.username);
  };

  // Check if current user follows this profile
  const isFollowing = currentUser?.following?.some(
    (f) => f.username === user?.username
  );

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
      <div className="relative w-32 h-32 group">
        <div className="rounded-full overflow-hidden ring-2 ring-purple-500 p-1 w-full h-full">
          <img
            src={
              imagePreview ||
              user?.profilePictureUrl ||
              "/api/placeholder/150/150"
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Image Upload Overlay - Only show for own profile */}
        {isOwnProfile && (
          <div
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors"
          >
            <Camera size={16} className="text-white" />
          </div>
        )}

        {/* Hidden File Input - Only needed for own profile */}
        {isOwnProfile && (
          <input
            type="file"
            ref={fileInputRef}
            name="profileImage"
            onChange={onImageChange}
            className="hidden"
            accept="image/*"
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <h2 className="text-xl font-medium">{user?.username}</h2>

          {/* Conditional button: Edit Profile for own profile, Follow/Unfollow for others */}
          {isOwnProfile ? (
            <button
              onClick={onEditProfile}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Edit profile
            </button>
          ) : (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`px-4 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity ${
                isFollowing
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <div className="flex justify-center md:justify-start gap-8 mb-4">
          <div className="text-center md:text-left">
            <span className="font-bold">{user?.posts?.length || 0}</span>
            <span className="ml-1">posts</span>
          </div>
          <button
            onClick={onShowFollowers}
            className="text-center md:text-left"
          >
            <span className="font-bold">{user?.followers?.length || 0}</span>
            <span className="ml-1">followers</span>
          </button>
          <button
            onClick={onShowFollowing}
            className="text-center md:text-left"
          >
            <span className="font-bold">{user?.following?.length || 0}</span>
            <span className="ml-1">following</span>
          </button>
        </div>

        <div className="text-center md:text-left">
          <h2 className="font-bold">{user?.fullName}</h2>
          <p className="whitespace-pre-line text-gray-600">
            {user?.bio || "No bio yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
