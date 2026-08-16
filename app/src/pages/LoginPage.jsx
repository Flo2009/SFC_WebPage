import React, { useState } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import automationBg from '../assets/Automation.png';

const translations = {
  EN: {
    heading: "Management Dashboard",
    subheading: "Authorized access tracking gateway for Suess Consulting platform configurations.",
    lblEmail: "Corporate Email Address",
    lblPassword: "Security Password Identifier",
    btnLogin: "Secure Login",
    btnProcessing: "Authenticating...",
    valRequired: "All fields are required to establish an identity handshake loop.",
    regHeading: "Seeded Administrator Enrollment",
    regSubheading: "Register a fresh platform controller profile into the MongoDB user registry.",
    lblUsername: "Account Username Label",
    btnRegister: "Register Secure Profile",
    regSuccess: "Account initialized successfully! Proceeding to verify credentials lock loops."
  },
  DE: {
    heading: "Management-Dashboard",
    subheading: "Autorisiertes Zugangs-Gateway für Konfigurationen der Suess Consulting Plattform.",
    lblEmail: "Unternehmens-E-Mail-Adresse",
    lblPassword: "Sicherheits-Passwortkennung",
    btnLogin: "Sicher Anmelden",
    btnProcessing: "Anmeldedaten werden überprüft...",
    valRequired: "Alle Felder müssen ausgefüllt werden, um die Identität zu bestätigen.",
    regHeading: "Administrator-Registrierung",
    regSubheading: "Registrieren Sie ein neues Plattform-Controller-Profil im MongoDB-Benutzerverzeichnis.",
    lblUsername: "Benutzername Kontokennung",
    btnRegister: "Konto sicher erstellen",
    regSuccess: "Konto erfolgreich initialisiert! Überprüfung der Anmeldedaten wird gestartet."
  }
};

const LoginPage = () => {
  const { lang, setLang } = useOutletContext();
  const t = translations[lang || 'EN'];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Read tokens dynamically out of your master app/.env configuration file
  const SECRET_INVITE_TOKEN = import.meta.env.VITE_SECRET_INVITE_TOKEN;
  const showRegisterForm = searchParams.get('invite') === SECRET_INVITE_TOKEN;

  // Single source of truth for the login input states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Blinded user registration data states
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', message: '' });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setLoginError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    setRegisterError('');
  };

  const handleEnterpriseLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setLoginError(t.valRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                user { _id username email }
              }
            }
          `,
          variables: { 
            email: loginForm.email.trim(), 
            password: loginForm.password 
          }
        })
      });

      const result = await response.json();
      
      if (result?.errors && result.errors.length > 0) {
        setLoginError(result.errors[0].message);
        setIsSubmitting(false);
        return;
      }

      const token = result?.data?.login?.token;
      if (token) {
        localStorage.setItem('id_token', token);
        navigate('/blog');
      } else {
        setLoginError("Access denied. Cryptographic verification handshake failure.");
      }
    } catch (err) {
      console.error("Network communication portal breakdown:", err);
      setLoginError("Failed to establish contact with authentication background server registry.");
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleEnterpriseRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess(false);

    if (!registerForm.username.trim() || !registerForm.email.trim() || !registerForm.password.trim()) {
      setRegisterError(t.valRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation AddUser($username: String!, $email: String!, $password: String!, $message: String) {
              addUser(username: $username, email: $email, password: $password, message: $message) {
                token
                user { _id username email }
              }
            }
          `,
          variables: {
            username: registerForm.username.trim(),
            email: registerForm.email.trim(),
            password: registerForm.password,
            message: registerForm.message || 'Account generated securely via blinded web invitation gate tokens.'
          }
        })
      });

      const result = await response.json();

      if (result?.errors && result.errors.length > 0) {
        setRegisterError(result.errors[0].message);
        setIsSubmitting(false);
        return;
      }

      if (result?.data?.addUser?.token) {
        setRegisterSuccess(true);
        setRegisterForm({ username: '', email: '', password: '', message: '' });
        
        setTimeout(() => {
          setRegisterSuccess(false);
          navigate(import.meta.env.VITE_SECRET_PORTAL_PATH);
        }, 3000);
      }
    } catch (err) {
      console.error("User registration connection failure:", err);
      setRegisterError("Failed to communicate with master network registry cluster.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-workspace bg-white" style={{ minHeight: '100vh', paddingTop: '140px' }}>
      
      <style>{`
        .login-workspace * { font-family: 'Quicksand', sans-serif !important; }
        .login-panel-card { border: 1px solid #ffc107 !important; border-radius: 20px; background-color: #ffffff; box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
        .form-control:focus { border-color: #ffc107 !important; box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important; }
        .btn-suess-login { background-color: #343a40 !important; border: 1px solid #ffc107 !important; color: white !important; font-weight: 600; font-size: 1.1rem; padding: 12px; border-radius: 30px; transition: all 0.2s ease-in-out; }
        .btn-suess-login:hover { background-color: #dc3545 !important; border-color: #dc3545 !important; transform: translateY(-1px); }
        .login-backdrop-pane { border-radius: 16px; min-height: 520px; background-size: cover; background-position: center; }
        .lang-toggle-badge { position: absolute; top: 25px; right: 25px; display: flex; gap: 10px; z-index: 15; }
        .lang-btn { background: #343a40; color: #fff; border: 1px solid #ffc107; font-size: 0.85rem; font-weight: 600; border-radius: 20px; padding: 5px 15px; cursor: pointer; transition: all 0.2s ease; }
        .lang-btn.active-lang { background: #ffc107; color: #343a40; }
      `}</style>

      <div className="container py-5 px-3 position-relative">
        <div className="lang-toggle-badge">
          <button type="button" onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active-lang' : ''}`}>EN</button>
          <button type="button" onClick={() => setLang('DE')} className={`lang-btn ${lang === 'DE' ? 'active-lang' : ''}`}>DE</button>
        </div>

        <div className="login-panel-card p-4 p-md-5 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="row g-5 align-items-center">
            
            <div className="col-lg-6">
              {showRegisterForm ? (
                <div>
                  <h2 className="text-dark fw-bold mb-2 fs-2">🧬 {t.regHeading}</h2>
                  <p className="text-secondary small mb-4 lh-base">{t.regSubheading}</p>

                  <form onSubmit={handleEnterpriseRegister}>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-semibold small">{t.lblUsername}</label>
                      <input type="text" name="username" className="form-control p-2" placeholder="e.g. MasterAuthor" value={registerForm.username} onChange={handleRegisterChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-semibold small">{t.lblEmail}</label>
                      <input type="email" name="email" className="form-control p-2" placeholder="florian@consulting.com" value={registerForm.email} onChange={handleRegisterChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-semibold small">{t.lblPassword}</label>
                      <input type="password" name="password" className="form-control p-2" placeholder="••••••••••••" value={registerForm.password} onChange={handleRegisterChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark fw-semibold small">Administrative Description Note / Clear Log</label>
                      <input type="text" name="message" className="form-control p-2" placeholder="Master Access Account" value={registerForm.message} onChange={handleRegisterChange} />
                    </div>

                    {registerError && <div className="alert alert-danger p-2 small mb-3">{registerError}</div>}
                    {registerSuccess && <div className="alert alert-success p-2 small mb-3">{t.regSuccess}</div>}

                    <button type="submit" disabled={isSubmitting} className="btn btn-suess-login w-100 mt-2 shadow-sm">
                      {t.btnRegister}
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-dark fw-bold mb-2 fs-2">🔒 {t.heading}</h2>
                  <p className="text-secondary small mb-4 lh-base">{t.subheading}</p>

                  <form onSubmit={handleEnterpriseLogin}>
                    <div className="mb-4">
                      <label className="form-label text-dark fw-semibold small">{t.lblEmail}</label>
                      <input 
                        type="email" 
                        name="email" 
                        className="form-control p-3 rounded-3" 
                        placeholder="florian@consulting.com" 
                        value={loginForm.email} 
                        onChange={handleInputChange} 
                        disabled={isSubmitting} 
                        required 
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-dark fw-semibold small">{t.lblPassword}</label>
                      <input 
                        type="password" 
                        name="password" 
                        className="form-control p-3 rounded-3" 
                        placeholder="••••••••••••" 
                        value={loginForm.password} 
                        onChange={handleInputChange} 
                        disabled={isSubmitting} 
                        required 
                      />
                    </div>

                    {loginError && <div className="alert alert-danger p-2 small mb-4">{loginError}</div>}

                    <button type="submit" disabled={isSubmitting} className="btn btn-suess-login w-100 mt-2 shadow-sm">
                      {isSubmitting ? t.btnProcessing : t.btnLogin}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div 
                className="login-backdrop-pane w-100 shadow-inner border border-light"
                style={{ backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.2), rgba(33, 37, 41, 0.4)), url(${automationBg})` }}
              ></div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;



