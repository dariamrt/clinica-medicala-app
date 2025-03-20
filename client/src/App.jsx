import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import TermsAndConditions from "./pages/TermsAndConditions";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/terms" element={<TermsAndConditions />} />
    </Routes>
  );
};

export default App;
