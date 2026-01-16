"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session } = useSession();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  if (session?.user) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Account</h1>
        <p className="text-sm text-slate-600">
          Signed in as {session.user.email}
        </p>
        <Link
          href="/orders"
          className="inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          View orders
        </Link>
      </div>
    );
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInError(null);
    setSigningIn(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSigningIn(false);
    if (!response?.ok) {
      setSignInError("Invalid email or password");
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignUpError(null);
    setSigningUp(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Sign up failed");
      }

      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        callbackUrl: "/",
      });
    } catch (error) {
      setSignUpError(
        error instanceof Error ? error.message : "Sign up failed"
      );
      setSigningUp(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              name="password"
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>
          {signInError ? (
            <p className="text-sm text-rose-500">{signInError}</p>
          ) : null}
          <button
            type="submit"
            disabled={signingIn}
            className="inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {signingIn ? "Signing in..." : "Log in"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Name
            <input
              type="text"
              name="name"
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>
          {signUpError ? (
            <p className="text-sm text-rose-500">{signUpError}</p>
          ) : null}
          <button
            type="submit"
            disabled={signingUp}
            className="inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {signingUp ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </section>
    </div>
  );
}
