import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <AppRoutes />
        </main>
      </div>
    </ToastProvider>
  );
}
