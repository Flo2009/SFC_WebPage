import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import automationBg from '../assets/Automation.png';

// SVG Visual Anchors for specialized expertise header icons
import operationsIcon from '../assets/production.svg';
import maintenanceIcon from '../assets/maintenance.svg';
import engineeringIcon from '../assets/engineering.svg';
import qualityIcon from '../assets/quality.svg';

// Dynamic Context Media Assets for the right-hand column panel
import defaultRobot from '../assets/Robot.png';
import maintenanceShop from '../assets/Maintenance_Shop.png';
import bearingTech from '../assets/Bearing.png';
import qualityFramework from '../assets/Quality_2.svg';

const translations = {
  EN: {
    heroTitle: "Welcome to Suess Consulting",
    heroSubtitle: "We help manufacturers achieve measurable and sustainable improvements in profitability, operational performance, certification readiness, and leadership capability.",
    btnExplore: "Explore our Services",
    sectionTitle: "Services",
    heading: "What We Do",
    pillar1: "Operations",
    pillar2: "Maintenance",
    pillar3: "Engineering",
    pillar4: "Quality"
  },
  DE: {
    heroTitle: "Willkommen bei Suess Consulting",
    heroSubtitle: "Wir helfen Herstellern, messbare und nachhaltige Verbesserungen der Rentabilität, der betrieblichen Leistung, der Zertifizierungsbereitschaft und der Führungsqualitäten zu erzielen.",
    btnExplore: "Unsere Services",
    sectionTitle: "Dienstleistungen",
    heading: "Was Wir Tun",
    pillar1: "Operations",
    pillar2: "Maintenance",
    pillar3: "Engineering",
    pillar4: "Quality"
  }
};

const LandingPage = () => {
  // Pull the active language memory state parameters directly from App.jsx parent context
  const { lang, setLang } = useOutletContext();
  const t = translations[lang];

  const [openPillar, setOpenPillar] = useState(null);
  const [activeImage, setActiveImage] = useState(defaultRobot);

  const handlePillarToggle = (pillarName, structuralImage) => {
    if (openPillar === pillarName) {
      setOpenPillar(null);
      setActiveImage(defaultRobot);
    } else {
      setOpenPillar(pillarName);
      setActiveImage(structuralImage);
    }
  };

  return (
    <div className="landing-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      
      <style>{`
        .landing-page * { font-family: 'Quicksand', sans-serif !important; }
        .suess-hero-title { font-weight: 500 !important; font-size: 3.8rem; letter-spacing: -0.5px; color: #ffffff !important; }
        .suess-hero-subtitle { font-size: 1.35rem; font-weight: 400 !important; color: rgba(255, 255, 255, 0.9) !important; max-width: 850px; margin: 0 auto; letter-spacing: 0.5px; }
        .btn-explore-services { background-color: transparent !important; border: 2px solid #ffc107 !important; color: #ffffff !important; border-radius: 30px; padding: 12px 40px; font-weight: 500 !important; font-size: 1.15rem; transition: all 0.3s ease-in-out; }
        .btn-explore-services:hover { background-color: #ffc107 !important; color: #343a40 !important; transform: translateY(-2px); }
        .section-flag-title { font-size: 1rem; text-transform: uppercase; font-weight: 500 !important; color: #adb5bd; letter-spacing: 1.5px; display: inline-block; margin-bottom: 5px; }
        .section-flag-line { display: inline-block; width: 80px; height: 3px; background-color: #dc3545; margin-left: 15px; vertical-align: middle; }
        .section-main-heading { font-size: 2.6rem; font-weight: 500 !important; text-transform: uppercase; letter-spacing: -0.5px; color: #343a40; }
        .suess-pillar-card { border: 1px solid #ffc107 !important; border-radius: 12px; overflow: hidden; background-color: #ffffff; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .custom-accordion-header { background-color: #ffffff; color: #343a40 !important; cursor: pointer; transition: all 0.25s ease; }
        .pillar-title-text { font-weight: 400 !important; font-size: 1.75rem !important; }
        .suess-pillar-card:hover .custom-accordion-header { background-color: #dc3545 !important; color: #ffffff !important; }
        .suess-pillar-card:hover .custom-accordion-header .pillar-title-text, .suess-pillar-card:hover .custom-accordion-header .toggle-icon { color: #ffffff !important; }
        .pillar-svg-icon { width: 32px; height: 32px; object-fit: contain; transition: filter 0.2s ease; }
        .suess-pillar-card:hover .pillar-svg-icon { filter: brightness(0) invert(1); }
        .panel-collapse-wrapper { overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; max-height: 0; opacity: 0; }
        .panel-collapse-wrapper.show-panel { max-height: 600px; opacity: 1; }
        .toggle-icon { transition: transform 0.25s ease; display: inline-block; color: #dc3545; }
        .icon-rotated { transform: rotate(45deg); }
        .suess-bullet { color: #ffc107; }
        .sticky-media-panel { position: sticky; top: 140px; }
        .dynamic-showcase-img { width: 100%; height: 480px; object-fit: cover; border-radius: 16px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .lang-toggle-container { position: relative; width: 100%; }
        .lang-toggle-badge { position: absolute; top: -55px; right: 10px; display: flex; gap: 10px; z-index: 15; }
        .lang-btn { background: #343a40; color: #fff; border: 1px solid #ffc107; font-size: 0.85rem; font-weight: 600; border-radius: 20px; padding: 5px 15px; cursor: pointer; transition: all 0.2s ease; }
        .lang-btn.active-lang { background: #ffc107; color: #343a40; }
      `}</style>

           {/* 1. Hero Section integrating full automation graphic backdrop */}
      <section 
        className="text-white px-3 text-center border-bottom border-dark position-relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.75), rgba(33, 37, 41, 0.8)), url(${automationBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '650px', display: 'flex', alignItems: 'center', paddingTop: '140px'
        }}
      >
        <div className="container py-5" style={{ zIndex: 2 }}>
          <h1 className="suess-hero-title mb-3">{t.heroTitle}</h1>
          <p className="suess-hero-subtitle mb-5 lh-md">{t.heroSubtitle}</p>
          <div className="d-flex justify-content-center mt-4">
            <a href="#what-we-do" className="btn btn-explore-services fw-semibold">{t.btnExplore}</a>
          </div>
        </div>
      </section>
      {/* 2. "What We Do" Side-by-Side Content Grid Section */}
      <section id="what-we-do" className="py-5 bg-light px-3">
        <div className="container py-5" style={{ position: 'relative' }}>
          
          {/* Unified Location: Aligned exactly right above the section heading layout boundary */}
          <div className="lang-toggle-badge">
            <button type="button" onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active-lang' : ''}`}>EN</button>
            <button type="button" onClick={() => setLang('DE')} className={`lang-btn ${lang === 'DE' ? 'active-lang' : ''}`}>DE</button>
          </div>

          <div className="text-start mb-5 ps-2">
            <div><span className="section-flag-title">{t.sectionTitle}</span><span className="section-flag-line"></span></div>
            <h2 className="section-main-heading">{t.heading}</h2>
          </div>

          <div className="row g-5 align-items-start">
            
            {/* LEFT COLUMN PANEL: Accordion interface content shifted to the left */}
            <div className="col-lg-7 d-flex flex-column gap-3 bg-transparent">
              
              {/* Pillar 1: Operations */}
              <div className="suess-pillar-card shadow-sm">
                <div className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4" onClick={() => handlePillarToggle('operations', defaultRobot)} style={{ userSelect: 'none' }}>
                  <div className="d-flex align-items-center gap-4">
                    <img src={operationsIcon} alt="Operations" className="pillar-svg-icon" />
                    <span className="pillar-title-text text-dark fs-3">{t.pillar1}</span>
                  </div>
                  <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'operations' ? 'icon-rotated' : ''}`}>+</span>
                </div>
                <div className={`panel-collapse-wrapper ${openPillar === 'operations' ? 'show-panel' : ''}`}>
                  <div className="card-body bg-white py-4 border-top mx-4">
                    <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Value Stream evaluation' : 'Wertstromanalyse & Bewertung'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Lean Management integration' : 'Lean Management Integration'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Lean Management Coaching' : 'Lean Management Coaching & Ausbildung'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Root Cause Analyzes (Six Sigma Based)' : 'Ursachenanalysen (Six Sigma basiert)'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Kaizen Workshops' : 'Kaizen-Workshops'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? '5S integration' : '5S-Integration'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Layout planning/evaluation' : 'Layoutplanung & Flächenbewertung'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Maintenance */}
              <div className="suess-pillar-card shadow-sm">
                <div className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4" onClick={() => handlePillarToggle('maintenance', maintenanceShop)} style={{ userSelect: 'none' }}>
                  <div className="d-flex align-items-center gap-4">
                    <img src={maintenanceIcon} alt="Maintenance" className="pillar-svg-icon" />
                    <span className="pillar-title-text text-dark fs-3">{t.pillar2}</span>
                  </div>
                  <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'maintenance' ? 'icon-rotated' : ''}`}>+</span>
                </div>
                <div className={`panel-collapse-wrapper ${openPillar === 'maintenance' ? 'show-panel' : ''}`}>
                  <div className="card-body bg-white py-4 border-top mx-4">
                    <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'TPM integration (AM, PM, Predictive)' : 'TPM Integration (Autonome, Vorbeugende, Prädiktive Instandhaltung)'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Critical Spare Part Evaluation' : 'Kritische Ersatzteilbewertung'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Critical Machine Evaluation' : 'Anlagen- & Maschinenkritikalitätsanalyse'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Establishment of KPI’s' : 'Einführung von Instandhaltungs-KPIs'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Engineering */}
              <div className="suess-pillar-card shadow-sm">
                <div className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4" onClick={() => handlePillarToggle('engineering', bearingTech)} style={{ userSelect: 'none' }}>
                  <div className="d-flex align-items-center gap-4">
                    <img src={engineeringIcon} alt="Engineering" className="pillar-svg-icon" />
                    <span className="pillar-title-text text-dark fs-3">{t.pillar3}</span>
                  </div>
                  <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'engineering' ? 'icon-rotated' : ''}`}>+</span>
                </div>
                <div className={`panel-collapse-wrapper ${openPillar === 'engineering' ? 'show-panel' : ''}`}>
                  <div className="card-body bg-white py-4 border-top mx-4">
                    <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Engineering Project Management' : 'Technisches Projektmanagement'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'ROI Analyzes' : 'ROI-Berechnungen & Wirtschaftlichkeitsanalysen'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Automation evaluation' : 'Automatisierungsbewertung & Konzepterstellung'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Injection Molding (Process Evaluation, DOE, Tooling)' : 'Spritzguss (Prozessbewertung, DoE Versuchsplanung, Werkzeugtechnik)'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Quality */}
              <div className="suess-pillar-card shadow-sm">
                <div className="custom-accordion-header p-4 d-flex align-items-center justify-content-between fs-4" onClick={() => handlePillarToggle('quality', qualityFramework)} style={{ userSelect: 'none' }}>
                  <div className="d-flex align-items-center gap-4">
                    <img src={qualityIcon} alt="Quality" className="pillar-svg-icon" />
                    <span className="pillar-title-text text-dark fs-3">{t.pillar4}</span>
                  </div>
                  <span className={`fw-bold toggle-icon fs-3 ${openPillar === 'quality' ? 'icon-rotated' : ''}`}>+</span>
                </div>
                <div className={`panel-collapse-wrapper ${openPillar === 'quality' ? 'show-panel' : ''}`}>
                  <div className="card-body bg-white py-4 border-top mx-4">
                    <ul className="list-group list-group-flush text-secondary lh-lg fs-5">
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'ISO 9001 Gap Analyzes' : 'ISO 9001 Audit- & Delta-Analysen'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Hands-On support' : 'Praxisnahe operative Qualitätsunterstützung'}</li>
                      <li className="list-group-item border-0 px-0 py-2"><span className="suess-bullet me-3 fs-4">▪</span> {lang === 'EN' ? 'Audit preparations' : 'Gezielte Vorbereitung auf Zertifizierungsaudits'}</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN PANEL: Dynamic context showcase media graphics shifted to the right */}
            <div className="col-lg-5 sticky-media-panel mb-4 mb-lg-0">
              <img src={activeImage} alt="Suess Consulting Showcase" className="dynamic-showcase-img" />
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;




         






