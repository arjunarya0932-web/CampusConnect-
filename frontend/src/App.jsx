import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [unreadNotifications, setUnreadNotifications] = useState(0);
  


  function getTimeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);

  const difference = Math.floor(
    (now - postDate) / 1000
  );

  if (difference < 60) {
    return "Just now";
  }

  const minutes = Math.floor(difference / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return postDate.toLocaleDateString();
}
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {  

  const savedUser = localStorage.getItem("campusUser");
  return savedUser ? JSON.parse(savedUser) : null;
});

useEffect(() => {
  if (!currentUser) {
    setNotifications([]);
    setUnreadNotifications(0);
    return;
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("campusToken");

      if (!token) return;

      const response = await fetch(
        "https://campusconnect-3-6i2z.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const notificationList = data.notifications || [];

        setNotifications(notificationList);
        setUnreadNotifications(
          notificationList.filter(
            (notification) => !notification.read
          ).length
        );
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  fetchNotifications();
}, [currentUser]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState(""); 
  const [activePage, setActivePage] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [college, setCollege] = useState(
  () => localStorage.getItem("campusCollege") || "My College"
);

const [course, setCourse] = useState(
  () => localStorage.getItem("campusCourse") || "Computer Science"
);

const [semester, setSemester] = useState(
  () => localStorage.getItem("campusSemester") || "4th Semester"
);

const [bio, setBio] = useState(
  () => localStorage.getItem("campusBio") || ""
);
  const [newPost, setNewPost] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [alexComment, setAlexComment] = useState("");
  const [alexComments, setAlexComments] = useState([]);  
  const [riyaComment, setRiyaComment] = useState("");
  const [riyaComments, setRiyaComments] = useState([]);
  const [karanComment, setKaranComment] = useState("");
  const [karanComments, setKaranComments] = useState([]);
  const [showTopButton, setShowTopButton] = useState(false);
 const toggleLike = async (postId) => {
  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  try {
    const response = await fetch(
     `https://campusconnect-3-6i2z.onrender.com/api/posts/${postId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update like.");
      return;
    }

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: data.likes.includes(currentUser.name),
    }));
  } catch (error) {
    console.error(error);
    alert("Could not connect to server.");
  }
};
const deletePost = async (postId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://campusconnect-3-6i2z.onrender.com/api/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete post.");
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== postId)
    );
  } catch (error) {
    console.error(error);
    alert("Could not connect to server.");
  }
};
const toggleSave = async (postId) => {
  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  try {
 const response = await fetch(
  `https://campusconnect-3-6i2z.onrender.com/api/posts/${postId}/save`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
    },
    body: JSON.stringify({}),
  }
);

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update save.");
      return;
    }

    setSavedPosts((prev) => ({
      ...prev,
      [postId]: data.saves.includes(currentUser.name),
    }));
  } catch (error) {
    console.error(error);
    alert("Could not connect to server.");
  }
};
useEffect(() => {

  const loadPosts = async () => {
    try {
      const response = await fetch(
        "https://campusconnect-3-6i2z.onrender.com/api/posts"
      );

      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || data);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  loadPosts();
}, []);
useEffect(() => {
  if (!currentUser) {
    setLikedPosts({});
    return;
  }

  const nextLikedPosts = {};

  posts.forEach((post) => {
    nextLikedPosts[post._id] =
      (post.likes || []).includes(currentUser.name);
  });

  setLikedPosts(nextLikedPosts);
}, [posts, currentUser]);
useEffect(() => {
  if (!currentUser) {
    setSavedPosts({});
    return;
  }

  const nextSavedPosts = {};

  posts.forEach((post) => {
    nextSavedPosts[post._id] =
      (post.saves || []).includes(currentUser.name);
  });

  setSavedPosts(nextSavedPosts);
}, [posts, currentUser]);
useEffect(() => {
  const loadComments = async () => {
    try {
      const commentsData = {};

      for (const post of posts) {
        const response = await fetch(
          `https://campusconnect-3-6i2z.onrender.com/api/comments/${post._id}`
        );

        const data = await response.json();

        if (response.ok) {
          commentsData[post._id] = data.comments || [];
        }
      }

      setComments(commentsData);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  if (posts.length > 0) {
    loadComments();
  }
}, [posts]);
useEffect(() => {
  const handleScroll = () => {
    setShowTopButton(window.scrollY > 400);
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">CampusConnect</div>

        <nav>
          <a
  href="#home"
  onClick={() => setActivePage("home")}
>
  Home
</a>
         <a
  href="#features"
  onClick={() => setActivePage("community")}
>
  Features
</a>
        <a
  href="#community"
  onClick={() => setActivePage("community")}
>
  Community
</a>
       {currentUser ? (
  <>
    <span className="user-welcome">
      Hi, {currentUser.name}
    </span>

<button
  className="login-btn notification-btn"
  onClick={async () => {
    const willOpen = !showNotifications;
    setShowNotifications(willOpen);

    if (willOpen && unreadNotifications > 0) {
      try {
        const token = localStorage.getItem("campusToken");

        const response = await fetch(
          "https://campusconnect-3-6i2z.onrender.com/api/notifications/read",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setNotifications((previous) =>
            previous.map((notification) => ({
              ...notification,
              read: true,
            }))
          );
          setUnreadNotifications(0);
        }
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  }}
>
  🔔
  {unreadNotifications > 0 && (
    <span className="notification-badge">
      {unreadNotifications}
    </span>
  )}
</button>

<button
  className="login-btn"
  onClick={() =>
    document.getElementById("profile")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Profile
</button>

   <button
  className="login-btn"
 onClick={() => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  localStorage.removeItem("campusUser");
  localStorage.removeItem("campusToken");
  localStorage.removeItem("campusCollege");
  localStorage.removeItem("campusCourse");
  localStorage.removeItem("campusSemester");
  localStorage.removeItem("campusBio");

  setCurrentUser(null);
}}
>

  Logout
</button>
  </>
) : (
  <button className="login-btn" onClick={() => setShowLogin(true)}>
    Login
  </button>
)}
        </nav>
      </header>

{showNotifications && currentUser && (
  <div className="notifications-panel">
    <h3>Notifications</h3>

    {notifications.length === 0 ? (
      <p>No notifications yet.</p>
    ) : (
      notifications.map((notification) => (
        <div
          className={`notification-item ${
            notification.read ? "read" : "unread"
          }`}
          key={notification._id}
        >
          <p>{notification.message}</p>
          <small>{getTimeAgo(notification.createdAt)}</small>
        </div>
      ))
    )}
  </div>
)}

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="tag">YOUR COLLEGE. YOUR COMMUNITY.</p>

            <h1>
              Connect. Learn.
              <span> Grow Together.</span>
            </h1>

            <p className="hero-text">
              A college community platform where students can share
              resources, ask questions, discover events and stay connected.
            </p>

            <div className="hero-buttons">
             <button
  className="primary-btn"
  onClick={() => {
    if (currentUser) {
      document.getElementById("community")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setShowLogin(true);
    }
  }}
>
  Join CampusConnect
</button>
             <button
  className="secondary-btn"
  onClick={() =>
    document.getElementById("community")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Explore Community
</button>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-top">
              <span>Campus Feed</span>
              <span className="online">● Live</span>
            </div>

            <div className="feed-item">
              <div className="avatar">A</div>
              <div>
                <h4>Alex posted a question</h4>
                <p>Can anyone explain deadlock in OS?</p>
              </div>
            </div>

            <div className="feed-item">
              <div className="avatar blue">R</div>
              <div>
                <h4>Riya shared notes</h4>
                <p>Computer Networks - Unit 3</p>
              </div>
            </div>

            <div className="feed-item">
              <div className="avatar purple">K</div>
              <div>
                <h4>Hackathon 2026</h4>
                <p>Registration is now open</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <p className="tag">EVERYTHING IN ONE PLACE</p>
            <h2>Built for student life</h2>
            <p>
              Everything students need to connect, collaborate and learn.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon">📢</div>
              <h3>College Notices</h3>
              <p>
                Stay updated with important announcements from your college.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">📚</div>
              <h3>Study Resources</h3>
              <p>
                Share and discover notes, PDFs, previous papers and useful
                resources.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">💬</div>
              <h3>Doubt Discussions</h3>
              <p>
                Ask questions, get answers and discuss topics with other
                students.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">🎓</div>
              <h3>Campus Events</h3>
              <p>
                Discover workshops, hackathons, seminars and college events.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">🔎</div>
              <h3>Smart Search</h3>
              <p>
                Quickly find students, discussions, resources and campus
                updates.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">👥</div>
              <h3>Student Community</h3>
              <p>
                Connect with students from your college and build your network.
              </p>
            </div>
          </div>
        </section>
<section className="community-feed" id="community">
  <div className="section-heading">
    <p className="tag">CAMPUS COMMUNITY</p>
    <h2>What’s happening on campus?</h2>
    <p>Ask questions, share resources and connect with students.</p>
  </div>
  {postSuccess && (
  <div className="post-success-message">
    {postSuccess}
  </div>
)}
<div className="create-post-box">
<input
  type="text"
  placeholder="What do you want to share with your campus?"
  value={newPost}
  onChange={(e) => setNewPost(e.target.value)}
  onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    e.currentTarget.parentElement
      .querySelector(".primary-btn")
      ?.click();
  }
}}
/>

 <button
  className="primary-btn"
onClick={async () => {
  if (!newPost.trim()) return;

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  try {
    const response = await fetch(
      "https://campusconnect-3-6i2z.onrender.com/api/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
        },
        body: JSON.stringify({
          content: newPost,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to create post.");
      return;
    }

    setPosts((prevPosts) => [data.post, ...prevPosts]);
    setNewPost("");
    setPostSuccess("Post created successfully!");
    setTimeout(() => {
  setPostSuccess("");
}, 3000);
   
  } catch (error) {
    console.error(error);
    alert("Could not connect to server.");
  }
}}
>
  Create Post
</button>
</div>
<div className="search-box">
  <input
    type="text"
    placeholder="🔍 Search posts or authors..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

<div className="feed-posts">
   {posts
  .filter((post) =>
    (post.content + " " + post.author)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((post, index) => (
 <div className="post-card" key={post._id}>
    <div className="post-header">
     <div className="avatar">
  {post.author?.charAt(0).toUpperCase()}
</div>

<div>
  <h3>{post.author}</h3>
<span>
  Computer Science • {getTimeAgo(post.createdAt)}
</span>
</div>
    </div>

   <p className="post-content">{post.content}</p>

    <div className="post-actions">
<button onClick={() => toggleLike(post._id)}>
 {likedPosts[post._id] ? "♥ Liked" : "♡ Like"}
</button>
      <button
  onClick={() =>
    document
      .getElementById(`comment-input-${post._id}`)
      ?.focus()
  }
>
  💬 Comment
</button>
      <div className="comment-box">
  <input
    type="text"
    id={`comment-input-${post._id}`}
    placeholder="Write a comment..."
    value={commentText[post._id] || ""}
    onChange={(e) =>
      setCommentText((prev) => ({
        ...prev,
        [post._id]: e.target.value,
      }))
    }
  />

  <button
    onClick={async () => {
      if (!currentUser) {
        alert("Please login first.");
        return;
      }

      if (!commentText[post._id]?.trim()) {
        return;
      }

      try {
        const response = await fetch(
          "https://campusconnect-3-6i2z.onrender.com/api/comments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
  },
            body: JSON.stringify({
              postId: post._id,
              content: commentText[post._id],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to add comment.");
          return;
        }

        setComments((prev) => ({
          ...prev,
          [post._id]: [
            ...(prev[post._id] || []),
            data.comment,
          ],
        }));

        setCommentText((prev) => ({
          ...prev,
          [post._id]: "",
        }));
      } catch (error) {
        console.error(error);
        alert("Could not connect to server.");
      }
    }}
  >
    Comment
  </button>
</div>
{(comments[post._id] || []).map((comment) => (
  <div className="comment-item" key={comment._id}>
    <strong>{comment.author}</strong>
    <span>{comment.content}</span>
  </div>
))}
     <button onClick={() => toggleSave(post._id)}>
 {savedPosts[post._id] ? "🔖 Saved" : "🔖 Save"}
</button>
{currentUser && currentUser.name === post.author && (
  <button
    className="delete-btn"
    onClick={() => deletePost(post._id)}
  >
    🗑 Delete
  </button>
)}
    </div>
  </div>
))}

  </div>
</section>
       <section className="community" id="get-started">
          <div>
            <p className="tag">CAMPUSCONNECT</p>
            <h2>Your campus, connected.</h2>
            <p>
              One platform for your college community, academics and
              opportunities.
            </p>
          </div>

<button
  className="primary-btn"
  onClick={() => {
    if (currentUser) {
      document.getElementById("community")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setShowLogin(true);
    }
  }}
>
  Get Started
</button>
        </section>
       <section className="profile-section" id="profile">
  <div className="section-heading">
    <p className="tag">MY PROFILE</p>
    <h2>Student Profile</h2>
    <p>Your CampusConnect student profile.</p>
  </div>

  <div className="profile-card">
    <div className="profile-avatar">
      {currentUser ? currentUser.name.charAt(0).toUpperCase() : "Y"}
    </div>

    <h3>
      {currentUser ? currentUser.name : "Student"}
    </h3>

    <p>
      {currentUser ? currentUser.email : "Login to see your profile"}
    </p>
    <button
  className="primary-btn profile-edit-btn"
  onClick={() => setEditProfile(true)}
>
  Edit Profile
</button>
{editProfile && (
  <div className="profile-edit-form">
    <input
  type="text"
  placeholder="College name"
  value={college}
  onChange={(e) => setCollege(e.target.value)}
/>
<input
  type="text"
  placeholder="Course"
  value={course}
  onChange={(e) => setCourse(e.target.value)}
/>
  <input
  type="text"
  placeholder="Semester"
  value={semester}
  onChange={(e) => setSemester(e.target.value)}
/>

   <textarea
  placeholder="Write something about yourself..."
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>

 <button
  className="primary-btn"
onClick={async () => {
  try {
    const response = await fetch(
      `https://campusconnect-3-6i2z.onrender.com/api/auth/profile/${currentUser.id}`,
      {
        method: "PUT",
           headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("campusToken")}`,
        },
        body: JSON.stringify({
          college,
          course,
          semester,
          bio,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Profile update failed");
      return;
    }

    localStorage.setItem("campusCollege", college);
    localStorage.setItem("campusCourse", course);
    localStorage.setItem("campusSemester", semester);
    localStorage.setItem("campusBio", bio);

    setEditProfile(false);
    alert("Profile updated successfully!");
  } catch (error) {
    console.error(error);
    alert("Could not connect to server.");
  }
}}
>
  Save Profile
</button>
  </div>
)}
{bio && (
  <div className="profile-bio">
    <span>About</span>
    <p>{bio}</p>
  </div>
)}
    <div className="profile-info">
      <div>
        <span>College</span>
    <strong>{college}</strong>
      </div>

      <div>
        <span>Course</span>
        <strong>{course}</strong>
      </div>

      <div>
        <span>Semester</span>
        <strong>{semester}</strong>
      </div>
    </div>
  </div>
</section>
        {showLogin && (
  <div className="login-overlay">
    <div className="login-modal">
      <button
        className="close-login"
        onClick={() => setShowLogin(false)}
      >
        ×
      </button>

      <p className="tag">WELCOME BACK</p>
      <h2>Login to CampusConnect</h2>
      <p className="login-subtitle">
        Connect with your college community.
      </p>

      <input
  type="email"
  placeholder="College email"
  value={loginEmail}
  onChange={(e) => setLoginEmail(e.target.value)}
/>

      <input
  type="password"
  placeholder="Password"
  value={loginPassword}
  onChange={(e) => setLoginPassword(e.target.value)}
/>

      <button
  className="primary-btn login-submit"
  onClick={async () => {

    if (!loginEmail.trim() || !loginPassword.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "https://campusconnect-3-6i2z.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      setCurrentUser(data.user);
      setCollege(data.user.college || "My College");
setCourse(data.user.course || "Computer Science");
setSemester(data.user.semester || "4th Semester");
setBio(data.user.bio || "");
      localStorage.setItem("campusUser", JSON.stringify(data.user));
      localStorage.setItem("campusToken", data.token || "");
      localStorage.setItem("campusCollege", data.user.college || "My College");
localStorage.setItem("campusCourse", data.user.course || "Computer Science");
localStorage.setItem("campusSemester", data.user.semester || "4th Semester");
localStorage.setItem("campusBio", data.user.bio || "");
      alert(`Welcome back, ${data.user.name}!`);
      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  }}
>
  Login
</button>

    <p className="signup-text">
  New here?{" "}
  <span
    onClick={() => {
      setShowLogin(false);
      setShowSignup(true);
    }}
  >
    Sign up
  </span>
</p>
    </div>
  </div>
)}
        {showSignup && (
          <div className="login-overlay">
            <div className="login-modal">
              <button
                className="close-login"
                onClick={() => setShowSignup(false)}
              >
                ×
              </button>

              <p className="tag">JOIN CAMPUSCONNECT</p>
              <h2>Create your account</h2>

              <p>
                Join your college community and start connecting.
              </p>

             <input
              type="text"
             placeholder="Full name"
             value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
/>
              <input
  type="email"
  placeholder="College email"
  value={signupEmail}
  onChange={(e) => setSignupEmail(e.target.value)}
/>
              <input
  type="password"
  placeholder="Create password"
  value={signupPassword}
  onChange={(e) => setSignupPassword(e.target.value)}
/>

              <button
  className="primary-btn login-submit"
  onClick={async () => {
    if (
      !signupName.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://campusconnect-3-6i2z.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: signupName,
            email: signupEmail,
            password: signupPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed.");
        return;
      }

      alert("Account created successfully!");

      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setShowSignup(false);
    } catch (error) {
      console.error(error);
      alert("Could not connect to server.");
    }
  }}
>
  Create Account
</button>

              <p className="signup-text">
                Already have an account?{" "}
               <button
  type="button"
  onClick={() => {
    setShowSignup(false);
    setShowLogin(true);
  }}
  style={{
    border: "none",
    background: "none",
    padding: 0,
    color: "#5146e5",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "inherit",
  }}
>
  Login
</button>
              </p>
            </div>
          </div>
        )}
              {showTopButton && (
        <button
          className="back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          ↑
        </button>
      )}
      </main>

      <footer>
        <p>© 2026 CampusConnect. Built for students.</p>
      </footer>
    </div>
  );
}

export default App;
