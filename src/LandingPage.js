import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Celeb Search History Exposer</h1>
        <p className="landing-subtitle">Uncover the secrets of your favorite celebrities.</p>
        <Link to="/search" className="search-now-btn">Search Now</Link>
      </div>
    </main>
  );
}

export default LandingPage;