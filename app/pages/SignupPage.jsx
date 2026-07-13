import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    firm: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const ok = signup(form);
    if (ok) {
      if (window.fpr) {
        window.fpr("referral", { email: form.email });
      }
      navigate("/dashboard", { replace: true });
    } else {
      setErrors({ email: "An account with this email already exists." });
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />

        <Input
          label="Firm name"
          type="text"
          autoComplete="organization"
          placeholder="Smith Advisory (optional)"
          value={form.firm}
          onChange={set("firm")}
          hint="Leave blank if you're an independent advisor."
        />

        <Input
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Create account
        </Button>

        <p className="text-xs text-gray-400 text-center">
          By signing up you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </>
  );
}
