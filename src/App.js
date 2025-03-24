import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import SearchForm from "./SearchForm";
import Footer from "./Footer";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchForm />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;