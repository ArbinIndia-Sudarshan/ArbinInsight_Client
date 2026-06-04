import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import Logo from "./components/Logo_animation";

const STARTUP_DELAY_MS = 1200;

function StartupProject() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsReady(true);
    }, STARTUP_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  return isReady ? <App /> : <Logo />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StartupProject />
  </React.StrictMode>,
);
