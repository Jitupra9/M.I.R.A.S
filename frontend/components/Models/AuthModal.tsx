"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Briefcase,
  MapPin,
  Sparkles,
  LogOut,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  mandatory?: boolean;
  onAuthSuccess: (user: any, token: string) => void;
  onLogout: () => void;
}

type AuthView = "login" | "register" | "forgot" | "reset";

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  mandatory = false,
  onAuthSuccess,
  onLogout,
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(err.detail || "Invalid email or password");
      }

      const data = await res.json();
      localStorage.setItem("miras_token", data.access_token);

      // Fetch user profile
      const meRes = await fetch(`${backendUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const meData = await meRes.json();
      localStorage.setItem("miras_user", JSON.stringify(meData));

      onAuthSuccess(meData, data.access_token);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          full_name: fullName,
          profession,
          skills,
          location,
          bio,
        }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ detail: "Registration failed" }));
        throw new Error(err.detail || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("miras_token", data.access_token);

      const userObj = {
        email,
        username,
        full_name: fullName,
        profession,
        skills,
        location,
        bio,
      };
      localStorage.setItem("miras_user", JSON.stringify(userObj));

      onAuthSuccess(userObj, data.access_token);
      onClose();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ detail: "Email check failed" }));
        throw new Error(err.detail || "No account found with this email");
      }

      setSuccessMsg("Email verified! Please enter your new password below.");
      setView("reset");
    } catch (err: any) {
      setError(err.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${backendUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ detail: "Password reset failed" }));
        throw new Error(err.detail || "Could not reset password");
      }

      setSuccessMsg(
        "Password reset successfully! Please sign in with your new password.",
      );
      setView("login");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (!mandatory && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {!mandatory && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {currentUser ? (
          /* Profile / Logout View */
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                {(currentUser.full_name ||
                  currentUser.username ||
                  "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground truncate">
                  {currentUser.full_name || currentUser.username}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-emerald-500 font-medium">
                    Memory Connected
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-secondary/40 p-3 rounded-xl space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  Profession & Skills
                </p>
                <p className="text-muted-foreground">
                  {currentUser.profession || "Not specified"}
                </p>
                <p className="text-primary/90 font-medium">
                  {currentUser.skills || "No skills logged yet"}
                </p>
              </div>

              {currentUser.location && (
                <div className="bg-secondary/40 p-3 rounded-xl space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Location
                  </p>
                  <p className="text-muted-foreground">
                    {currentUser.location}
                  </p>
                </div>
              )}

              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-muted-foreground text-[11px] leading-relaxed">
                💡 Your long-term memory automatically updates with every
                conversation.
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          /* Authentication Flow */
          <div>
            <div className="mb-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-inner">
                {view === "forgot" || view === "reset" ? (
                  <KeyRound className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {view === "login" && "Sign In to M.I.R.A.S"}
                {view === "register" && "Create Your Agent Account"}
                {view === "forgot" && "Reset Your Password"}
                {view === "reset" && "Enter New Password"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {view === "login" &&
                  "Sign in to access your personal AI agent & memory."}
                {view === "register" &&
                  "Connect your profile & skills to the vector memory."}
                {view === "forgot" &&
                  "Enter your email to verify your account."}
                {view === "reset" &&
                  "Choose a secure new password for your account."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setView("forgot");
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity mt-2"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {view === "register" && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="jitu"
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jitu"
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Profession
                    </label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="AI Engineer"
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="India"
                      className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Skills (sews into LLM long-term memory)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Python, LangGraph, React, Next.js"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity mt-2"
                >
                  {loading
                    ? "Creating account & seeding memory..."
                    : "Create Account"}
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity mt-2"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            )}

            {/* 4. RESET PASSWORD FORM */}
            {view === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity mt-2"
                >
                  {loading ? "Updating password..." : "Set New Password"}
                </button>
              </form>
            )}

            {/* Bottom Navigation Links */}
            <div className="mt-4 pt-3 border-t border-border/50 text-center space-y-1">
              {view === "login" ? (
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Don&apos;t have an account? Create one with profile memory
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
