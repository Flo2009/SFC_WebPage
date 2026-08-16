import React, { useState, useEffect } from 'react'; // Consolidated core React states
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Consolidated Router properties
import Nav from './components/Nav';
import FootNav from './components/FootNav';
// import ChatBot from './components/UI/ChatBot';

function App() {
  // Master language state parameter managed globally at the root layout tree
  const [lang, setLang] = useState('EN');
  
  const location = useLocation();
  const navigate = useNavigate();

  // ENTERPRISE SESSION PROTECTION HANDSHAKE HANDLER LAYER
   // ENTERPRISE SESSION PROTECTION HANDSHAKE HANDLER LAYER
  useEffect(() => {
    const isNewSession = !sessionStorage.getItem('suess_session_initialized');
    
    if (isNewSession) {
      sessionStorage.setItem('suess_session_initialized', 'true');
      
      // Scans current path location against your dynamic environment token path parameter
      const secretPath = import.meta.env.VITE_SECRET_PORTAL_PATH;
      if (location.pathname !== '/' && location.pathname !== secretPath) {
        navigate('/');
      }
    }
  }, [location.pathname, navigate]);


  return (
    <>
      {/* Pass language data to navigation links if needed */}
      <Nav lang={lang} setLang={setLang} />

      {/* Outlet context allows sub-pages (Landing, About, Contact, Blog) to read and modify language state */}
      <Outlet context={{ lang, setLang }} />

      {/* Pinned conversational assistant widget */}
      {/* <ChatBot lang={lang} /> */}

      <FootNav lang={lang} />
    </>
  );
}

export default App;



