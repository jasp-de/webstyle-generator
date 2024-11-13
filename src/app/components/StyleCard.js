"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import StyleSheet from "./StyleSheet";

export default function StyleCard({ style, onUnlike, onDelete }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { text, info, css, tags } = style;
  const [isExpanded, setIsExpanded] = useState(false);
  const styleId = info.name.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (session) {
      // Check if user has liked this style
      fetch(`/api/styles/${style._id}/likes/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setIsLiked(data.isLiked));

      // Get like count
      fetch(`/api/styles/${style._id}/likes/count`)
        .then((res) => res.json())
        .then((data) => setLikeCount(data.count));
    }
  }, [style._id, session]);

  const copyToClipboard = (event) => {
    const button = event.currentTarget;
    navigator.clipboard.writeText(css).then(() => {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy CSS";
      }, 2000);
    });
  };

  const handleLike = async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          styleId: style._id,
          userId: session.user.id,
        }),
      });

      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));

      if (!data.liked && onUnlike) {
        onUnlike(style._id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    if (!session || session.user.id !== style.createdBy) return;

    try {
      const response = await fetch(`/api/styles/${style._id}`, {
        method: "DELETE",
      });

      if (response.ok && onDelete) {
        onDelete(style._id);
      }
    } catch (error) {
      console.error("Error deleting style:", error);
    }
  };

  return (
    <div className="style-card">
      <StyleSheet css={css} id={styleId} />
      <div className={`style-frame ${styleId}`}>
        <h1>{text.title}</h1>
        <p>{text.shortDescription}</p>
        <button>{text.buttonText}</button>
      </div>
      <div className="style-info">
        <div className="style-actions">
          <div className="style-name">{info.name}</div>
          <div className="action-buttons">
            {session && (
              <>
                <button
                  className={`like-button ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  ♥ <span className="like-count">{likeCount}</span>
                </button>
                {session.user.id === style.createdBy && (
                  <button className="delete-button" onClick={handleDelete}>
                    🗑️
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="style-details">
          <code>
            <strong>Font:</strong> {info.fontname}
            <br />
            <strong>Colors:</strong> {info.colorScheme}
            <br />
            <strong>Style:</strong> {info.style}
            <br />
            <strong>Features:</strong> {info.features}
          </code>
        </div>
        <div className="style-tags">
          {tags.map((tag, index) => (
            <span key={index} className="style-tag">
              {tag}
            </span>
          ))}
        </div>
        <button
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide CSS" : "Show CSS"}
        </button>
        <div
          className="expandable-section"
          style={{ display: isExpanded ? "block" : "none" }}
        >
          <pre>
            <code>{css}</code>
          </pre>
          <button className="copy-button" onClick={copyToClipboard}>
            Copy CSS
          </button>
        </div>
      </div>
    </div>
  );
}
