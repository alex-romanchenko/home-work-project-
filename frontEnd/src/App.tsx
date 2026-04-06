import { useEffect, useState } from "react";
import "./App.css";

type NewsPost = {
  id: number;
  header: string;
  text: string;
  author: {
    id: number;
    email: string;
  };
};

function App() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");

  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [editHeader, setEditHeader] = useState("");
  const [editText, setEditText] = useState("");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserEmail, setCurrentUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loadNews = () => {
    fetch("http://localhost:8000/api/newsposts")
      .then((res) => res.json())
      .then((data) => setNews(data));
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleRegister = async () => {
    setErrorMessage("");

    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", registerEmail);
      setToken(data.token);
      setCurrentUserEmail(registerEmail);
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } else {
      setErrorMessage(data.error || "Register failed");
    }
  };

  const handleLogin = async () => {
    setErrorMessage("");

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", loginEmail);
      setToken(data.token);
      setCurrentUserEmail(loginEmail);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setErrorMessage(data.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken("");
    setCurrentUserEmail("");
  };

  const handleAddNews = async () => {
    if (!header.trim() || !text.trim() || !token) return;

    await fetch("http://localhost:8000/api/newsposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ header, text }),
    });

    setHeader("");
    setText("");
    loadNews();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/newsposts/${id}`, {
      method: "DELETE",
    });

    loadNews();
  };

  const openEditModal = (post: NewsPost) => {
    setEditingPost(post);
    setEditHeader(post.header);
    setEditText(post.text);
  };

  const closeEditModal = () => {
    setEditingPost(null);
    setEditHeader("");
    setEditText("");
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    await fetch(`http://localhost:8000/api/newsposts/${editingPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: editHeader,
        text: editText,
      }),
    });

    closeEditModal();
    loadNews();
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">News App</h1>

        {!token ? (
          <div className="card auth-card">
            <div className="tabs">
              <button
                className={authMode === "login" ? "tab active" : "tab"}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={authMode === "register" ? "tab active" : "tab"}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <>
                <h2 className="section-title">Login</h2>
                <input
                  className="input"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleLogin}>
                  Login
                </button>
              </>
            ) : (
              <>
                <h2 className="section-title">Register</h2>
                <input
                  className="input"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Confirm password"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </>
            )}

            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
        ) : (
          <>
            <div className="card topbar">
              <div>
                Logged in as: <strong>{currentUserEmail}</strong>
              </div>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="card create-card">
              <h2 className="section-title">Create post</h2>
              <input
                className="input"
                placeholder="Header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
              />
              <textarea
                className="input textarea"
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddNews}>
                Add News
              </button>
            </div>
          </>
        )}

        <div className="posts">
          {news.map((post) => {
            const isAuthor = currentUserEmail === post.author?.email;

            return (
              <div className="card post-card" key={post.id}>
                <h2 className="post-header">{post.header}</h2>
                <p className="post-text">{post.text}</p>
                <small className="post-author">Author: {post.author?.email}</small>

                {isAuthor && (
                  <div className="post-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => openEditModal(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {editingPost && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="section-title">Edit post</h2>
            <input
              className="input"
              value={editHeader}
              onChange={(e) => setEditHeader(e.target.value)}
            />
            <textarea
              className="input textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;