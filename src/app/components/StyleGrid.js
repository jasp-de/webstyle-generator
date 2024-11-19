"use client";
import { useEffect, useState } from "react";
import StyleCard from "./StyleCard";

export default function StyleGrid({
  styles: propStyles,
  onUnlike,
  onDelete,
  searchTerm,
  sortBy,
  setSortBy,
}) {
  const [styles, setStyles] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const sortStyles = (styles) => {
    switch (sortBy) {
      case "oldest":
        return [...styles].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "mostLiked":
        return [...styles].sort((a, b) => b.likedBy.length - a.likedBy.length);
      case "newest":
      default:
        return [...styles].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  const filterStyles = (styles) => {
    if (!searchTerm) return styles;
    return styles.filter((style) =>
      style.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const fetchAndUpdateStyles = async () => {
    try {
      const response = await fetch("/api/styles");
      if (!response.ok) throw new Error("Failed to fetch styles");
      const data = await response.json();
      setStyles(filterStyles(sortStyles(data)));
    } catch (error) {
      console.error("Error fetching styles:", error);
      setStyles([]);
    }
  };

  useEffect(() => {
    if (!propStyles) {
      const interval = setInterval(() => {
        setLastUpdate(Date.now());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [propStyles]);

  useEffect(() => {
    if (propStyles) {
      setStyles(filterStyles(sortStyles(propStyles)));
    } else {
      fetchAndUpdateStyles();
    }
  }, [propStyles, sortBy, searchTerm, lastUpdate]);

  useEffect(() => {
    const handleStyleGenerated = () => {
      fetchAndUpdateStyles();
    };
    window.addEventListener("styleGenerated", handleStyleGenerated);
    return () =>
      window.removeEventListener("styleGenerated", handleStyleGenerated);
  }, [sortBy]);

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
