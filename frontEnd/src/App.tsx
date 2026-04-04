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

  const handleAddNews = async () => {
    if (!title.trim() || !text.trim()) {
      return;
    }

    await fetch("http://localhost:8000/api/newsposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer ТВОЙ_ТОКЕН",
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>News</h1>

      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        />

        <textarea
          placeholder="Text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            minHeight: "100px",
          }}
        />

        <button onClick={handleAddNews}>Add News</button>
      </div>

      {news.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h2>{post.title}</h2>
          <p>{post.text}</p>
          <small>Author: {post.author?.email}</small>

          <br />
          <br />

          <button onClick={() => openEditModal(post)} style={{ marginRight: "10px" }}>
            Edit
          </button>

          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}

      {editingPost && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2>Edit Post</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
              }}
            />

            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                minHeight: "100px",
              }}
            />

            <button onClick={handleSaveEdit} style={{ marginRight: "10px" }}>
              Save
            </button>

            <button onClick={closeEditModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;