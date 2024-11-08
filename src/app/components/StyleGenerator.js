"use client";
import { useState } from "react";

export default function StyleGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStyle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate-style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const newStyle = await response.json();

      // Here you would add code to update your UI with the new style
      console.log("Generated style:", newStyle);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="style-generator">
      <form onSubmit={generateStyle}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your desired web style..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Style"}
        </button>
      </form>
    </div>
  );
}
