import { BrowserRouter as Router, useLocation, matchPath, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminRoutes from "area-manager/AdminRoutes";
import PublicRoutes from "./PublicRoutes";

import "remixicon/fonts/remixicon.css";
import("./App.css");
function App() {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const isAdminPath = matchPath({ path: "/manager/*", end: false }, location.pathname) != null;

  useEffect(() => {
    // Dynamic import CSS theo route
    if (!isAdminPath) {
      import("./styles/main.css").then(() => {
      });
    } else {
      import("./area-manager/index.scss").then(() => {
      });
    }
  }, [isAdminPath]);

  // Ẩn Splash Screen khi ứng dụng sẵn sàng
  useEffect(() => {
    const hideSplash = () => {
      const splashScreen = document.getElementById("splash-screen");
      if (splashScreen) {
        splashScreen.classList.add("hidden");
        setTimeout(() => {
          splashScreen.style.display = "none";
        }, 500); // Thời gian để Splash Screen mờ dần
      }
      setIsLoaded(true);
    };

    if (document.readyState === "complete") {
      hideSplash();
    } else {
      window.addEventListener("load", hideSplash);
      return () => window.removeEventListener("load", hideSplash);
    }
  }, []);

  return isLoaded ? (
    <>
      <Routes>
          {!isAdminPath ? (
            <Route path="/*" element={<PublicRoutes />} />
          ) : (
            // <AdminRoutes />
            <Route path="/manager/*" element={<AdminRoutes />} />
          )}
        </Routes>
    </>
  ) : null; // Chỉ render ứng dụng sau khi Splash Screen bị ẩn
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
