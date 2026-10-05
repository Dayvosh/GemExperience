import React from 'react';
import '@/styles/globals.css';

export const metadata = {
  title: 'GemExperience | Wedding Outfit Rentals in Nigeria',
  description: 'Connect with wedding outfit rentals and renters across Nigeria.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout-root">
          <header className="layout-header">
            <div className="header-brand">
              <span className="brand-title">GemExperience</span>
            </div>
            <nav className="header-nav">
              <span className="nav-tagline">Wedding Outfit Listing Platform</span>
            </nav>
          </header>
          <main className="layout-main">
            {children}
          </main>
          <footer className="layout-footer">
            <p className="footer-text">GemExperience &copy; 2026 &bull; Nigeria</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
