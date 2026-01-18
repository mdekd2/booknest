"use client";

import { useState } from "react";

type UserProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "ADMIN" | "USER" | string;
  createdAt?: string | null;
};

type UsersAdminClientProps = {
  initialUsers: UserProfile[];
  labels: {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    noUsers: string;
    makeAdmin: string;
    makeUser: string;
    saving: string;
  };
};

export function UsersAdminClient({ initialUsers, labels }: UsersAdminClientProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleToggleRole = async (userId: string, nextRole: "ADMIN" | "USER") => {
    setSavingId(userId);
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Update failed");
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: nextRole } : user
        )
      );
    } finally {
      setSavingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <p className="text-sm text-[#6b5f54]">{labels.noUsers}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4 border-b border-[#e6dccf] pb-3 text-xs font-semibold uppercase tracking-wide text-[#6b5f54] sm:grid-cols-4">
        <div>{labels.name}</div>
        <div>{labels.email}</div>
        <div className="hidden sm:block">{labels.role}</div>
        <div className="hidden sm:block">{labels.createdAt}</div>
      </div>
      <div className="mt-3 space-y-3">
        {users.map((user) => {
          const currentRole = user.role ?? "USER";
          const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
          const isSaving = savingId === user.id;
          return (
            <div
              key={user.id}
              className="grid grid-cols-2 gap-4 rounded-2xl border border-[#e6dccf] bg-white/70 p-4 text-sm text-[#1f1a17] sm:grid-cols-4"
            >
              <div className="font-semibold">{user.name ?? "—"}</div>
              <div className="text-[#6b5f54]">{user.email ?? "—"}</div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full bg-[#e4efe8] px-2 py-1 text-xs font-semibold text-[#1f3a2f]">
                  {currentRole}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleRole(user.id, nextRole)}
                  disabled={isSaving}
                  className="rounded-full border border-[#e6dccf] px-3 py-1 text-xs font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? labels.saving
                    : nextRole === "ADMIN"
                      ? labels.makeAdmin
                      : labels.makeUser}
                </button>
              </div>
              <div className="hidden text-[#6b5f54] sm:block">
                {user.createdAt ?? "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
