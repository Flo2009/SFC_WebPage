import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/Brand.png';

const navigationTranslations = {
  EN: { 
    home: "Home", 
    about: "About Us", 
    contact: "Contact", 
    blog: "Blog",
    careers: "Careers" // 🚀 ADDED TRANSLATION PROPERTY KEY
  },
  DE: { 
    home: "Startseite", 
    about: "Über Uns", 
    contact: "Kontakt", 
    blog: "Blog",
    careers: "Karriere" // 🚀 ADDED TRANSLATION PROPERTY KEY
  }
};

const Nav = ({ lang }) => {
  // Gracefully fallback to English if global layout rendering contexts parse empty
  const activeLang = lang || 'EN';
  const navText = navigationTranslations[activeLang];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark position-absolute top-0 start-0 w-100 py-4" style={{ zIndex: 10, backgroundColor: 'transparent' }}>
      {/* Scope CSS Styles for Navigation Accents inside the component */}
      <style>{`
        .suess-nav-link {
          color: #f8f9fa !important;
          font-weight: 600;
          font-size: 1.25rem; /* Blown up to 20px for high visibility */
          transition: color 0.2s ease-in-out;
        }
        .suess-nav-link:hover {
          color: #ffc107 !important; /* Gold/Yellow highlight on hover */
        }
        .suess-brand-text {
          font-weight: 800;
          letter-spacing: 0.75px;
          color: #ffffff;
          font-size: 2rem; /* Scaled up significantly (approx 32px) */
        }
        .suess-accent-dot {
          color: #dc3545; /* Red branding dot parameter */
        }
        .suess-nav-logo {
          height: 60px; /* Increased from 40px to 60px to look dominant */
          width: auto;
          object-fit: contain;
        }
        /* 🚀 MASTER FLICKER-FREE RESPONSIVE MEDIA QUERY SETTINGS */
        @media (max-width: 991px) {
          /* Binds background fill layers to native transitional states to stop the flicker */
          .navbar-collapse.collapsing,
          .navbar-collapse.collapse.show {
            background-color: #212529 !important; /* Solid dark background blocks background text instantly */
            padding: 20px !important;
            border-radius: 12px;
            margin-top: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
          }
          
          /* Adds clean vertical spacing to the stacked mobile menu items */
          .navbar-nav {
            gap: 15px !important;
            text-align: left;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="container-fluid px-5">
        <Link className="navbar-brand d-flex align-items-center gap-3 text-decoration-none" to="/">
          <img src={logo} alt="Suess Consulting Logo" className="suess-nav-logo img-fluid" />
          <span className="suess-brand-text d-none d-sm-inline">
            Suess Consulting<span className="suess-accent-dot">.</span>
          </span>
        </Link>
        
        <button className="navbar-toggler border-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#suessNavbarMain" aria-controls="suessNavbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="suessNavbarMain">
          <ul className="navbar-nav gap-4 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link suess-nav-link" to="/">{navText.home}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link suess-nav-link" to="/about">{navText.about}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link suess-nav-link" to="/contact">{navText.contact}</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link suess-nav-link" to="/blog">{navText.blog}</NavLink>
            </li>
            {/* 🚀 THE LIVE LINK ROUTE PATH NODE POINTER CONNECTION */}
            <li className="nav-item">
              <NavLink className="nav-link suess-nav-link" to="/careers">{navText.careers}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;




