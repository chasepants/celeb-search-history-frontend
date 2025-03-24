import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Google Search Leaks</h1>
        <p className="landing-subtitle">Uncover the secrets of your favorite celebrities.</p>
        <Link to="/search" className="search-now-btn">Search Now</Link>
      </div>
    </main>
  );
}

export default LandingPage;