"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInPopup({ onClose }) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".signin-popup")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="signin-popup">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h2>Sign In</h2>
      <p>Please sign in to continue</p>
      <button
        className="signin-button"
        onClick={() =>
          signIn("github", {
            callbackUrl: "https://webstyle-generator.vercel.app",
          })
        }
      >
        Sign In with GitHub
      </button>
    </div>
  );
}
