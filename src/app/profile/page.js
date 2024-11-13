"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import StyleGrid from "../components/StyleGrid";

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
        <img src={session.user.image} alt="Profile" className="profile-image" />
        <h1>{session.user.name}</h1>
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

      <div className="styles-container">
        <StyleGrid styles={styles[activeTab]} />
      </div>
    </div>
  );
}
