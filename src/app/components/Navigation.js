"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <div className="navigation">
      <div className="nav-content">
        <div className="nav-title">
          <h1>Webstyle Explorer</h1>
          <p>Discover and compare different web design aesthetics</p>
        </div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          {session ? (
            <button className="auth-button" onClick={() => signOut()}>
              Sign Out
            </button>
          ) : (
            <button className="auth-button" onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
