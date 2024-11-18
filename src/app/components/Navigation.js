"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import SignInPopup from "./SignInPopup";

export default function Navigation() {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleProfileClick = (e) => {
    if (!session) {
      e.preventDefault();
      setShowSignIn(true);
    }
  };

  return (
    <>
      <div className="navigation">
        <div className="nav-content">
          <div className="nav-title">
            <h1>Webstyle Explorer</h1>
            <p>Discover Web Design Aesthetics</p>
            <p className="credits">made with 🩵 by jasp-de</p>
          </div>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/profile" onClick={handleProfileClick}>
              Profile
            </Link>
            {session ? (
              <button className="auth-button" onClick={() => signOut()}>
                Sign Out
              </button>
            ) : (
              <button
                className="auth-button"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      {showSignIn && <SignInPopup onClose={() => setShowSignIn(false)} />}
    </>
  );
}
