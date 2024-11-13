"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import StyleSheet from "./StyleSheet";

export default function StyleCard({ style, onUnlike, onDelete }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    style.likedBy?.includes(session?.user?.id) || false
  );
  const likeCount = style.likedBy?.length || 0;
  const { text, info, css, tags } = style;
  const [isExpanded, setIsExpanded] = useState(false);
  const styleId = info.name.toLowerCase().replace(/\s+/g, "-");
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (session && style._id) {
      const controller = new AbortController();
      const { signal } = controller;

      const fetchData = async () => {
        try {
          const [likeStatus, likeCount] = await Promise.all([
            fetch(`/api/styles/${style._id}/likes/${session.user.id}`, {
              signal,
            }),
            fetch(`/api/styles/${style._id}/likes/count`, { signal }),
          ]);

          if (!likeStatus.ok || !likeCount.ok) {
            throw new Error("Failed to fetch like data");
          }

          const [likeData, countData] = await Promise.all([
            likeStatus.json(),
            likeCount.json(),
          ]);

          setIsLiked(likeData.isLiked);
          setLikeCount(countData.count);
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching style data:", error);
          }
        }
      };

      fetchData();
      return () => controller.abort();
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
    if (!session || isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`/api/styles/${style._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        if (!newIsLiked && onUnlike) {
          onUnlike(style._id);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
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
                  <span className="like-count">{likeCount}</span> ♥
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
