import React from 'react';
import { useOutletContext } from 'react-router-dom';
import automationBg from '../assets/Automation.png';
import floriImage from '../assets/Me_2.png';
import susanneImage from '../assets/Sue_2.png';

const translations = {
  EN: {
    heroTitle: "About Our Firm",
    heroSubtitle: "Driven by decades of practical shop-floor wisdom, executive operational strategy, and robust compliance engineering.",
    sectionTitle: "Leadership",
    heading: "Managing Partners",
    partnerTag: "Co-Founder & Managing Partner"
  },
  DE: {
    heroTitle: "Über unser Unternehmen",
    heroSubtitle: "Angetrieben von jahrzehntelanger praktischer Erfahrung in der Fertigung, strategischer Betriebsführung und robuster Compliance.",
    sectionTitle: "Führungsteam",
    heading: "Geschäftsführende Gesellschafter",
    partnerTag: "Mitbegründer & Geschäftsführender Partner"
  }
};

const AboutPage = () => {
  const { lang, setLang } = useOutletContext();
  const t = translations[lang];

  return (
    <div className="about-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      <style>{`
        .about-page * { font-family: 'Quicksand', sans-serif !important; font-optical-sizing: auto; }
        .suess-hero-title { font-weight: 500 !important; font-size: 3.8rem; letter-spacing: -0.5px; color: #ffffff !important; }
        .suess-hero-subtitle { font-size: 1.35rem; font-weight: 400 !important; color: rgba(255, 255, 255, 0.9) !important; max-width: 850px; margin: 0 auto; letter-spacing: 0.5px; }
        .section-flag-title { font-size: 1rem; text-transform: uppercase; font-weight: 500 !important; color: #adb5bd; letter-spacing: 1.5px; display: inline-block; margin-bottom: 5px; }
        .section-flag-line { display: inline-block; width: 80px; height: 3px; background-color: #dc3545; margin-left: 15px; vertical-align: middle; }
        .section-main-heading { font-size: 2.6rem; font-weight: 500 !important; text-transform: uppercase; letter-spacing: -0.5px; color: #343a40; }
        .suess-partner-card { border: 1px solid #ffc107 !important; border-radius: 16px; overflow: hidden; background-color: #ffffff; transition: all 0.3s ease-in-out; }
        .suess-partner-card:hover { transform: translateY(-4px); box-shadow: 0 15px 35px rgba(220, 53, 69, 0.1) !important; }
        .partner-img-wrapper { width: 100%; height: 380px; overflow: hidden; }
        .partner-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .suess-partner-card:hover .partner-img { transform: scale(1.03); }
        .partner-meta { font-size: 1.15rem; color: #dc3545; font-weight: 500; letter-spacing: 0.3px; }
        
        .hero-alignment-wrapper { position: absolute; bottom: -68px; left: 0; width: 100%; z-index: 30; }
        .lang-toggle-badge { position: absolute; top: -55px; right: 10px; display: flex; gap: 10px; }
        .lang-btn { background: #343a40; color: #fff; border: 1px solid #ffc107; font-size: 0.85rem; font-weight: 600; border-radius: 20px; padding: 5px 15px; cursor: pointer; transition: all 0.2s ease; }
        .lang-btn.active-lang { background: #ffc107; color: #343a40; }
      `}</style>

      {/* Hero Banner */}
      <section 
        className="text-white px-3 text-center border-bottom border-dark position-relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.75), rgba(33, 37, 41, 0.8)), url(${automationBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '400px', display: 'flex', alignItems: 'center', paddingTop: '140px'
        }}
      >
        <div className="container py-4" style={{ zIndex: 2 }}>
          <h1 className="suess-hero-title mb-3">{t.heroTitle}</h1>
          <p className="suess-hero-subtitle lh-md">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Executive Team Section */}
      <section className="py-5 bg-light px-3">
        <div className="container py-5" style={{ position: 'relative' }}>
          
          <div className="lang-toggle-badge">
            <button type="button" onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active-lang' : ''}`}>EN</button>
            <button type="button" onClick={() => setLang('DE')} className={`lang-btn ${lang === 'DE' ? 'active-lang' : ''}`}>DE</button>
          </div>

          <div className="text-start mb-5 ps-2">
            <div><span className="section-flag-title">{t.sectionTitle}</span><span className="section-flag-line"></span></div>
            <h2 className="section-main-heading">{t.heading}</h2>
          </div>

          <div className="row g-5">
            {/* Card 1: Florian Suess */}
            <div className="col-lg-6">
              <div className="suess-partner-card h-100 shadow-sm d-flex flex-column">
                <div className="partner-img-wrapper border-bottom"><img src={floriImage} alt="Florian Suess" className="partner-img" /></div>
                <div className="card-body p-4 bg-white d-flex flex-column flex-grow-1 justify-content-start">
                  <h3 className="card-title text-dark fw-bold mb-1 fs-3">Florian Suess</h3>
                  <div className="partner-meta mb-3">{t.partnerTag}</div>
                  
                  {lang === 'EN' ? (
                    <>
                      <p className="card-text text-secondary lh-lg fs-6" style={{ textAlign: 'justify' }}>
                        With more than 13 years of experience leading and growing manufacturing businesses, I have built my career around one thing: solving complex problems and turning challenges into opportunities for improvement and growth. My experience spans Tier 1 and Tier 2 manufacturing, as well as the medical device component manufacturing industry. I have led teams and businesses through operational challenges, growth initiatives, performance improvements, and organizational change.
                      </p>
                      <p className="card-text text-secondary lh-lg fs-6 mt-2" style={{ textAlign: 'justify' }}>
                        My expertise combines business leadership, operational excellence, and hands-on technical knowledge. I have extensive experience with injection molding, assembly, and CNC manufacturing, and I am comfortable working through complex technical and operational challenges from the shop floor to the executive level. I believe the best solutions are practical, sustainable, and measurable. Rather than simply identifying problems, I work alongside organizations to understand the root cause, develop the right solution, and turn ideas into lasting results.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="card-text text-secondary lh-lg fs-6" style={{ textAlign: 'justify' }}>
                        Mit mehr als 13 Jahren Erfahrung in der Führung und dem Ausbau von Produktionsunternehmen habe ich meine Karriere auf einer Sache aufgebaut: komplexe Probleme zu lösen und Herausforderungen in Chancen für Verbesserung und Wachstum zu verwandeln. Meine Erfahrung erstreckt sich über die Tier-1- und Tier-2-Automobilzulieferindustrie sowie die Herstellung von Komponenten für Medizinprodukte. Ich habe Teams und Unternehmen erfolgreich durch betriebliche Herausforderungen, Wachstumsinitiativen, Leistungssteigerungen und organisatorische Veränderungen geführt.
                      </p>
                      <p className="card-text text-secondary lh-lg fs-6 mt-2" style={{ textAlign: 'justify' }}>
                        Meine Expertise vereint strategische Unternehmensführung, Operational Excellence und fundiertes technisches Wissen. Ich verfüge über umfangreiche Erfahrung im Spritzguss, der Montage und der CNC-Fertigung und bewege mich sicher bei komplexen technischen und betrieblichen Herausforderungen – vom Hallenboden bis zur Führungsebene. Ich bin davon überzeugt, dass die besten Lösungen praktisch, nachhaltig und messbar sind. Statt nur Probleme aufzuzeigen, arbeite ich partnerschaftlich mit Unternehmen zusammen, um die Ursachen zu verstehen, die richtige Strategie zu entwickeln und Ideen in dauerhafte Ergebnisse umzusetzen.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Susanne Suess */}
            <div className="col-lg-6">
              <div className="suess-partner-card h-100 shadow-sm d-flex flex-column">
                <div className="partner-img-wrapper border-bottom"><img src={susanneImage} alt="Susanne Suess" className="partner-img" /></div>
                <div className="card-body p-4 bg-white d-flex flex-column flex-grow-1 justify-content-start">
                  <h3 className="card-title text-dark fw-bold mb-1 fs-3">Susanne Suess</h3>
                  <div className="partner-meta mb-3">{t.partnerTag}</div>
                  
                  {lang === 'EN' ? (
                    <p className="card-text text-secondary lh-lg fs-6" style={{ textAlign: 'justify' }}>
                      With more than 20 years of experience in Quality, Manufacturing, and Document Control, Susanne Suess brings extensive expertise across the automotive, medical device, and drug delivery industries. Her background includes Quality Engineering roles with Tier 2 automotive suppliers and specialized experience in document control within highly regulated medical and pharmaceutical environments. Her expertise spans ISO 9001, IATF 16949, and ISO 13485, with a strong focus on quality systems, controlled documentation, compliance, process improvement, and manufacturing excellence. She combines a structured, detail-oriented approach with practical industry experience to help organizations establish robust and sustainable quality processes.
                    </p>
                  ) : (
                    <p className="card-text text-secondary lh-lg fs-6" style={{ textAlign: 'justify' }}>
                      Mit mehr als 20 Jahren Erfahrung in den Bereichen Qualität, Fertigung und Dokumentenlenkung bringt Susanne Suess umfassende Expertise aus der Automobil-, Medizinprodukt- und Pharmaindustrie ein. Ihr Hintergrund umfasst Funktionen im Quality Engineering bei Tier-2-Automobilzulieferern sowie spezialisierte Erfahrung in der Dokumentenlenkung in streng regulierten medizinischen und pharmazeutischen Umgebungen. Ihr Fachwissen erstreckt sich über ISO 9001, IATF 16949 und ISO 13485, mit einem starken Fokus auf Qualitätsmanagementsysteme, gelenkte Dokumentation, Compliance, Prozessverbesserung und operative Exzellenz. Sie verbindet einen strukturierten, detailorientierten Ansatz mit praktischer Industrieerfahrung, um Unternehmen beim Aufbau robuster und nachhaltiger Qualitätsprozesse zu unterstützen.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AboutPage;

