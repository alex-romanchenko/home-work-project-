import { useEffect, useState } from "react";

type NewsPost = {
  id: number;
  title: string;
  text: string;
  createDate: string;
};

function App() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

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
          <small>{post.createDate}</small>

          <br />
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;