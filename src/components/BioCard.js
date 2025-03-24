import React from "react";
import "../SearchForm.css";

function BioCard({ bio }) {
  return (
    <div className="bio-card">
      <img src={bio.photo} alt={bio.name} className="bio-photo" />
      <div className="bio-details">
        <h2 className="bio-name">{bio.name}</h2>
        <p className="bio-age">Age: {bio.age}</p>
        <p className="bio-text">{bio.bio}</p>
      </div>
    </div>
  );
}

export default BioCard; 