export const postData = [
  {
    id: "post_124",
    user: {
      id: "user_789",
      username: "jane_doe",
      profilePicture: "https://example.com/jane.jpg",
      isVerified: false,
      isFollowing: false,
    },
    content: {
      text: "Exploring the mountains! 🏔️",
      imageUrl:
        "https://www.sngwallpaper.com/wp-content/uploads/2023/12/Mix.4-24.webp",
      videoUrl: null,
      createdAt: "2023-10-16T09:00:00Z",
    },
    engagement: {
      likes: {
        count: 95,
        isLikedByMe: false,
        topLikedBy: ["user_456", "user_101"],
      },
      comments: {
        count: 10,
        preview: [
          {
            id: "comment_3",
            user: {
              id: "user_456",
              username: "john_doe",
              profilePicture: "https://example.com/profile.jpg",
            },
            text: "Wow, stunning! 😍",
            timestamp: "2023-10-16T09:05:00Z",
            isLikedByMe: true,
            likesCount: 7,
          },
          {
            id: "comment_4",
            user: {
              id: "user_101",
              username: "alice",
              profilePicture: "https://example.com/alice.jpg",
            },
            text: "Which mountain is this? 🏞️",
            timestamp: "2023-10-16T09:10:00Z",
            isLikedByMe: false,
            likesCount: 4,
          },
        ],
      },
      shares: {
        count: 5,
        isSharedByMe: true,
      },
    },
    metadata: {
      isSavedByMe: false,
      isReportedByMe: false,
      location: "Himalayas, India",
      tags: ["mountains", "nature", "adventure"],
    },
  },
  {
    id: "post_125",
    user: {
      id: "user_101",
      username: "alice",
      profilePicture: "https://example.com/alice.jpg",
      isVerified: true,
      isFollowing: true,
    },
    content: {
      text: "Coffee and books! ☕📚",
      imageUrl:
        "https://www.sngwallpaper.com/wp-content/uploads/2021/05/Ali-10-Natue-page-016.jpg",
      videoUrl: null,
      createdAt: "2023-10-17T10:00:00Z",
    },
    engagement: {
      likes: {
        count: 150,
        isLikedByMe: true,
        topLikedBy: ["user_456", "user_789"],
      },
      comments: {
        count: 20,
        preview: [
          {
            id: "comment_5",
            user: {
              id: "user_456",
              username: "john_doe",
              profilePicture: "https://example.com/profile.jpg",
            },
            text: "Perfect combo! 😊",
            timestamp: "2023-10-17T10:05:00Z",
            isLikedByMe: true,
            likesCount: 10,
          },
          {
            id: "comment_6",
            user: {
              id: "user_789",
              username: "jane_doe",
              profilePicture: "https://example.com/jane.jpg",
            },
            text: "What are you reading? 📖",
            timestamp: "2023-10-17T10:10:00Z",
            isLikedByMe: false,
            likesCount: 6,
          },
        ],
      },
      shares: {
        count: 12,
        isSharedByMe: false,
      },
    },
    metadata: {
      isSavedByMe: true,
      isReportedByMe: false,
      location: "Café, Paris",
      tags: ["coffee", "books", "relax"],
    },
  },
  {
    id: "post_126",
    user: {
      id: "user_789",
      username: "jane_doe",
      profilePicture: "https://example.com/jane.jpg",
      isVerified: false,
      isFollowing: true,
    },
    content: {
      text: "Beach vibes! 🏖️",
      imageUrl:
        "https://www.sngwallpaper.com/wp-content/uploads/2021/05/3D-beach-sea-mural.jpg",
      videoUrl: null,
      createdAt: "2023-10-18T11:00:00Z",
    },
    engagement: {
      likes: {
        count: 200,
        isLikedByMe: false,
        topLikedBy: ["user_101", "user_456"],
      },
      comments: {
        count: 25,
        preview: [
          {
            id: "comment_7",
            user: {
              id: "user_101",
              username: "alice",
              profilePicture: "https://example.com/alice.jpg",
            },
            text: "So relaxing! 🌊",
            timestamp: "2023-10-18T11:05:00Z",
            isLikedByMe: true,
            likesCount: 8,
          },
          {
            id: "comment_8",
            user: {
              id: "user_456",
              username: "john_doe",
              profilePicture: "https://example.com/profile.jpg",
            },
            text: "Wish I was there! 😎",
            timestamp: "2023-10-18T11:10:00Z",
            isLikedByMe: false,
            likesCount: 5,
          },
        ],
      },
      shares: {
        count: 15,
        isSharedByMe: true,
      },
    },
    metadata: {
      isSavedByMe: false,
      isReportedByMe: false,
      location: "Maldives",
      tags: ["beach", "vacation", "relax"],
    },
  },
  {
    id: "post_127",
    user: {
      id: "user_456",
      username: "john_doe",
      profilePicture: "https://example.com/profile.jpg",
      isVerified: true,
      isFollowing: false,
    },
    content: {
      text: "City lights at night! 🌃",
      imageUrl:
        "https://www.sngwallpaper.com/wp-content/uploads/2021/05/Waterfall-landscape.jpg",
      videoUrl: null,
      createdAt: "2023-10-19T12:00:00Z",
    },
    engagement: {
      likes: {
        count: 180,
        isLikedByMe: true,
        topLikedBy: ["user_789", "user_101"],
      },
      comments: {
        count: 18,
        preview: [
          {
            id: "comment_9",
            user: {
              id: "user_789",
              username: "jane_doe",
              profilePicture: "https://example.com/jane.jpg",
            },
            text: "Beautiful! 😍",
            timestamp: "2023-10-19T12:05:00Z",
            isLikedByMe: false,
            likesCount: 9,
          },
          {
            id: "comment_10",
            user: {
              id: "user_101",
              username: "alice",
              profilePicture: "https://example.com/alice.jpg",
            },
            text: "Which city is this? 🌆",
            timestamp: "2023-10-19T12:10:00Z",
            isLikedByMe: true,
            likesCount: 7,
          },
        ],
      },
      shares: {
        count: 10,
        isSharedByMe: false,
      },
    },
    metadata: {
      isSavedByMe: true,
      isReportedByMe: false,
      location: "New York, USA",
      tags: ["city", "night", "lights"],
    },
  },
  {
    id: "post_128",
    user: {
      id: "user_101",
      username: "alice",
      profilePicture: "https://example.com/alice.jpg",
      isVerified: true,
      isFollowing: true,
    },
    content: {
      text: "Morning workout! 💪",
      imageUrl:
        "https://www.sngwallpaper.com/wp-content/uploads/2023/12/Mix.4-26.webp",
      videoUrl: null,
      createdAt: "2023-10-20T07:00:00Z",
    },
    engagement: {
      likes: {
        count: 220,
        isLikedByMe: false,
        topLikedBy: ["user_456", "user_789"],
      },
      comments: {
        count: 30,
        preview: [
          {
            id: "comment_11",
            user: {
              id: "user_456",
              username: "john_doe",
              profilePicture: "https://example.com/profile.jpg",
            },
            text: "Stay fit! 💯",
            timestamp: "2023-10-20T07:05:00Z",
            isLikedByMe: true,
            likesCount: 12,
          },
          {
            id: "comment_12",
            user: {
              id: "user_789",
              username: "jane_doe",
              profilePicture: "https://example.com/jane.jpg",
            },
            text: "What's your routine? 🏋️‍♀️",
            timestamp: "2023-10-20T07:10:00Z",
            isLikedByMe: false,
            likesCount: 8,
          },
        ],
      },
      shares: {
        count: 20,
        isSharedByMe: true,
      },
    },
    metadata: {
      isSavedByMe: false,
      isReportedByMe: false,
      location: "Gym, London",
      tags: ["workout", "fitness", "health"],
    },
  },
];
