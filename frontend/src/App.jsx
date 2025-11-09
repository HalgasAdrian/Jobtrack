import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Topbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApplicationDetail from "./pages/ApplicationDetail.jsx";
import { api } from "./api.js";

function RequireAuth({ authed, children }) {
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

RequireAuth.propTypes = {
  authed: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const isAuthed = !!token;

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const u = await api.me(token);
        setUser(u);
      } catch {
        setUser(null);
        localStorage.removeItem("token");
        setToken("");
      }
    }
    loadUser();
  }, [token]);

  function handleLogin(nextToken) {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        background: `
        radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05), transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.05), transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(34, 211, 238, 0.05), transparent 50%)
      `,
        backgroundColor: "var(--bg-light)",
      }}
    >
      <Topbar user={user} onLogout={handleLogout} />
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthed ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthed ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth authed={isAuthed}>
                <Dashboard token={token} />
              </RequireAuth>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <RequireAuth authed={isAuthed}>
                <ApplicationDetail token={token} />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              isAuthed ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="mt-auto py-4 text-center bg-light border-top">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span className="navbar-brand-modern">JobTrack</span>
          </div>
          <p className="text-muted small mb-0">
            © {new Date().getFullYear()} JobTrack - Professional Job
            Application Tracker
          </p>
        </div>
      </footer>
    </div>
  );
}
