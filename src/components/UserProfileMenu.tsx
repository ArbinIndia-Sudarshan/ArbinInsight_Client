import { useEffect, useMemo, useRef, useState } from "react";

type StoredCurrentUser = {
  name?: string;
  email?: string;
  role?: string;
  rememberMe?: boolean;
};

type UserProfile = {
  name: string;
  email: string;
  role: string;
};

const fallbackUser: UserProfile = {
  name: "Dashboard User",
  email: "user@company.com",
  role: "viewer",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStoredCurrentUser(value: unknown): StoredCurrentUser | null {
  if (!isRecord(value)) return null;

  return {
    name: typeof value.name === "string" ? value.name : undefined,
    email: typeof value.email === "string" ? value.email : undefined,
    role: typeof value.role === "string" ? value.role : undefined,
    rememberMe:
      typeof value.rememberMe === "boolean" ? value.rememberMe : undefined,
  };
}

function deriveNameFromEmail(email: string) {
  const username = email.split("@")[0]?.trim();
  if (!username) return fallbackUser.name;

  return username
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readCurrentUser(): UserProfile {
  if (typeof window === "undefined") return fallbackUser;

  try {
    const rawUser = window.localStorage.getItem("currentUser");
    if (!rawUser) return fallbackUser;

    const storedUser = toStoredCurrentUser(JSON.parse(rawUser));
    if (!storedUser) return fallbackUser;

    const email = storedUser.email?.trim() || fallbackUser.email;
    const name = storedUser.name?.trim() || deriveNameFromEmail(email);
    const role = storedUser.role?.trim() || fallbackUser.role;

    return { name, email, role };
  } catch {
    return fallbackUser;
  }
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || fallbackUser.name;
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function UserProfileMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const user = useMemo(() => readCurrentUser(), []);
  const initials = useMemo(() => getInitials(user.name, user.email), [user]);
  const displayRole = formatRole(user.role);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isProfileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleProfileDetails = () => {
    setIsDropdownOpen(false);
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("currentUser");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        aria-label="Open user account menu"
        onClick={() => setIsDropdownOpen((current) => !current)}
        className="group inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-slate-700 shadow-sm shadow-slate-200/70 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-500/15"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white shadow-sm">
          {initials}
        </span>
        <span className="hidden max-w-[9rem] truncate pr-1 text-sm font-semibold sm:inline">
          {user.name}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
        >
          <div className="px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">
                  {user.name}
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {user.email}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-700">
                  {displayRole}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleProfileDetails}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493A6.986 6.986 0 0 1 10 10a6.986 6.986 0 0 1 6.535 4.493.75.75 0 0 1-.326.881A11.96 11.96 0 0 1 10 17a11.96 11.96 0 0 1-6.209-1.626.75.75 0 0 1-.326-.881Z" />
              </svg>
              Profile Details
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Zm12.03 4.22a.75.75 0 0 0-1.06 1.06l.72.72H8.75a.75.75 0 0 0 0 1.5h5.94l-.72.72a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06l-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-details-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-base font-bold text-white shadow-lg shadow-slate-950/20">
                  {initials}
                </span>
                <div className="min-w-0">
                  <h2
                    id="profile-details-title"
                    className="truncate text-lg font-bold text-slate-950"
                  >
                    {user.name}
                  </h2>
                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close profile details"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/15"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-500">Role</span>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                  {displayRole}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-500">
                  Account status
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileMenu;
