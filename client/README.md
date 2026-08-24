src/
│
├── pages/
│   │
│   ├── home/
│   │   └── Home.jsx
│   │
│   ├── profile/
│   │   ├── index.jsx
│   │   ├── profile-page/
│   │   │   ├── ProfileSection.jsx
│   │   │   ├── ProfileTab.jsx
│   │   │   └── ProfilePost.jsx
│   │   └── skeleton/
│   │       ├── ProfileSkeleton.jsx
│   │       └── ProfilePostSkeleton.jsx
│   │
│   └── ...
│
├── components/
│   │
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── DesktopSidebar.jsx
│   │   ├── MobileBottomNav.jsx
│   │   ├── RightSidebar.jsx
│   │   └── NavItem.jsx
│   │
│   ├── post/
│   │   ├── PostCard.jsx
│   │   ├── PostActions.jsx
│   │   ├── PostMenu.jsx
│   │   ├── PostComposer.jsx
│   │   └── PostSkeleton.jsx
│   │
│   ├── sidebar/
│   │   ├── TrendingTopics.jsx
│   │   └── WhoToFollow.jsx
│   │
│   ├── shared/
│   │   ├── ErrorState.jsx
│   │   ├── EmptyState.jsx
│   │   └── ...
│   │
│   └── ui/
│       ├── avatar.jsx
│       ├── button.jsx
│       ├── skeleton.jsx
│       └── ...
│
├── hooks/
│   ├── useHomeFeed.js
│   ├── useProfile.js
│   └── ...
│
├── services/
│   ├── postService.js
│   ├── userService.js
│   └── ...
│
├── context/
│   └── AuthContext.jsx
│
└── lib/
    └── formatter.js
