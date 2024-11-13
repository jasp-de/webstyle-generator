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
        const response = await fetch("/api/styles");
        const data = await response.json();
        setStyles(data);
      };
      fetchStyles();
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
