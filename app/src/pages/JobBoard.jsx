import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import automationBg from '../assets/Automation.png';

const translations = {
  EN: {
    heroTitle: "Talent Acquisition Board",
    heroSubtitle: "Explore premium engineering vacancies and corporate leadership positions. Upload your CV directly via our AI assistant to apply.",
    sectionTitle: "Placements",
    heading: "Available Openings",
    lblLocation: "Location",
    lblSalary: "Compensation Package",
    lblRequirements: "Target Requirements / Stack Profile",
    btnApply: "Apply for this Role",
    lblEmpty: "No open mandates match this specific vertical track at the moment.",
    lblLoading: "Fetching available vacancies out of registry...",
    optAll: "All Mandates",
    optEng: "Engineering",
    optMgmt: "Management",
    
    // Recruiter Chat Translations
    chatHeader: "Suess Recruiter Intake AI",
    chatPlaceholder: "Type a message or drag a CV here...",
    chatWelcome: "Hello! I am your dedicated Suess Talent Intake Assistant. Are you exploring an Engineering or Management track? Please share your background or upload your resume file directly here to begin your intake screening process!"
  },
  DE: {
    heroTitle: "Talent-Akquisitions-Board",
    heroSubtitle: "Entdecken Sie erstklassige Stellenangebote im Ingenieurwesen und Führungspositionen. Laden Sie Ihren Lebenslauf direkt über unseren KI-Assistenten hoch.",
    sectionTitle: "Vermittlung",
    heading: "Offene Vakanzen",
    lblLocation: "Standort",
    lblSalary: "Vergütungspaket",
    lblRequirements: "Zielanforderungen / Profil-Stack",
    btnApply: "Für diese Vakanz bewerben",
    lblEmpty: "Aktuell entsprechen keine offenen Mandate diesem spezifischen Track.",
    lblLoading: "Verfügbare Vakanzen werden geladen...",
    optAll: "Alle Mandate",
    optEng: "Ingenieurwesen",
    optMgmt: "Management",
    
    // Recruiter Chat Translations
    chatHeader: "Suess Recruiter Intake KI",
    chatPlaceholder: "Nachricht eingeben oder CV hierher ziehen...",
    chatWelcome: "Hallo! Ich bin Ihr engagierter Suess Talent Intake Assistant. Suchen Sie nach einer Position im Bereich Ingenieurwesen oder Management? Teilen Sie mir Ihren Hintergrund mit oder laden Sie Ihren Lebenslauf direkt hier hoch, um das Screening zu starten!"
  }
};

const JobBoard = () => {
  const { lang } = useOutletContext();
  const t = translations[lang || 'EN'];

  const [activePillar, setActivePillar] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [uiLoading, setUiLoading] = useState(true);

  // 🤖 AI Chat Widget States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: translations[lang || 'EN'].chatWelcome }
  ]);
  const [aiResponding, setAiResponding] = useState(false);
  const chatBottomRef = useRef(null);
  // 🤖 Locate your AI Chat Widget States inside PART 1 and add this line:
  const [canUpload, setCanUpload] = useState(false); // 🔒 GATES ACCESS UNTIL SCREENED

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // Matches your 'All Mandates', 'Engineering', 'Management' tabs
  const [selectedJob, setSelectedJob] = useState(null); // Tracks which public job is clicked for its PDF view
  // Update welcome message dynamically if user switches language toggles mid-session
  useEffect(() => {
    setChatHistory(prev => {
      if (prev.length === 1 && (prev[0].content === translations.EN.chatWelcome || prev[0].content === translations.DE.chatWelcome)) {
        return [{ role: 'assistant', content: t.chatWelcome }];
      }
      return prev;
    });
  }, [lang, t.chatWelcome]);

  // Auto-scrolls the chat window container down to track new text bubbles smoothly
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatOpen]);

  // 💼 JOB BOARD FETCH ENGINE: Connects to your live database positions
  const fetchLiveOpenings = async () => {
    try {
      setUiLoading(true);
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query SynchronizeJobBoard {
              getAllJobs {
                _id
                title
                companyName
                description
                requirements
                location
                salaryRange
                imageUrl
                createdAt
              }
            }
          `
        })
      });

      const result = await response.json();
      if (result?.data?.getAllJobs) {
        setJobs(result.data.getAllJobs);
      }
    } catch (err) {
      console.error("Critical error streaming career positions via API:", err);
    } finally {
      setUiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOpenings();
  }, []);

  // 🚀 LIVE PUBLIC DATABASE SYNC ENGINE: Fetches real-time entries out of MongoDB!
  const fetchPublicJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `{ getAllJobsPublic { _id title pillar description location jdPdfData } }` 
        })
      });
      const result = await response.json();
      if (result?.data?.getAllJobsPublic) {
        setJobs(result.data.getAllJobsPublic);
      }
    } catch (err) {
      console.error("Public job pipeline fetch drop:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Run the sync engine automatically the moment the page mounts to clear out empty placeholders
  useEffect(() => {
    fetchPublicJobs();
  }, []);

  // 🚀 RESTORED STANDARD INTAKE ENGINE: Fixes array extraction strings natively
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || aiResponding) return;

    // INTERCEPT PACKETS: If the string holds a Base64 file payload, channel it down the secure sandbox route!
    if (chatInput.includes(" | DATA:")) {
      setAiResponding(true);
      try {
        const parts = chatInput.split(" | DATA:");
        
        // 🎯 THE FIXED ARRAY EXTRACTORS: Correctly references array indices 0 and 1 as strings!
        const fileName = parts[0].replace("[Secure PDF Loaded: ", "");
        const fileData = parts[1].replace("]", "");

        // Send the payload cleanly down its own dedicated, high-capacity sandbox channel!
        const response = await fetch('http://localhost:3001/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation SubmitResumeFile($fileName: String!, $fileData: String!, $email: String!) {
                processSecureResumeIntake(fileName: $fileName, fileData: $fileData, email: $email) {
                  _id
                  name
                  assignedPillar
                }
              }
            `,
            variables: {
              fileName: fileName,
              fileData: fileData,
              email: "applicant@suess-recruiting.com"
            }
          })
        });

        const result = await response.json();
        
        if (result?.data?.processSecureResumeIntake) {
          const profile = result.data.processSecureResumeIntake;
          setChatHistory(prev => [
            ...prev,
            { role: 'user', content: `📄 Submitted Resume: ${fileName}` },
            { role: 'assistant', content: `Thank you! Your resume has been safely processed by our secure sandboxed network layers. Your profile has been automatically sorted into our [${profile.assignedPillar}] talent pipeline registry.` }
          ]);
          setChatInput('');
        } else {
          console.error("Secure intake mapping drop error logs:", result.errors);
          setChatHistory(prev => [...prev, { role: 'assistant', content: "Our system encountered an error reading this PDF structure." }]);
          setChatInput('');
        }
      } catch (err) {
        console.error("Intake pipe error:", err);
      } finally {
        setAiResponding(false);
      }
      return; 
    }

    // Standard Lightweight Text Conversation Stream
    const userMessage = { role: 'user', content: chatInput.trim() };
    const updatedHistory = [...chatHistory, userMessage];
    
    setChatHistory(updatedHistory);
    setChatInput('');
    setAiResponding(true);

    try {
      const cleanPayloadHistory = updatedHistory.map(({ role, content }) => ({ role, content }));

      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation RequestAiReply($history: [ChatMessageInput!]!) {
              sendAssistantMessage(history: $history)
            }
          `,
          variables: { history: cleanPayloadHistory }
        })
      });

      const result = await response.json();
      const aiReplyText = result?.data?.sendAssistantMessage;

      if (aiReplyText) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: aiReplyText }]);
        const lowerReply = aiReplyText.toLowerCase();
        if (lowerReply.includes('upload') || lowerReply.includes('resume') || lowerReply.includes('cv') || lowerReply.includes('document')) {
          setCanUpload(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch text reply:", err);
    } finally {
      setAiResponding(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activePillar === 'All' || activePillar === 'All Mandates') return true;
    return job.pillar === activePillar;
  });

  return (
    <div className="job-board-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      <style>{`
        .job-board-page * { font-family: 'Quicksand', sans-serif !important; }
        .suess-hero-title { font-weight: 500 !important; font-size: 3.8rem; letter-spacing: -0.5px; color: #ffffff !important; }
        .suess-hero-subtitle { font-size: 1.35rem; font-weight: 400 !important; color: rgba(255, 255, 255, 0.9) !important; max-width: 850px; margin: 0 auto; letter-spacing: 0.5px; }
        .section-flag-title { font-size: 1rem; text-transform: uppercase; font-weight: 500 !important; color: #adb5bd; letter-spacing: 1.5px; display: inline-block; margin-bottom: 5px; }
        .section-flag-line { display: inline-block; width: 80px; height: 3px; background-color: #dc3545; margin-left: 15px; vertical-align: middle; }
        .section-main-heading { font-size: 2.6rem; font-weight: 500 !important; text-transform: uppercase; letter-spacing: -0.5px; color: #343a40; }
        
        .job-recruitment-card { border: 1px solid #e0e0e0; border-left: 5px solid #dc3545 !important; border-radius: 12px; background-color: #ffffff; transition: all 0.25s ease-in-out; }
        .job-recruitment-card:hover { border-left: 5px solid #ffc107 !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
        .pillar-badge { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; display: inline-block; }
        .pillar-tab-pill { background: transparent; border: 1px solid #dee2e6; color: #495057; font-weight: 600; padding: 8px 24px; border-radius: 25px; transition: all 0.2s ease; cursor: pointer; }
        .pillar-tab-pill.active-pillar-tab { background: #343a40; color: #ffffff; border-color: #343a40; }
        
        /* FLOATING CHAT ASSISTANT WIDGET STYLES */
        .floating-chat-trigger-bubble { position: fixed; bottom: 30px; right: 30px; width: 65px; height: 65px; background: #343a40; border: 2px solid #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.15); transition: all 0.2s ease; z-index: 999999 !important; }
        .floating-chat-trigger-bubble:hover { transform: scale(1.05); background: #dc3545; border-color: #ffffff; }
        .ai-assistant-chat-window { position: fixed; bottom: 110px; right: 30px; width: 380px; height: 500px; background: #ffffff; border-radius: 16px; border: 1px solid #dee2e6; box-shadow: 0 12px 35px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; z-index: 999999 !important; transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .chat-header-bar { background: #212529; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ffc107; }
        .chat-body-stream { flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #f8f9fa; }
        .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 14px; font-size: 0.95rem; line-height: 1.5; word-wrap: break-word; }
        .chat-bubble.user { background: #ffc107; color: #343a40; align-self: flex-end; border-bottom-right-radius: 2px; font-weight: 500; }
        .chat-bubble.assistant { background: #ffffff; color: #212529; align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid #dee2e6; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .chat-footer-input-row { padding: 15px; background: #ffffff; border-top: 1px solid #dee2e6; display: flex; gap: 10px; }
        
        .hero-alignment-wrapper { position: absolute; bottom: -68px; left: 0; width: 100%; z-index: 30; }
        .lang-toggle-badge { display: flex; gap: 10px; float: right; padding-right: 15px; }
        .lang-btn { background: #343a40 !important; color: #fff !important; border: 1px solid #ffc107 !important; font-size: 0.85rem; font-weight: 600; border-radius: 20px; padding: 5px 15px; cursor: pointer; transition: all 0.2s ease; }
        .lang-btn.active-lang { background: #ffc107 !important; color: #343a40 !important; }
        
        @media (max-width: 576px) {
          .ai-assistant-chat-window { width: calc(100vw - 40px); right: 20px; bottom: 100px; height: 450px; }
          .floating-chat-trigger-bubble { bottom: 20px; right: 20px; }
        }
      `}</style>

      {/* Hero Banner Section */}
      <section className="text-white px-3 text-center border-bottom border-dark position-relative" style={{ backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.75), rgba(33, 37, 41, 0.8)), url(${automationBg})`, backgroundSize: 'cover', minHeight: '400px', display: 'flex', alignItems: 'center', paddingTop: '140px' }}>
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

      {/* Main Content Interface Careers Layer */}
      <section className="py-5 bg-light px-3">
        <div className="container py-4" style={{ maxWidth: '850px', position: 'relative' }}>
          
          <div className="text-start mb-4 ps-2">
            <div><span className="section-flag-title">{t.sectionTitle}</span><span className="section-flag-line"></span></div>
            <h2 className="section-main-heading mb-0">{t.heading}</h2>
          </div>

          {/* PILLAR FILTER HOOK TABS CONTROLS */}
          <div className="d-flex gap-2 mb-5 border-bottom pb-3 overflow-x-auto" style={{ width: '100%' }}>
            <button onClick={() => { setActivePillar('All'); setSelectedJob(null); }} className={`pillar-tab-pill ${activePillar === 'All' ? 'active-pillar-tab' : ''}`}>{t.optAll || 'All Mandates'}</button>
            <button onClick={() => { setActivePillar('Engineering'); setSelectedJob(null); }} className={`pillar-tab-pill ${activePillar === 'Engineering' ? 'active-pillar-tab' : ''}`}>{t.optEng || 'Engineering'}</button>
            <button onClick={() => { setActivePillar('Management'); setSelectedJob(null); }} className={`pillar-tab-pill ${activePillar === 'Management' ? 'active-pillar-tab' : ''}`}>{t.optMgmt || 'Management'}</button>
          </div>

                {/* /* OPEN POSITIONS STREAM LISTENER */}
          <div className="row g-4">
            
            {/* 🚀 LEFT SHEET: DYNAMIC SYSTEM VACANCIES INDEX (SPANS FULL WIDTH UNTIL A PROFILE IS CLICKED) */}
            <div className={selectedJob ? "col-lg-7" : "col-12"}>
              <div className="d-flex flex-column gap-4 w-100">
                {uiLoading ? (
                  <div className="text-center py-5 text-muted">{translations[lang || 'EN'].lblLoading || "Loading live job metrics..."}</div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-white shadow-sm p-4">
                    {translations[lang || 'EN'].lblEmpty || "No open mandates match this specific vertical track at the moment."}
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <article 
                      key={job._id} 
                      onClick={() => setSelectedJob(job)} // 🎯 Captures and opens the visual PDF specification drawer!
                      className="job-recruitment-card p-4 p-md-5 shadow-sm bg-white w-100 rounded-3 cursor-pointer"
                      style={{ 
                        transition: 'all 0.2s', 
                        cursor: 'pointer', 
                        border: selectedJob?._id === job._id ? '2px solid #ffc107' : '1px solid #dee2e6' 
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <span className={`badge ${job.pillar === 'Engineering' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning-emphasis'} px-3 py-2 rounded-pill small fw-bold`}>
                          {job.pillar}
                        </span>
                        <small className="text-muted fw-medium">{job.company || "Suess Consulting Client"}</small>
                      </div>

                      <h3 className="text-dark fw-bold mb-3 h4">{job.title}</h3>
                      <p className="text-secondary lh-lg mb-4 text-truncate" style={{ textAlign: 'justify', whiteSpace: 'pre-line', maxHeight: '75px' }}>
                        {job.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center border-top pt-3 flex-wrap gap-3 mt-auto text-muted small">
                        <div><strong>{translations[lang || 'EN'].lblLocation || "📍 Location:"}</strong> {job.location || "Remote / Hybrid"}</div>
                        <span className="text-warning small fw-bold">Click to view official JD PDF ➔</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* 🚀 RIGHT SHEET: OFFICIAL COMPANY PDF SPECIFICATIONS PREVIEW DRAWER */}
            {selectedJob && (
              <div className="col-lg-5">
                <div className="card p-4 border bg-white shadow-sm rounded-3 position-sticky" style={{ top: '100px' }}>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <h3 className="h5 fw-bold text-dark m-0">📄 Official Specification</h3>
                    <button 
                      className="btn-close" 
                      onClick={() => setSelectedJob(null)} 
                      style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', color: '#6c757d' }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <h4 className="fw-bold text-dark h5 m-0 mb-1">{selectedJob.title}</h4>
                  <p className="text-muted small mb-3">
                    Review requirements specifications below. Open our floating AI assistant chatbot bubble right here on your screen to apply instantly!
                  </p>
                  
                  {selectedJob.jdPdfData ? (
                    /* 🎯 EXPLICIT FORMAT RE-COMPOSITION: Renders your clean backend file text strings natively without errors! */
                    <iframe
                      src={`data:application/pdf;base64,${selectedJob.jdPdfData}`}
                      title="Official Job Specification Document Preview"
                      width="100%"
                      height="550px"
                      style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff' }}
                    />
                  ) : (
                    /* Standard plain-text description placeholder if a role was posted without an attached PDF file asset */
                    <div className="bg-white p-3 rounded border text-secondary small style-scroll" style={{ maxHeight: '350px', overflowY: 'auto', whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                      {selectedJob.description}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div> {/* Closes your primary row wrapper block layout */}

        </div>
      </section>

      {/* FLOATING INTERACTIVE CHAT ASSISTANT WIDGET */}
      <div className="floating-chat-trigger-bubble" onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? "✕" : "🤖"}
      </div>

      {chatOpen && (
        <div className="ai-assistant-chat-window">
          <div className="chat-header-bar">
            <span className="fw-bold fs-6 m-0">🛠️ {t.chatHeader}</span>
            <small className="badge bg-success text-white px-2 py-1" style={{ fontSize: '0.7rem' }}>Local Llama 3.1</small>
          </div>
          
          <div className="chat-body-stream">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {aiResponding && (
              <div className="chat-bubble assistant text-muted d-flex gap-2 align-items-center">
                <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                Thinking locally...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          
          <form onSubmit={handleSendChatMessage} className="chat-footer-input-row flex-column gap-2" style={{ padding: '15px', background: '#ffffff', borderTop: '1px solid #dee2e6' }}>
            
            {/* CONDITION 1: Shows the Secure PDF drop box IF unlocked by your local AI recruiter */}
            {canUpload ? (
              <div className="w-100 d-flex align-items-center bg-light p-2 rounded border" style={{ borderLeft: '3px solid #ffc107 !important' }}>
                <label htmlFor="cvUpload" className="btn btn-sm btn-warning rounded-pill px-3 m-0 fw-bold" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  📎 Attach CV (PDF Only)
                </label>
                                <input 
                  type="file" 
                  id="cvUpload" 
                  accept=".pdf" 
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const uploadedFilesList = e.target.files;
                    if (!uploadedFilesList || uploadedFilesList.length === 0) return;
                    const targetFile = uploadedFilesList[0];
                    
                    if (targetFile.size > 5 * 1024 * 1024) {
                      alert("File size boundaries exceeded. Please upload a PDF smaller than 5MB.");
                      return;
                    }
                    if (targetFile.type !== "application/pdf") {
                      alert("Security Restriction: Only authentic PDF documents are sanctioned for intake.");
                      return;
                    }

                    // Put a temporary visual notification inside the chat input box while loading bytes
                    setChatInput(`[Processing Secure Intake: ${targetFile.name}...]`);
                    
                    const fileDataStreamReader = new FileReader();
                    fileDataStreamReader.onload = async (event) => {
                      // Extract only the raw data text fragment out of the FileReader
                      const base64Parts = event.target.result.split(',');
                      const pureBase64Data = base64Parts[1];
                      
                      // 🚀 RESTORE THE ORIGINAL DATA MASHING:
                      // Put the entire string back into chatInput so the text box handles it exactly like before!
                      setChatInput(`[Secure PDF Loaded: ${targetFile.name} | DATA:${pureBase64Data}]`);
                    };
                    fileDataStreamReader.readAsDataURL(targetFile);
                  }}
                />

                <small className="text-muted text-truncate ms-2" style={{ fontSize: '0.75rem' }}>
                  📄 PDF Secured & Ready!
                </small>
              </div>
            ) : (
              /* CONDITION 2: Standard informational guide row asking user to chat first */
              <div className="w-100 text-center bg-light p-2 rounded border border-dashed">
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  🤖 Chat with the intake AI to open the secure resume upload drawer.
                </small>
              </div>
            )}

            {/* THE ALWAYS-VISIBLE TEXT INPUT ELEMENT ROW LAYOUT */}
            <div className="w-100 d-flex gap-2 align-items-center mt-1">
              <input 
                type="text" 
                className="form-control rounded-pill border-secondary-subtle px-3" 
                style={{ height: '42px', fontSize: '0.95rem' }}
                placeholder={t.chatPlaceholder} 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                disabled={aiResponding}
              />
              <button 
                type="submit" 
                className="btn btn-warning rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                style={{ width: '42px', height: '42px', minWidth: '42px', border: 'none', color: '#212529' }} 
                disabled={aiResponding || !chatInput.trim()}
              >
                ➔
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobBoard;





      

