import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Invoices from "./pages/Invoices";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Expirations from "./pages/Expirations";
import Quotations from "./pages/Quotations";
import UpcomingInvoices from "./pages/UpcomingInvoices";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";

import { db } from "./db";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return db.isAuthenticated();
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleAuthUpdate = () => {
      try {
        setIsAuthenticated(db.isAuthenticated());
      } catch {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleAuthUpdate);
    window.addEventListener("auth-change", handleAuthUpdate as EventListener);

    return () => {
      window.removeEventListener("storage", handleAuthUpdate);
      window.removeEventListener("auth-change", handleAuthUpdate as EventListener);
    };
  }, []);

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      ) : (
        <div className="flex h-screen w-full bg-[#4B49AC] overflow-hidden">
          <Sidebar />

          <div className="flex-1 bg-[#F5F7FF] lg:rounded-l-[3.5rem] overflow-hidden flex flex-col relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.25)]">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/services" element={<Services />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/quotations" element={<Quotations />} />
                <Route path="/upcoming" element={<UpcomingInvoices />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/expirations" element={<Expirations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;

