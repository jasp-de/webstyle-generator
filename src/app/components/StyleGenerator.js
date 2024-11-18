"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function StyleGenerator({ onStyleGenerated }) {
  const { data: session } = useSession();
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
        body: JSON.stringify({
          ...generatedStyle,
          createdBy: session?.user?.id || "anonymous",
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save style");
      }

      const savedStyle = await dbResponse.json();
      setPrompt("");
      setSuccessMessage("Style generated successfully!");

      // Call the callback with the saved style
      if (onStyleGenerated) {
        onStyleGenerated(savedStyle);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Trigger a refresh of the grid
      const event = new CustomEvent("styleGenerated");
      window.dispatchEvent(event);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="style-generator">
      <div className="style-generator__heading">
        {" "}
        Generate a new Style with AI
      </div>
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
