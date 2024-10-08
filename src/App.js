import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicPage from "./PublicPage";
import PrivatePage from "./PrivatePage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/private" element={<PrivatePage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
