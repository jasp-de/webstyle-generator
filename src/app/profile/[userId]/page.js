"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import StyleGrid from "../../components/StyleGrid";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [styles, setStyles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, stylesRes] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch(`/api/styles?createdBy=${userId}`),
        ]);

        if (!userRes.ok || !stylesRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const [userData, stylesData] = await Promise.all([
          userRes.json(),
          stylesRes.json(),
        ]);

        setUserData(userData);
        setStyles(stylesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <img src={userData.image} alt="Profile" className="profile-image" />
          <h1>{userData.name}</h1>
        </div>
      </div>

      <h2 className="generated-styles-heading">Generated Styles</h2>
      <StyleGrid
        styles={styles.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
      />
    </div>
  );
}
