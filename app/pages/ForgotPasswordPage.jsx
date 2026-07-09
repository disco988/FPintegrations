import { useState } from "react";
import { Link } from "react-router";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
        <p className="text-sm text-gray-500 mb-6">
          If an account exists for <strong>{email}</strong>, we've sent a password reset link.
        </p>
        <Link to="/login" className="text-sm text-indigo-600 hover:underline font-medium">
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot your password?</h1>
        <p className="text-sm text-gray-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" loading={loading} className="w-full">
          Send reset link
        </Button>

        <Link
          to="/login"
          className="text-center text-sm text-indigo-600 hover:underline"
        >
          ← Back to login
        </Link>
      </form>
    </>
  );
}
