// src/pages/LoginPage.tsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, provider } from "../firebase";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignup ? "Sign Up" : "Login"}</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          {isSignup ? "Create Account" : "Login"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>

      <button onClick={handleGoogleSignIn} className="submit-button" style={{ backgroundColor: "#db4437", marginTop: "1rem" }}>
        Sign in with Google
      </button>

      <button className="toggle-button" onClick={() => setIsSignup(!isSignup)}>
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
