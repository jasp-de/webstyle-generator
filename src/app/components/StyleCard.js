"use client";

import { useState } from "react";

export default function StyleCard({ style }) {
  const { text, info, css } = style;
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const buttonStyle = {
    ...css.button,
    ...(isHovered ? css.button[":hover"] : {}),
  };

  const cssText = `
.preview-${info.name.toLowerCase().replace(/\s+/g, "-")} {
  background: ${css.frame.background};
  color: ${css.frame.color};
  font-family: ${css.frame.fontFamily};
  ${css.frame.border ? `border: ${css.frame.border};` : ""}
}

.preview-${info.name.toLowerCase().replace(/\s+/g, "-")} h1 {
  font-size: ${css.h1.fontSize};
  ${css.h1.textTransform ? `text-transform: ${css.h1.textTransform};` : ""}
}

.preview-${info.name.toLowerCase().replace(/\s+/g, "-")} p {
  font-size: ${css.p.fontSize};
  ${css.p.fontStyle ? `font-style: ${css.p.fontStyle};` : ""}
}

.preview-${info.name.toLowerCase().replace(/\s+/g, "-")} button {
  background: ${css.button.background};
  color: ${css.button.color};
  border: ${css.button.border || "none"};
  padding: 15px 40px;
  font-family: inherit;
  font-size: ${css.button.fontSize};
  cursor: pointer;
  transition: ${css.button.transition};
}

.preview-${info.name.toLowerCase().replace(/\s+/g, "-")} button:hover {
  ${Object.entries(css.button[":hover"])
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ")}
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssText);
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
            <code>{cssText}</code>
          </pre>
          <button className="copy-button" onClick={copyToClipboard}>
            Copy CSS
          </button>
        </div>
      </div>
    </div>
  );
}
