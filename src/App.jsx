import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { NavigationBar } from "./components/navigation-bar";
import { AlertDialogDemo } from "./components/AlertDialogDemo";
// import SignUp from "./pages/signup";
// import Profile from "./pages/profile";
// import LoginPage from "./pages/login";
// import HomePage from "./pages/homePage";
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./components/auth/auth";
import { MarqueeProvider } from './components/auth/MarqueeContext';

import { RequireAuth } from "./components/auth/RequireAuth";
import LeaderboardPage from "./pages/leaderboard";
import { Events } from "./pages/events";
import Teamregister from "./pages/teamregister";
import AdminLogin from "./pages/adminLogin";
import AdminPanel from "./pages/adminPanel";
import EventDetails from "./components/events/EventDetailed";
import SuccessPage from "./components/team/Success";
import { HomePage } from "./pages/Homepage";
import { Footer } from "./components/Footer";
function App() {
  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
      <MarqueeProvider>

        <Router>
          <Toaster />
          <NavigationBar />
          <Routes>


            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/register" element={<Teamregister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <AdminPanel />
                </RequireAuth>
              }
            />
            <Route
              path="/login/dashboard"
              element={
                <RequireAuth>
                  <AdminPanel />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <AdminPanel />
                </RequireAuth>
              }
            />
           
          </Routes>
          <Footer />
        </Router>
        </MarqueeProvider>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
