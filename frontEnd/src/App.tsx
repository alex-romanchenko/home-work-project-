import { useEffect, useState } from "react";

type NewsPost = {
  id: number;
  title: string;
  text: string;
  author: {
    id: number;
    email: string;
  };
};

function App() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserEmail, setCurrentUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [errorMessage, setErrorMessage] = useState("");

  const loadNews = () => {
    fetch("http://localhost:8000/api/newsposts")
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
      });
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleRegister = async () => {
    setErrorMessage("");

    const response = await fetch("http://localhost:8000/auth/register", {
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

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", registerEmail);
      setToken(data.token);
      setCurrentUserEmail(registerEmail);

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } else {
      setErrorMessage("Register failed");
    }
  };

  const handleLogin = async () => {
  setErrorMessage("");

  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  });

  const data = await response.json();
  console.log("login response:", data);

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", loginEmail);
    setToken(data.token);
    setCurrentUserEmail(loginEmail);

    setLoginEmail("");
    setLoginPassword("");
  } else {
    setErrorMessage(data.message || data.error || "Login failed");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken("");
    setCurrentUserEmail("");
  };

  const handleAddNews = async () => {
    if (!title.trim() || !text.trim() || !token) {
      return;
    }

    await fetch("http://localhost:8000/api/newsposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title, text }),
    });

    setTitle("");
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
    setEditTitle(post.title);
    setEditText(post.text);
  };

  const closeEditModal = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditText("");
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    if (!editTitle.trim() || !editText.trim()) return;

    await fetch(`http://localhost:8000/api/newsposts/${editingPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        text: editText,
      }),
    });

    closeEditModal();
    loadNews();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>News App</h1>

        {!token ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              marginBottom: "30px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                onClick={() => setAuthMode("login")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: authMode === "login" ? "#222" : "#ddd",
                  color: authMode === "login" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>

              <button
                onClick={() => setAuthMode("register")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: authMode === "register" ? "#222" : "#ddd",
                  color: authMode === "register" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <>
                <h2 style={{ marginBottom: "16px" }}>Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={inputStyle}
                />
                <button onClick={handleLogin} style={mainButtonStyle}>
                  Login
                </button>
              </>
            ) : (
              <>
                <h2 style={{ marginBottom: "16px" }}>Register</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
                <button onClick={handleRegister} style={mainButtonStyle}>
                  Register
                </button>
              </>
            )}

            {errorMessage && (
              <p style={{ color: "crimson", marginTop: "12px" }}>{errorMessage}</p>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                Logged in as: <strong>{currentUserEmail}</strong>
              </div>
              <button onClick={handleLogout} style={secondaryButtonStyle}>
                Logout
              </button>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginBottom: "30px",
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>Create post</h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
                }}
              />
              <button onClick={handleAddNews} style={mainButtonStyle}>
                Add News
              </button>
            </div>
          </>
        )}

        <div>
          {news.map((post) => {
            const isAuthor = currentUserEmail === post.author?.email;

            return (
              <div
                key={post.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  marginBottom: "16px",
                }}
              >
                <h2 style={{ marginBottom: "10px" }}>{post.title}</h2>
                <p style={{ marginBottom: "10px" }}>{post.text}</p>
                <small style={{ color: "#666" }}>
                  Author: {post.author?.email}
                </small>

                {isAuthor && (
                  <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                    <button onClick={() => openEditModal(post)} style={secondaryButtonStyle}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post.id)} style={dangerButtonStyle}>
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Edit post</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={inputStyle}
            />

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                ...inputStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSaveEdit} style={mainButtonStyle}>
                Save
              </button>
              <button onClick={closeEditModal} style={secondaryButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "12px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box" as const,
};

const mainButtonStyle = {
  padding: "10px 16px",
  background: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  background: "#ddd",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const dangerButtonStyle = {
  padding: "10px 16px",
  background: "crimson",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default App;