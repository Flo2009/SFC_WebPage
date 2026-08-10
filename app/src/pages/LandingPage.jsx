import React, { useState } from 'react';
import automationBg from '../assets/Automation.png';

// SVG Visual Anchors for specialized expertise icons
import operationsIcon from '../assets/production.svg';
import maintenanceIcon from '../assets/maintenance.svg';
import engineeringIcon from '../assets/engineering.svg';
import qualityIcon from '../assets/quality.svg';

const LandingPage = () => {
  // Track open state for each pillar independently inside native React memory
  const [openPillar, setOpenPillar] = useState(null);

  const togglePillar = (pillarName) => {
    setOpenPillar(openPillar === pillarName ? null : pillarName);
  };

  return (
    <div className="landing-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      
      {/* Custom Scoped CSS Styles forcing the precise Quicksand typographic profile */}
      <style>{`
        .landing-page * {
          font-family: 'Quicksand', sans-serif !important;
        }
        .suess-hero-title {
          font-weight: 500 !important; /* Low weight triggers the thin, rounded style */
          font-size: 3.8rem;
          letter-spacing: -0.5px;
          color: #ffffff !important;
        }
        .suess-hero-subtitle {
          font-size: 1.35rem;
          font-weight: 400 !important;
          color: rgba(255, 255, 255, 0.9) !important;
          max-width: 850px;
          margin: 0 auto;
          letter-spacing: 0.5px;
        }
        .btn-explore-services {
          background-color: transparent !important;
          border: 2px solid #ffc107 !important; /* Elegant gold/orange bounding frame */
          color: #ffffff !important;
          border-radius: 30px; /* Perfectly rounded capsule matching 'Read more' button */
          padding: 12px 40px;
          font-weight: 500 !important;
          font-size: 1.15rem;
          transition: all 0.3s ease-in-out;
        }
        .btn-explore-services:hover {
          background-color: #ffc107 !important;
          color: #343a40 !important;
          transform: translateY(-2px);
        }
        
        /* Section Header Layout Matching the Template Design Layout */
        .section-flag-title {
          font-size: 1rem;
          text-transform: uppercase;
          font-weight: 500 !important;
          color: #adb5bd;
          letter-spacing: 1.5px;
          display: inline-block;
          margin-bottom: 5px;
        }
        .section-flag-line {
          display: inline-block;
          width: 80px;
          height: 3px;
          background-color: #dc3545; /* Brand Red accent line */
          margin-left: 15px;
          vertical-align: middle;
        }
        .section-main-heading {
          font-size: 2.6rem;
          font-weight: 500 !important;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          color: #343a40;
        }

        /* Pillars Container Layout styling */
        .suess-pillar-card {
          border: 1px solid #ffc107 !important; /* Forces the requested yellow frame from your rules */
          border-radius: 12px;
          overflow: hidden;
          background-color: #ffffff;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-accordion-header {
          background-color: #ffffff;
          color: #343a40 !important;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .pillar-title-text {
          font-weight: 400 !important; /* Keeps Quicksand cleanly rounded on render */
          font-size: 1.75rem !important;
        }
        .suess-pillar-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
        }
        /* Highlight when you scroll over the pillars should be in red */
        .suess-pillar-card:hover .custom-accordion-header {
          background-color: #dc3545 !important;
          color: #ffffff !important;
        }
        .suess-pillar-card:hover .custom-accordion-header .pillar-title-text,
        .suess-pillar-card:hover .custom-accordion-header .toggle-icon {
          color: #ffffff !important;
        }
        .pillar-svg-icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
          transition: filter 0.2s ease;
        }
        .suess-pillar-card:hover .pillar-svg-icon {
          filter: brightness(0) invert(1);
        }
        .panel-collapse-wrapper {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
          max-height: 0;
          opacity: 0;
        }
        .panel-collapse-wrapper.show-panel {
          max-height: 600px;
          opacity: 1;
        }
        .toggle-icon {
          transition: transform 0.25s ease;
          display: inline-block;
          color: #dc3545; 
        }
        .icon-rotated {
          transform: rotate(45deg);
        }
        .suess-bullet {
          color: #ffc107; 
        }
      `}</style>

      {/* 1. Hero Section mirroring the layout overlay structure */}
      <section 
        className="text-white px-3 text-center border-bottom border-dark position-relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.75), rgba(33, 37, 41, 0.8)), url(${automationBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '650px',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '140px'
        }}
      >
        <div className="container py-5" style={{ zIndex: 2 }}>
          <h1 className="suess-hero-title mb-3">
            Welcome to Suess Consulting
          </h1>
          <p className="suess-hero-subtitle mb-5 lh-md">
            We help manufacturers achieve measurable and sustainable improvements in 
            profitability, operational performance, certification readiness, and leadership capability.
          </p>
          <div className="d-flex justify-content-center mt-4">
            <a href="#what-we-do" className="btn btn-explore-services fw-semibold">
              Explore our Services
            </a>
          </div>
        </div>
      </section>

      {/* 2. "What We Do" Accordion Section leveraging the template layout design */}
      <section id="what-we-do" className="py-5 bg-light px-3">
        <div className="container py-5" style={{ maxWidth: '850px' }}>
          
          {/* Precise layout Title matching the template image structural marker */}
          <div className="text-start mb-5 ps-2">
            <div>
              <span className="section-flag-title">Services</span>
              <span className="section-flag-line"></span>
            </div>
            <h2 className="section-main-heading">What We Do</h2>
          </div>

          {/* Accordion Interface */}
          <div className="d-flex flex-column gap-3 bg-transparent">
            
            {/* Pillar 1: Operations */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4"
                onClick={() => togglePillar('operations')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-4">
                  <img src={operationsIcon} alt="Operations Icon" className="pillar-svg-icon" />
                  <span className="pillar-title-text text-dark fs-3">Operations</span>
                </div>
                <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'operations' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'operations' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-4 border-top mx-4">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Value Stream evaluation</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Lean Management integration</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Lean Management Coaching</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Root Cause Analyzes (Six Sigma Based)</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Kaizen Workshops</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> 5S integration</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Layout planning/evaluation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pillar 2: Maintenance */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4"
                onClick={() => togglePillar('maintenance')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-4">
                  <img src={maintenanceIcon} alt="Maintenance Icon" className="pillar-svg-icon" />
                  <span className="pillar-title-text text-dark fs-3">Maintenance</span>
                </div>
                <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'maintenance' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'maintenance' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-4 border-top mx-4">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> TPM integration (AM, PM, Predictive)</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Critical Spare Part Evaluation</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Critical Machine Evaluation</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Establishment of KPI’s</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pillar 3: Engineering */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4"
                onClick={() => togglePillar('engineering')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-4">
                  <img src={engineeringIcon} alt="Engineering Icon" className="pillar-svg-icon" />
                  <span className="pillar-title-text text-dark fs-3">Engineering</span>
                </div>
                <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'engineering' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'engineering' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-4 border-top mx-4">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Engineering Project Management</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> ROI Analyzes</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Automation evaluation</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Injection Molding (Process Evaluation, DOE, Tooling)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pillar 4: Quality */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4"
                onClick={() => togglePillar('quality')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-4">
                  <img src={qualityIcon} alt="Quality Icon" className="pillar-svg-icon" />
                  <span className="pillar-title-text text-dark fs-3">Quality</span>
                </div>
                <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'quality' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'quality' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-4 border-top mx-4">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> ISO 9001 Gap Analyzes</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Hands-On support</li>
                    <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> Audit preparations</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;



         






