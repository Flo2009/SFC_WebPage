import React from 'react';
import { Link } from 'react-router-dom';
import brandLogo from '../assets/Brand.png'; // Case-perfect relative logo path

const Nav = () => {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark position-absolute top-0 start-0 w-100 py-4" 
      style={{ zIndex: 10, backgroundColor: 'transparent' }}
    >
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
        /* Keep logo proportional when scaling */
        .suess-nav-logo {
          height: 60px; /* Increased from 40px to 60px to look dominant */
          width: auto;
          object-fit: contain;
        }
      `}</style>

      <div className="container-fluid px-5">
        
        {/* Brand Container: Logo on the Left, Name directly after */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-3 m-0">
          <img 
            src={brandLogo} 
            alt="Suess Consulting Logo" 
            className="suess-nav-logo"
          />
          <span className="suess-brand-text">
            Suess Consulting<span className="suess-accent-dot">.</span>
          </span>
        </Link>

        {/* Responsive Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#suessNavbar" 
          aria-controls="suessNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Bar Actions aligned on the Right-Hand Side */}
        <div className="collapse navbar-collapse justify-content-end" id="suessNavbar">
          <ul className="navbar-nav gap-4 mt-3 mt-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link suess-nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link suess-nav-link">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link suess-nav-link">Contact</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Nav;

