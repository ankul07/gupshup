import React from "react";

const HashtagCloud = ({ tags }) => {
  // Sort tags by frequency (value)
  const sortedTags = [...tags].sort((a, b) => b.value - a.value);

  // Function to determine the font size based on tag frequency
  const getFontSize = (count) => {
    const min = Math.min(...tags.map((tag) => tag.value));
    const max = Math.max(...tags.map((tag) => tag.value));

    // Scale between 0.8rem and 2rem
    const size = 0.8 + ((count - min) / (max - min || 1)) * 1.2;
    return `${size}rem`;
  };

  // Function to assign a color based on tag frequency
  const getColor = (count) => {
    const min = Math.min(...tags.map((tag) => tag.value));
    const max = Math.max(...tags.map((tag) => tag.value));

    // Colors for different frequency ranges
    const colors = [
      "text-gray-500", // Least frequent
      "text-blue-500",
      "text-green-500",
      "text-yellow-500",
      "text-red-500", // Most frequent
    ];

    const index = Math.floor(
      ((count - min) / (max - min || 1)) * (colors.length - 1)
    );
    return colors[index];
  };

  return (
    <div className="p-2 flex flex-wrap justify-center gap-2">
      {sortedTags.map((tag, index) => (
        <div
          key={index}
          className={`${getColor(
            tag.value
          )} cursor-pointer hover:underline px-2 py-1`}
          style={{ fontSize: getFontSize(tag.value) }}
        >
          #{tag.text}{" "}
          <span className="text-xs text-gray-500">({tag.value})</span>
        </div>
      ))}

      {tags.length === 0 && (
        <div className="text-gray-500 text-center p-4">No hashtags found</div>
      )}
    </div>
  );
};

export default HashtagCloud;
