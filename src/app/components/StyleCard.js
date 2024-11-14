"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import StyleSheet from "./StyleSheet";
import SignInPopup from "./SignInPopup";

export default function StyleCard({ style, onUnlike, onDelete }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    style.likedBy?.includes(session?.user?.id) || false
  );
  const [likeCount, setLikeCount] = useState(style.likedBy?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { text, info, css, tags } = style;
  const [isExpanded, setIsExpanded] = useState(false);
  const styleId = info.name.toLowerCase().replace(/\s+/g, "-");

  const handleLike = async () => {
    if (!session) {
      setShowSignIn(true);
      return;
    }

    if (isLiking) return;
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
        setLikeCount((prev) => prev + (newIsLiked ? 1 : -1));

        if (!newIsLiked && onUnlike) {
          onUnlike(style._id);
        }

        window.dispatchEvent(
          new CustomEvent("likeStatusChanged", {
            detail: { styleId: style._id, isLiked: newIsLiked },
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const copyToClipboard = (event) => {
    const button = event.currentTarget;
    navigator.clipboard.writeText(css).then(() => {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy CSS";
      }, 2000);
    });
  };

  const handleDelete = async () => {
    if (!session || session.user.id !== style.createdBy) return;

    try {
      const response = await fetch(`/api/styles/${style._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onDelete) {
          onDelete(style._id);
        }
        // Dispatch event to refresh all tabs
        window.dispatchEvent(
          new CustomEvent("styleDeleted", {
            detail: { styleId: style._id },
          })
        );
      }
    } catch (error) {
      console.error("Error deleting style:", error);
    }
  };

  return (
    <div className="style-card">
      {showSignIn && <SignInPopup onClose={() => setShowSignIn(false)} />}
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
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
            >
              <span className="like-count">{likeCount}</span> ♥
            </button>
            {session && session.user.id === style.createdBy && (
              <button className="delete-button" onClick={handleDelete}>
                🗑️
              </button>
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
