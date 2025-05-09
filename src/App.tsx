import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";

function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }
  
  // Once logged in, give a Router with Dashboard & Marketplace
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Your main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Catch‑all back to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );

  }

export default App;
