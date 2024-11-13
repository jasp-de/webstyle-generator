"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link href="/">Webstyle Explorer</Link>
      </div>
      <div className="nav-links">
        {session ? (
          <>
            <Link href="/profile">Profile</Link>
            <button onClick={() => signOut()} className="auth-button">
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => signIn("github")} className="auth-button">
            Sign in with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}
