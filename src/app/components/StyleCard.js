"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import StyleSheet from "./StyleSheet";

export default function StyleCard({ style }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const { text, info, css, tags } = style;
  const [isExpanded, setIsExpanded] = useState(false);
  const styleId = info.name.toLowerCase().replace(/\s+/g, "-");

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          styleId: style._id,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
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
          {session && (
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
            >
              ♥
            </button>
          )}
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
