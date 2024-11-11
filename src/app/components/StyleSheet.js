"use client";

import { useEffect } from "react";

export default function StyleSheet({ css, id }) {
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement("style");
    styleElement.setAttribute("id", `style-${id}`);
    styleElement.textContent = css;
    document.head.appendChild(styleElement);

    // Cleanup
    return () => {
      const existingStyle = document.getElementById(`style-${id}`);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [css, id]);

  return null;
}
