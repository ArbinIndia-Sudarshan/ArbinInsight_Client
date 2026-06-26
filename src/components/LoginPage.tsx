import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type UserRole = "admin" | "manager" | "analyst" | "viewer";

type MessageType = "success" | "error" | "";

interface LoginFormData {
  email: string;
  password: string;
  role: UserRole | "";
  rememberMe: boolean;
}

type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

type LoginPageProps = {
  onLoginSuccess: (user: {
    email: string;
    role: UserRole;
    rememberMe: boolean;
  }) => void;
};

const demoUsers: Record<UserRole, { email: string; password: string }> = {
  admin: {
    email: "admin",
    password: "000000",
  },
  manager: {
    email: "manager",
    password: "000000",
  },
  analyst: {
    email: "analyst",
    password: "000000",
  },
  viewer: {
    email: "viewer",
    password: "000000",
  },
};

function validateLogin(formData: LoginFormData) {
  const errors: LoginFormErrors = {};
  const email = formData.email.trim();

  if (!email) {
    errors.email = "Email is required.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isFormFilled = useMemo(() => {
    return Boolean(formData.email && formData.password);
  }, [formData.email, formData.password]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked =
      event.target instanceof HTMLInputElement ? event.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setMessage("");
    setMessageType("");

    const fieldErrors = validateLogin(formData);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setMessage("Please fix the highlighted fields.");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    const role = (formData.role || "admin") as UserRole;
    const email = formData.email.trim();
    const selectedUser = demoUsers[role];
    const isValidUser =
      selectedUser.email === email &&
      selectedUser.password === formData.password;

    if (!isValidUser) {
      setMessage("Invalid email, password, or selected role.");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    const currentUser = {
      email,
      role,
      rememberMe: formData.rememberMe,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setMessage(`Login successful. Opening ${role} dashboard...`);
    setMessageType("success");

    window.setTimeout(() => {
      onLoginSuccess(currentUser);
    }, 600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-8 text-slate-950">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden text-white lg:block">
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100 shadow-2xl backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Secure battery test monitoring platform
          </div>

          <h1 className="max-w-2xl text-6xl font-black leading-[1.02] tracking-tight">
            Real-time insight for every battery test channel.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Monitor cycling performance, test status, voltage, current,
            capacity, energy, and safety-critical data from a centralized
            dashboard built for battery labs, production lines, and validation
            teams.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-bold">Live</p>
              <p className="mt-2 text-sm text-slate-300">Channel data</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-bold">24-bit</p>
              <p className="mt-2 text-sm text-slate-300">Precision insights</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-bold">RBAC</p>
              <p className="mt-2 text-sm text-slate-300">Role-based access</p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/20 bg-white/90 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg">
                    AI
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-none">
                      Arbin Insight
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Dashboard intelligence
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Secure
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in with your assigned role to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  }`}
                />

                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  }`}
                />

                {errors.password && (
                  <p id="password-error" className="mt-2 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Access role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.role)}
                  aria-describedby={errors.role ? "role-error" : undefined}
                  className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm outline-none transition ${
                    errors.role
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  }`}
                >
                  <option value="">Choose your role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>

                {errors.role && (
                  <p id="role-error" className="mt-2 text-xs text-red-600">
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormFilled}
                className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="relative z-10">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </span>
                <span className="absolute inset-0 translate-y-full bg-blue-600 transition-transform duration-300 group-hover:translate-y-0" />
              </button>

              {message && (
                <div
                  role="alert"
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-slate-950">Demo credentials</strong>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  Testing
                </span>
              </div>

              <div className="grid gap-2">
                <p>
                  <span className="font-semibold text-slate-800">Admin:</span>{" "}
                  admin@insightdash.com / admin123
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Manager:</span>{" "}
                  manager@insightdash.com / manager123
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Analyst:</span>{" "}
                  analyst@insightdash.com / analyst123
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Viewer:</span>{" "}
                  viewer@insightdash.com / viewer123
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Protected workspace access. Role permissions are verified after
            authentication.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
