"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import StyleGrid from "../components/StyleGrid";
import StyleGenerator from "../components/StyleGenerator";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("liked");
  const [styles, setStyles] = useState({ liked: [], generated: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      setError(null);

      Promise.all([
        fetch(`/api/users/${session.user.id}/likes`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch liked styles");
          return res.json();
        }),
        fetch(`/api/users/${session.user.id}/styles`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch generated styles");
          return res.json();
        }),
      ])
        .then(([likedStyles, generatedStyles]) => {
          setStyles({ liked: likedStyles, generated: generatedStyles });
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session]);

  const handleUnlike = (styleId) => {
    setStyles((prev) => ({
      ...prev,
      liked: prev.liked.filter((style) => style._id !== styleId),
    }));
  };

  const handleDelete = (styleId) => {
    setStyles((prev) => ({
      ...prev,
      generated: prev.generated.filter((style) => style._id !== styleId),
    }));
  };

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <img
            src={session.user.image}
            alt="Profile"
            className="profile-image"
          />
          <h1>{session.user.name}</h1>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "liked" ? "active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          Liked Styles ({styles.liked.length})
        </button>
        <button
          className={`tab ${activeTab === "generated" ? "active" : ""}`}
          onClick={() => setActiveTab("generated")}
        >
          Generated Styles ({styles.generated.length})
        </button>
      </div>

      {activeTab === "generated" && (
        <div className="generate-section">
          <StyleGenerator
            onStyleGenerated={(newStyle) => {
              setStyles((prev) => ({
                ...prev,
                generated: [newStyle, ...prev.generated],
              }));
              window.dispatchEvent(new CustomEvent("styleAdded"));
            }}
          />
        </div>
      )}

      <StyleGrid
        styles={styles[activeTab].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
        onUnlike={handleUnlike}
        onDelete={handleDelete}
      />
    </div>
  );
}
