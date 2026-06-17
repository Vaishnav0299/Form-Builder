import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState<"help" | "privacy" | "terms" | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-[450px] sm:border border-border bg-card rounded-2xl p-6 sm:p-10 shadow-sm transition-all duration-300">
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="Forms Logo" className="h-24 w-24 object-contain mb-4" />
          <h1 className="text-[24px] font-normal text-foreground tracking-tight mt-2">Create account</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            to continue to Forms
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field (Google outline floating style) */}
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="
                peer w-full h-14 px-4 py-2 
                border border-border/80 
                bg-transparent rounded-lg text-base 
                outline-none 
                focus:border-primary focus:ring-1 focus:ring-primary 
                transition-all duration-200
                disabled:opacity-50
              "
              required
            />
            <label
              htmlFor="name"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 px-1 
                text-muted-foreground/85 bg-card text-sm 
                pointer-events-none 
                transition-all duration-200
                peer-placeholder-shown:text-base 
                peer-placeholder-shown:top-1/2 
                peer-placeholder-shown:left-4 
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:left-3 
                peer-[:not(:placeholder-shown)]:top-0 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:left-3
              "
            >
              Full Name
            </label>
          </div>

          {/* Email field (Google outline floating style) */}
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="
                peer w-full h-14 px-4 py-2 
                border border-border/80 
                bg-transparent rounded-lg text-base 
                outline-none 
                focus:border-primary focus:ring-1 focus:ring-primary 
                transition-all duration-200
                disabled:opacity-50
              "
              required
            />
            <label
              htmlFor="email"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 px-1 
                text-muted-foreground/85 bg-card text-sm 
                pointer-events-none 
                transition-all duration-200
                peer-placeholder-shown:text-base 
                peer-placeholder-shown:top-1/2 
                peer-placeholder-shown:left-4 
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:left-3 
                peer-[:not(:placeholder-shown)]:top-0 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:left-3
              "
            >
              Email address
            </label>
          </div>

          {/* Password field (Google outline floating style) */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="
                peer w-full h-14 px-4 py-2 
                border border-border/80 
                bg-transparent rounded-lg text-base 
                outline-none 
                focus:border-primary focus:ring-1 focus:ring-primary 
                transition-all duration-200
                disabled:opacity-50
              "
              required
            />
            <label
              htmlFor="password"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 px-1 
                text-muted-foreground/85 bg-card text-sm 
                pointer-events-none 
                transition-all duration-200
                peer-placeholder-shown:text-base 
                peer-placeholder-shown:top-1/2 
                peer-placeholder-shown:left-4 
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:left-3 
                peer-[:not(:placeholder-shown)]:top-0 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:left-3
              "
            >
              Password (at least 6 chars)
            </label>
          </div>

          {/* Confirm Password field (Google outline floating style) */}
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              className="
                peer w-full h-14 px-4 py-2 
                border border-border/80 
                bg-transparent rounded-lg text-base 
                outline-none 
                focus:border-primary focus:ring-1 focus:ring-primary 
                transition-all duration-200
                disabled:opacity-50
              "
              required
            />
            <label
              htmlFor="confirmPassword"
              className="
                absolute left-3 top-1/2 -translate-y-1/2 px-1 
                text-muted-foreground/85 bg-card text-sm 
                pointer-events-none 
                transition-all duration-200
                peer-placeholder-shown:text-base 
                peer-placeholder-shown:top-1/2 
                peer-placeholder-shown:left-4 
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:left-3 
                peer-[:not(:placeholder-shown)]:top-0 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:left-3
              "
            >
              Confirm password
            </label>
          </div>

          {/* Show Password Checkbox */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <label htmlFor="show-password" className="text-sm text-foreground/80 cursor-pointer select-none">
              Show password
            </label>
          </div>

          {/* Actions: Sign In Instead and Create Account button */}
          <div className="flex items-center justify-between pt-4">
            <Link
              to="/login"
              className="
                text-primary hover:text-primary/90 
                font-semibold text-sm 
                py-2 px-3 rounded-md 
                hover:bg-primary/5 
                transition-colors duration-200
              "
            >
              Sign in instead
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="
                h-10 px-6 rounded-lg 
                font-bold bg-primary text-primary-foreground 
                hover:opacity-95 shadow-sm 
                transition active:scale-[0.98]
              "
            >
              {submitting ? "Creating..." : "Next"}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer Info / Links */}
      <div className="w-full max-w-[450px] flex justify-end items-center mt-6 px-4 text-xs text-muted-foreground gap-3">
        <div className="flex gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal("help");
            }}
            className="hover:text-foreground transition-colors"
          >
            Help
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal("privacy");
            }}
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveModal("terms");
            }}
            className="hover:text-foreground transition-colors"
          >
            Terms
          </a>
        </div>
      </div>

      {/* Interactive Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[500px] bg-card border border-border rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200 relative">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              {activeModal === "help" && "Help Center"}
              {activeModal === "privacy" && "Privacy Policy"}
              {activeModal === "terms" && "Terms of Service"}
            </h2>
            <div className="max-h-[300px] overflow-y-auto text-sm text-muted-foreground space-y-4 pr-1">
              {activeModal === "help" && (
                <>
                  <p className="font-semibold text-foreground">Getting Started</p>
                  <p>Welcome to Forms! This application allows you to design, build, and deploy custom web forms in seconds.</p>
                  <p className="font-semibold text-foreground">Creating an Account</p>
                  <p>Use a valid email address and a strong password of at least 6 characters. Once registered, you will be redirected to your dashboard.</p>
                  <p className="font-semibold text-foreground">Form Security</p>
                  <p>All forms are private by default and linked exclusively to your account. End-users can submit answers to your forms without logging in.</p>
                </>
              )}
              {activeModal === "privacy" && (
                <>
                  <p>At Forms, we take your privacy seriously. Here is how we manage your information:</p>
                  <p className="font-semibold text-foreground">1. Authentication Security</p>
                  <p>Your password is encrypted using Bcrypt prior to database storage. We do not store plaintext passwords.</p>
                  <p className="font-semibold text-foreground">2. Data Isolation</p>
                  <p>Your forms, submissions, and metrics are isolated by user account using PostgreSQL relational checks.</p>
                  <p className="font-semibold text-foreground">3. Analytics & Cookies</p>
                  <p>We use standard local storage session tokens to persist your credentials securely. No tracking cookies are shared.</p>
                </>
              )}
              {activeModal === "terms" && (
                <>
                  <p>Please read these Terms of Service carefully before using Forms:</p>
                  <p className="font-semibold text-foreground">1. Acceptable Use Policy</p>
                  <p>You agree not to use the builder for malicious purposes, phishing campaigns, or capturing sensitive credentials (such as passwords, credit card info, or identification pins).</p>
                  <p className="font-semibold text-foreground">2. Content Ownership</p>
                  <p>You retain full ownership of all forms created. However, you are solely responsible for compliance with privacy laws in your local jurisdiction.</p>
                  <p className="font-semibold text-foreground">3. Termination</p>
                  <p>We reserve the right to remove forms or terminate accounts that violate our security policies or collect harmful datasets.</p>
                </>
              )}
            </div>
            <div className="flex justify-end pt-6">
              <Button onClick={() => setActiveModal(null)} className="rounded-lg h-9 px-4">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
