"use client";

import { useState } from "react";

export default function StyleCard({ style }) {
  const { text, info, css } = style;
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...css.button,
    ...(isHovered ? css.button[":hover"] : {}),
  };

  return (
    <div className="style-card">
      <div className="style-frame" style={css.frame}>
        <h1 className="preview-heading" style={css.h1}>
          {text.title}
        </h1>
        <p className="preview-paragraph" style={css.p}>
          {text.shortDescription}
        </p>
        <button
          className="preview-button"
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {text.buttonText}
        </button>
      </div>
      <div className="style-info">
        <div className="style-name">{info.name}</div>
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
      </div>
    </div>
  );
}
