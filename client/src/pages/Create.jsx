import React, { useState, useRef, useEffect } from "react";
import { Camera, Loader } from "lucide-react";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  resetPostState,
  clearPostErrors,
} from "../redux/post/postSlice";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [formData, setFormData] = useState({
    caption: "",
    postImage: null,
    location: "",
    tags: "",
  });
  const [preview, setPreview] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const hashtagInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.posts
  );
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, postImage: file });
      setPreview(URL.createObjectURL(file));
      toast.success("Image selected successfully!");
    }
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, tags: value });

    // Process input when space is pressed
    if (value.endsWith(" ")) {
      const newTag = value.trim();
      if (newTag && !newTag.startsWith("#")) {
        // Add hashtag if it doesn't start with one
        processHashtag("#" + newTag);
      } else if (newTag) {
        processHashtag(newTag);
      }
      setFormData({ ...formData, tags: "" });
    }
  };

  const processHashtag = (tag) => {
    // Don't add empty hashtags or just #
    if (tag.length > 1) {
      // Remove the hashtag if it's already in the list
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
    }
  };

  const handleKeyDown = (e) => {
    // Process hashtag on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = formData.tags.trim();
      if (newTag) {
        if (!newTag.startsWith("#")) {
          processHashtag("#" + newTag);
        } else {
          processHashtag(newTag);
        }
        setFormData({ ...formData, tags: "" });
      }
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (error) {
      // Handle other errors normally
      toast.error(message || "An error occurred!");

      // dispatch(clearError());
    }
    if (success) {
      toast.success(message);
      // dispatch(clearSuccess());
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [error, success, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if image is selected (required)
    if (!formData.postImage) {
      toast.error("Please select an image before posting!");
      alert("Image is required to create a post!");
      return;
    }

    // Create FormData object to handle multipart/form-data
    const postFormData = new FormData();
    postFormData.append("postImage", formData.postImage);
    postFormData.append("caption", formData.caption);
    postFormData.append("location", formData.location);
    postFormData.append("hashtags", JSON.stringify(hashtags));

    // Here you would dispatch the action to send the data
    // For example:
    const response = await dispatch(createPost(postFormData));
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`border-2 border-dashed ${
              !preview ? "border-red-300" : "border-gray-300"
            } rounded-lg p-4 flex justify-center items-center`}
            style={{ minHeight: "200px" }}
          >
            {preview ? (
              <div className="flex justify-center items-center w-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 max-w-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <Camera className="w-10 h-10 text-red-400 mb-3" />
                <p className="text-red-500 text-sm mb-2">* Image is required</p>
                <label className="bg-blue-500 text-white px-3 py-1.5 rounded-lg cursor-pointer text-sm">
                  Select Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    name="postImage"
                    required
                  />
                </label>
              </div>
            )}
          </div>

          <textarea
            placeholder="Write a caption..."
            value={formData.caption}
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
            className="w-full p-2 border rounded-lg text-sm"
            rows={3}
            name="caption"
          />

          <input
            type="text"
            placeholder="Add location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full p-2 border rounded-lg text-sm"
          />

          <div className="border rounded-lg p-2 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => removeHashtag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              ref={hashtagInputRef}
              type="text"
              placeholder="Add hashtags (press space or enter after each tag)"
              value={formData.tags}
              onChange={handleTagInput}
              onKeyDown={handleKeyDown}
              className="w-full border-none focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Create;
