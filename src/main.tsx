import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";

const STARTUP_DELAY_MS = 1200;

function StartupProject() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsReady(true);
    }, STARTUP_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  return isReady ? (
    <App />
  ) : (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-slate-900/30 backdrop-blur-xl">
        <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold">ArbinInsight Client</p>
          <p className="text-sm text-slate-300">Loading dashboard…</p>
        </div>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StartupProject />
  </React.StrictMode>,
);
