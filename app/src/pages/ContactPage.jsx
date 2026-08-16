import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isValidPhoneNumber } from 'libphonenumber-js'; // Fixed syntax: added curly braces!
import { transmitFormPayload } from '../main'; 
import { SUBMIT_INQUIRY } from '../utils/mutations'; 
import { validateEmail } from '../utils/helpers';     
import automationBg from '../assets/Automation.png';   

const translations = {
  EN: {
    heroTitle: "Connect With Us",
    heroSubtitle: "Whether you need operational troubleshooting, certification optimization, or specialized manufacturing consulting.",
    sectionTitle: "Inquiry",
    heading: "Contact Form",
    successHeading: "Inquiry Submitted Successfully!",
    successText: "Thank you for reaching out to Suess Consulting. Your details are securely saved, and a managing partner will review your inquiry shortly.",
    btnAnother: "Submit Another Message",
    lblName: "Full Name",
    lblEmail: "Email Address",
    lblPhone: "Phone Number",
    lblLocation: "Location",
    lblType: "I am contacting regarding:",
    lblContact: "Preferred Contact Method:",
    lblMessage: "Message / Project Parameters",
    phMessage: "Briefly describe your operational bottlenecks, injection molding tolerances, or certification goals...",
    optClient: "Business / Project Manufacturing Consulting",
    optCandidate: "Candidate / Recruiting Application (Prepared Option)",
    optEmail: "Email",
    optPhone: "Direct Phone Call",
    optWhatsapp: "WhatsApp Message",
    valRequired: "Please fill out all required fields (Name, Email, and Message).",
    valEmail: "Please enter a valid email address.",
    valPhone: "Please enter a valid phone number for the selected country.",
    valDatabase: "Database submission failed. Ensure your Node background server is active.",
    btnSubmit: "Send Inquiry",
    btnTrans: "Transmitting to Server..."
  },
  DE: {
    heroTitle: "Kontaktieren Sie uns",
    heroSubtitle: "Egal, ob Sie betriebliche Fehlersuche, Zertifizierungsoptimierung oder spezialisierte Fertigungsberatung benötigen.",
    sectionTitle: "Anfrage",
    heading: "Kontaktformular",
    successHeading: "Anfrage erfolgreich übermittelt!",
    successText: "Vielen Dank, dass Sie sich an Suess Consulting gewendet haben. Ihre Daten wurden sicher gespeichert, und ein geschäftsführender Partner wird Ihre Anfrage in Kürze prüfen.",
    btnAnother: "Weitere Nachricht senden",
    lblName: "Vollständiger Name",
    lblEmail: "E-Mail-Adresse",
    lblPhone: "Telefonnummer",
    lblLocation: "Standort",
    lblType: "Ich kontaktiere Sie bezüglich:",
    lblContact: "Bevorzugte Kontaktmethode:",
    lblMessage: "Nachricht / Projektparameter",
    phMessage: "Beschreiben Sie kurz Ihre betrieblichen Engpässe, Spritzgusstoleranzen oder Zertifizierungsziele...",
    optClient: "Unternehmen / Projektbezogene Fertigungsberatung",
    optCandidate: "Bewerber / Rekrutierungsantrag (Vorbereitete Option)",
    optEmail: "E-Mail",
    optPhone: "Direkter Telefonanruf",
    optWhatsapp: "WhatsApp-Nachricht",
    valRequired: "Bitte füllen Sie alle Pflichtfelder aus (Name, E-Mail und Nachricht).",
    valEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    valPhone: "Bitte geben Sie eine gültige Telefonnummer für das ausgewählte Land ein.",
    valDatabase: "Datenbankübermittlung fehlgeschlagen. Stellen Sie sicher, dass Ihr Node-Hintergrundserver aktiv ist.",
    btnSubmit: "Anfrage senden",
    btnTrans: "Übertragung zum Server..."
  }
};

const ContactPage = () => {
  const { lang, setLang } = useOutletContext();
  const t = translations[lang];

  // Map selections to explicit ISO 2-letter country codes required by libphonenumber
  const [countryMap, setCountryMap] = useState({ prefix: '+1', iso: 'US' });
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [formState, setFormData] = useState({
    name: '', email: '', type: 'CLIENT', message: '', location: '', preferredContact: 'EMAIL'
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbSubmitError, setDbSubmitError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formState, [name]: value });
    setErrorMessage('');
    setDbSubmitError(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setDbSubmitError(false);
    
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage(t.valRequired);
      return;
    }

    if (!validateEmail(formState.email)) {
      setErrorMessage(t.valEmail);
      return;
    }

    // Combine separate area code selection and number field cleanly
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const fullCombinedPhone = digitsOnly ? `${countryMap.prefix}${digitsOnly}` : '';
    
    if (fullCombinedPhone) {
      // Passes full string and target ISO (DE, US, etc.) to evaluate local dial configurations
      const phoneCheck = isValidPhoneNumber(fullCombinedPhone, countryMap.iso);
      if (!phoneCheck) {
        setErrorMessage(t.valPhone);
        return;
      }
    }

    setLoading(true);

    try {
      await transmitFormPayload(SUBMIT_INQUIRY, {
        ...formState,
        phone: fullCombinedPhone
      });
      setSuccessMessage(true);
      setPhoneNumber('');
      setFormData({ name: '', email: '', type: 'CLIENT', message: '', location: '', preferredContact: 'EMAIL' });
    } catch (err) {
      console.error("Database connection failure:", err);
      setDbSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      
      <style>{`
        .contact-page * { font-family: 'Quicksand', sans-serif !important; font-optical-sizing: auto; }
        .suess-hero-title { font-weight: 500 !important; font-size: 3.8rem; letter-spacing: -0.5px; color: #ffffff !important; }
        .suess-hero-subtitle { font-size: 1.35rem; font-weight: 400 !important; color: rgba(255, 255, 255, 0.9) !important; max-width: 850px; margin: 0 auto; letter-spacing: 0.5px; }
        .section-flag-title { font-size: 1rem; text-transform: uppercase; font-weight: 500 !important; color: #adb5bd; letter-spacing: 1.5px; display: inline-block; margin-bottom: 5px; }
        .section-flag-line { display: inline-block; width: 80px; height: 3px; background-color: #dc3545; margin-left: 15px; vertical-align: middle; }
        .section-main-heading { font-size: 2.6rem; font-weight: 500 !important; text-transform: uppercase; letter-spacing: -0.5px; color: #343a40; }
        .suess-form-card { border: 1px solid #ffc107 !important; border-radius: 16px; background-color: #ffffff; }
        .form-control:focus, .form-select:focus { border-color: #ffc107 !important; box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important; }
        .btn-suess-submit { background-color: #dc3545 !important; border: none !important; color: white !important; font-weight: 600; font-size: 1.1rem; padding: 12px; border-radius: 30px; transition: all 0.2s ease-in-out; }
        .btn-suess-submit:hover { background-color: #b52a37 !important; transform: translateY(-1px); }
        
        .hero-alignment-wrapper { position: absolute; bottom: -68px; left: 0; width: 100%; z-index: 30; }
        .lang-toggle-badge { display: flex; gap: 10px; float: right; padding-right: 15px; }
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
        <div className="container position-relative w-100" style={{ zIndex: 2 }}>
          <h1 className="suess-hero-title mb-3">{t.heroTitle}</h1>
          <p className="suess-hero-subtitle lh-md mb-3">{t.heroSubtitle}</p>
          
          <div className="hero-alignment-wrapper">
            <div className="lang-toggle-badge">
              <button type="button" onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active-lang' : ''}`}>EN</button>
              <button type="button" onClick={() => setLang('DE')} className={`lang-btn ${lang === 'DE' ? 'active-lang' : ''}`}>DE</button>
            </div>
          </div>
        </div>
      </section>

          {/* Form Section Layer */}
      <section className="py-5 bg-light px-3">
        <div className="container py-4">
          
          <div className="text-start mb-5 ps-2">
            <div>
              <span className="section-flag-title">{t.sectionTitle}</span>
              <span className="section-flag-line"></span>
            </div>
            <h2 className="section-main-heading">{t.heading}</h2>
          </div>

          <div className="mx-auto" style={{ maxWidth: '750px' }}>
            <div className="suess-form-card p-4 p-md-5 shadow-sm">
              {successMessage ? (
                <div className="text-center py-5">
                  <span style={{ fontSize: '50px' }}>🎉</span>
                  <h3 className="mt-3 fw-bold text-success">{t.successHeading}</h3>
                  <p className="text-muted mt-2">{t.successText}</p>
                  <button onClick={() => setSuccessMessage(false)} className="btn btn-outline-secondary btn-sm mt-4 px-4 rounded-pill">{t.btnAnother}</button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblName} <span className="text-danger">*</span></label>
                      <input type="text" name="name" className="form-control" placeholder="John Doe" value={formState.name} onChange={handleInputChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblEmail} <span className="text-danger">*</span></label>
                      <input type="email" name="email" className="form-control" placeholder="john@company.com" value={formState.email} onChange={handleInputChange} />
                    </div>

                    {/* Phone Selector tracking both prefixes and formal ISO markers */}
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblPhone}</label>
                      <div className="input-group">
                        <select 
                          className="form-select" 
                          style={{ maxWidth: '110px', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}
                          value={`${countryMap.prefix},${countryMap.iso}`}
                          onChange={(e) => {
                            const [prefix, iso] = e.target.value.split(',');
                            setCountryMap({ prefix, iso });
                            setErrorMessage('');
                          }}
                        >
                          <option value="+1,US">🇺🇸 +1</option>
                          <option value="+49,DE">🇩🇪+49</option>
                          <option value="+44,GB">🇬🇧 +44</option>
                          <option value="+41,CH">🇨🇭 +41</option>
                          <option value="+43,AT">🇦🇹 +43</option>
                        </select>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="123-456-7890" 
                          value={phoneNumber} 
                          onChange={(e) => { setPhoneNumber(e.target.value); setErrorMessage(''); }} 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblLocation}</label>
                      <input type="text" name="location" className="form-control" placeholder="Atlanta, USA" value={formState.location} onChange={handleInputChange} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblType}</label>
                      <select name="type" className="form-select" value={formState.type} onChange={handleInputChange}>
                        <option value="CLIENT">{t.optClient}</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">{t.lblContact}</label>
                      <select name="preferredContact" className="form-select" value={formState.preferredContact} onChange={handleInputChange}>
                        <option value="EMAIL">{t.optEmail}</option>
                        <option value="PHONE">{t.optPhone}</option>
                        <option value="WHATSAPP">{t.optWhatsapp}</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-dark fw-semibold small">{t.lblMessage} <span className="text-danger">*</span></label>
                      <textarea name="message" className="form-control" rows="5" placeholder={t.phMessage} value={formState.message} onChange={handleInputChange} />
                    </div>
                  </div>

                  {errorMessage && <div className="alert alert-danger p-2 small mt-4">{errorMessage}</div>}
                  {dbSubmitError && <div className="alert alert-danger p-2 small mt-4">{t.valDatabase}</div>}

                  <button type="submit" disabled={loading} className="btn btn-suess-submit w-100 mt-4 shadow-sm">
                    {loading ? t.btnTrans : t.btnSubmit}
                  </button>

                </form>
              )}
            </div>
          </div>
          
        </div>
      </section>
      
    </div>
  );
};

export default ContactPage;










