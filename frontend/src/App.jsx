import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApplicationDetail from "./pages/ApplicationDetail.jsx";
import { api } from "./api.js";

function RequireAuth({ authed, children }) {
   const location = useLocation();
   if (!authed) {
      return <Navigate to='/login' replace state={{ from: location }} />;
   }
   return children;
}

export default function App() {
   const [token, setToken] = useState(
      () => localStorage.getItem("token") || ""
   );
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
      <div className='d-flex flex-column min-vh-100'>
         <Topbar user={user} onLogout={handleLogout} />
         <Routes>
            <Route
               path='/login'
               element={
                  isAuthed ? (
                     <Navigate to='/dashboard' replace />
                  ) : (
                     <Login onLogin={handleLogin} />
                  )
               }
            />
            <Route
               path='/register'
               element={
                  isAuthed ? <Navigate to='/dashboard' replace /> : <Register />
               }
            />
            <Route
               path='/dashboard'
               element={
                  <RequireAuth authed={isAuthed}>
                     <Dashboard token={token} />
                  </RequireAuth>
               }
            />
            <Route
               path='/applications/:id'
               element={
                  <RequireAuth authed={isAuthed}>
                     <ApplicationDetail token={token} />
                  </RequireAuth>
               }
            />
            <Route
               path='/'
               element={
                  isAuthed ? (
                     <Navigate to='/dashboard' replace />
                  ) : (
                     <Navigate to='/login' replace />
                  )
               }
            />
            <Route path='*' element={<Navigate to='/' replace />} />
         </Routes>
         <footer className='mt-auto py-4 text-center text-secondary small'>
            <div className='container'>
               © {new Date().getFullYear()} JobTrack
            </div>
         </footer>
      </div>
   );
}
