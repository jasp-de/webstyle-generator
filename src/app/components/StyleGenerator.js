"use client";
import { useState } from "react";

export default function StyleGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

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

      // Clear the input and show success message
      setPrompt("");
      setSuccessMessage("Style generated successfully!");

      // Add the new style to the grid immediately
      window.dispatchEvent(
        new CustomEvent("styleAdded", {
          detail: generatedStyle,
        })
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
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
          placeholder="Describe your style..."
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}
