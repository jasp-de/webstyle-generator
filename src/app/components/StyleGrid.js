"use client";
import { useEffect, useState } from "react";
import StyleCard from "./StyleCard";

export default function StyleGrid() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch("/api/styles");
        const data = await response.json();
        console.log("Fetched styles:", data);
        setStyles(data);
      } catch (error) {
        console.error("Error fetching styles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStyles();
  }, []);

  if (loading) {
    return <div>Loading styles...</div>;
  }

  return (
    <div className="style-grid">
      {styles.map((style, index) => (
        <StyleCard key={style._id || index} style={style} />
      ))}
    </div>
  );
}
