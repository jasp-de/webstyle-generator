"use client";
import { useState } from "react";

export default function StyleGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First, get the style from OpenAI
      const aiResponse = await fetch("/api/styles/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!aiResponse.ok) {
        throw new Error("Failed to generate style");
      }

      const generatedStyle = await aiResponse.json();

      // Then, save the style to the database
      const dbResponse = await fetch("/api/styles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedStyle),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save style");
      }

      // Clear the input
      setPrompt("");

      // Trigger a refresh of the grid by dispatching a custom event
      window.dispatchEvent(new CustomEvent("styleAdded"));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="style-generator">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your desired style (e.g., 'A cyberpunk theme with neon colors')"
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Generating..." : "Generate Style"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
