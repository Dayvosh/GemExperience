import React from 'react';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <span className="home-badge">Platform Scaffold</span>
        <h1 className="home-heading">Elevate Your Wedding Experience</h1>
        <p className="home-subtext">
          List unused wedding outfits or find your perfect fit for introduction, traditional, white wedding, and reception events across Nigeria.
        </p>
        <div className="home-actions">
          <div className="demo-chip primary-chip">
            Semantic Color Token: Primary
          </div>
          <div className="demo-chip secondary-chip">
            Semantic Color Token: Secondary
          </div>
        </div>
      </div>
    </div>
  );
}
