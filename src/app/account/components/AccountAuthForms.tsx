"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type AccountAuthLabels = {
  signIn: string;
  signUp: string;
  email: string;
  password: string;
  name: string;
  signingIn: string;
  creating: string;
  invalid: string;
};

export default function AccountAuthForms({
  labels,
}: {
  labels: AccountAuthLabels;
}) {
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInError(null);
    setSigningIn(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const credentials = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const token = await credentials.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      window.location.href = "/";
    } catch {
      setSignInError(labels.invalid);
    } finally {
      setSigningIn(false);
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
      const credentials = await createUserWithEmailAndPassword(
        firebaseAuth,
        payload.email,
        payload.password
      );
      if (payload.name) {
        await updateProfile(credentials.user, { displayName: payload.name });
      }
      const token = await credentials.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      window.location.href = "/";
    } catch (error) {
      setSignUpError(
        error instanceof Error ? error.message : "Sign up failed"
      );
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {labels.signIn}
        </h1>
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
            {labels.email}
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
            {labels.password}
            <input
              type="password"
              name="password"
              required
              className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
            />
          </label>
          {signInError ? (
            <p className="text-sm text-[#a54b3c]">{signInError}</p>
          ) : null}
          <button
            type="submit"
            disabled={signingIn}
            className="inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
          >
            {signingIn ? labels.signingIn : labels.signIn}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#1f1a17]">
          {labels.signUp}
        </h2>
        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
            {labels.name}
            <input
              type="text"
              name="name"
              required
              className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
            {labels.email}
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
            {labels.password}
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
            />
          </label>
          {signUpError ? (
            <p className="text-sm text-[#a54b3c]">{signUpError}</p>
          ) : null}
          <button
            type="submit"
            disabled={signingUp}
            className="inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
          >
            {signingUp ? labels.creating : labels.signUp}
          </button>
        </form>
      </section>
    </div>
  );
}
