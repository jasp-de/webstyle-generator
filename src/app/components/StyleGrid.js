"use client";
import { useEffect, useState } from "react";
import StyleCard from "./StyleCard";

export default function StyleGrid() {
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    const fetchStyles = async () => {
      const response = await fetch("/api/styles");
      const data = await response.json();
      setStyles(data);
    };

    fetchStyles();

    // Listen for new styles
    const handleStyleAdded = (event) => {
      setStyles((prevStyles) => [event.detail, ...prevStyles]);
    };

    window.addEventListener("styleAdded", handleStyleAdded);

    return () => {
      window.removeEventListener("styleAdded", handleStyleAdded);
    };
  }, []);

  return (
    <div className="style-grid">
      {styles.map((style) => (
        <StyleCard key={style.id} style={style} />
      ))}
    </div>
  );
}
