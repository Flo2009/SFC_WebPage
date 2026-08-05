import React, { useState } from 'react';
import automationBg from '../assets/Automation.png';

// SVG Visual Anchors for specialized expertise icons
import operationsIcon from '../assets/production.svg';
import maintenanceIcon from '../assets/maintenance.svg';
import engineeringIcon from '../assets/engineering.svg';
import qualityIcon from '../assets/quality.svg';

const LandingPage = () => {
  const [openPillar, setOpenPillar] = useState(null);

  const togglePillar = (pillarName) => {
    setOpenPillar(openPillar === pillarName ? null : pillarName);
  };

  return (
    <div className="landing-page bg-white">
      
      {/* Custom Scoped CSS Styles for Suess Consulting Corporate Identity */}
      <style>{`
        .suess-hero-text {
          color: #ffc107 !important; /* Force text in the hero yellow */
        }
        .btn-explore-services {
          background-color: transparent !important;
          border: 2px solid #dc3545 !important; /* Just a red frame */
          color: #ffffff !important;
          transition: all 0.2s ease-in-out;
        }
        .btn-explore-services:hover {
          background-color: #dc3545 !important;
          color: #ffffff !important;
        }
        .suess-pillar-card {
          border: 2px solid #ffc107 !important; /* What we do pillars have a yellow frame */
          border-radius: 8px;
          overflow: hidden;
          background-color: #ffffff;
          transition: all 0.2s ease-in-out;
        }
        .custom-accordion-header {
          background-color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
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
        /* Style the specialized expertise icons */
        .pillar-svg-icon {
          width: 28px;
          height: 28px;
          object-fit: containment;
          transition: filter 0.2s ease-in-out;
        }
        /* Invert SVG colors to white on hover for high-utility readability */
        .suess-pillar-card:hover .pillar-svg-icon {
          filter: brightness(0) invert(1);
        }
        .panel-collapse-wrapper {
          overflow: hidden;
          transition: max-height 0.35s ease-in-out, opacity 0.2s ease;
          max-height: 0;
          opacity: 0;
        }
        .panel-collapse-wrapper.show-panel {
          max-height: 600px;
          opacity: 1;
        }
        .toggle-icon {
          transition: transform 0.2s ease-in-out;
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

      {/* 1. Hero Section integrating full automation graphic backdrop */}
      <section 
        className="text-white px-3 text-center border-bottom border-dark position-relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(52, 58, 64, 0.8), rgba(52, 58, 64, 0.85)), url(${automationBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '120px'
        }}
      >
        <div className="container py-5" style={{ maxWidth: '950px', zIndex: 2 }}>
          <span className="text-uppercase fw-bold tracking-wider small d-block mb-3" style={{ color: '#ffc107' }}>
            Manufacturing Consulting & Recruiting
          </span>
          <h1 className="display-4 fw-bold lh-base mb-4 suess-hero-text">
            We help manufacturers achieve measurable and sustainable improvements in 
            profitability, operational performance, certification readiness, and leadership capability.
          </h1>
          <div className="d-flex gap-3 justify-content-center mt-4">
            <a href="#what-we-do" className="btn btn-explore-services btn-lg px-4 py-2 fw-semibold">
              Explore Our Services
            </a>
            <a href="/contact" className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* 2. "What We Do" Accordion Section */}
      <section id="what-we-do" className="py-5 bg-light px-3">
        <div className="container py-4" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark mb-2">What We Do</h2>
            <p className="text-muted">Click any pillar to see our specific areas of specialized expertise.</p>
          </div>

          {/* Pure React Managed Accordion Wrapper */}
          <div className="d-flex flex-column gap-3 bg-transparent">
            
            {/* Pillar 1: Operations */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-3 d-flex align-items-center justify-content-between fs-5"
                onClick={() => togglePillar('operations')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img src={operationsIcon} alt="Operations Icon" className="pillar-svg-icon" />
                  <span className="fw-bold pillar-title-text text-dark">Operations</span>
                </div>
                <span className={`fw-bold toggle-icon ${openPillar === 'operations' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'operations' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-3 border-top mx-3">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-6">
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Value Stream evaluation</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Lean Management integration</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Lean Management Coaching</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Root Cause Analyzes (Six Sigma Based)</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Kaizen Workshops</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> 5S integration</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Layout planning/evaluation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pillar 2: Maintenance */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-3 d-flex align-items-center justify-content-between fs-5"
                onClick={() => togglePillar('maintenance')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img src={maintenanceIcon} alt="Maintenance Icon" className="pillar-svg-icon" />
                  <span className="fw-bold pillar-title-text text-dark">Maintenance</span>
                </div>
                <span className={`fw-bold toggle-icon ${openPillar === 'maintenance' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'maintenance' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-3 border-top mx-3">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-6">
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> TPM integration (AM, PM, Predictive)</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Critical Spare Part Evaluation</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Critical Machine Evaluation</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Establishment of KPI’s</li>
                  </ul>
                </div>
              </div>
            </div>

                        {/* Pillar 3: Engineering */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-3 d-flex align-items-center justify-content-between fs-5"
                onClick={() => togglePillar('engineering')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img src={engineeringIcon} alt="Engineering Icon" className="pillar-svg-icon" />
                  <span className="fw-bold pillar-title-text text-dark">Engineering</span>
                </div>
                <span className={`fw-bold toggle-icon ${openPillar === 'engineering' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'engineering' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-3 border-top mx-3">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-6">
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Engineering Project Management</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> ROI Analyzes</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Automation evaluation</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Injection Molding (Process Evaluation, DOE, Tooling)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pillar 4: Quality */}
            <div className="suess-pillar-card shadow-sm">
              <div 
                className="custom-accordion-header p-3 d-flex align-items-center justify-content-between fs-5"
                onClick={() => togglePillar('quality')}
                style={{ userSelect: 'none' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img src={qualityIcon} alt="Quality Icon" className="pillar-svg-icon" />
                  <span className="fw-bold pillar-title-text text-dark">Quality</span>
                </div>
                <span className={`fw-bold toggle-icon ${openPillar === 'quality' ? 'icon-rotated' : ''}`}>+</span>
              </div>
              <div className={`panel-collapse-wrapper ${openPillar === 'quality' ? 'show-panel' : ''}`}>
                <div className="card-body bg-white py-3 border-top mx-3">
                  <ul className="list-group list-group-flush text-secondary lh-lg fs-6">
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> ISO 9001 Gap Analyzes</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Hands-On support</li>
                    <li className="list-group-item border-0 px-0 py-1"><span className="suess-bullet me-2">▪</span> Audit preparations</li>
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



