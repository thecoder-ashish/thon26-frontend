import React, { Suspense, lazy } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import { NavigationBar } from "./components/navigation-bar";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./components/auth/auth";
import { MarqueeProvider } from "./components/auth/MarqueeContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { HomePage } from "./pages/Homepage";
import { Footer } from "./components/Footer";

// Lazy load secondary & heavy admin/event pages for faster initial load
const LeaderboardPage = lazy(() => import("./pages/leaderboard"));
const Events = lazy(() =>
  import("./pages/events").then((module) => ({ default: module.Events }))
);
const EventDetails = lazy(() => import("./components/events/EventDetailed"));
const Teamregister = lazy(() => import("./pages/teamregister"));
const AdminLogin = lazy(() => import("./pages/adminLogin"));
const AdminPanel = lazy(() => import("./pages/adminPanel"));
const SuccessPage = lazy(() => import("./components/team/Success"));

// Simple lightweight loading fallback
const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <MarqueeProvider>
          <Router>
            <Toaster />
            <NavigationBar />
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
            <Footer />
          </Router>
        </MarqueeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
