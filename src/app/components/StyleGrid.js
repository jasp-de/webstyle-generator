"use client";
import { useEffect, useState } from "react";
import StyleCard from "./StyleCard";

export default function StyleGrid({ styles: propStyles, onUnlike, onDelete }) {
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    if (propStyles) {
      setStyles(propStyles);
    } else {
      const fetchStyles = async () => {
        try {
          const response = await fetch("/api/styles");
          if (!response.ok) throw new Error("Failed to fetch styles");
          const data = await response.json();
          setStyles(
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
        } catch (error) {
          console.error("Error fetching styles:", error);
          setStyles([]);
        }
      };
      fetchStyles();

      // Listen for new styles
      const handleNewStyle = async () => {
        await fetchStyles();
      };

      window.addEventListener("styleAdded", handleNewStyle);
      return () => window.removeEventListener("styleAdded", handleNewStyle);
    }
  }, [propStyles]);

  return (
    <div className="style-grid">
      {styles.map((style) => (
        <StyleCard
          key={style._id}
          style={style}
          onUnlike={onUnlike}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
