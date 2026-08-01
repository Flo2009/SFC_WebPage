import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUBMIT_INQUIRY } from '../../utils/mutations'; 
import { validateEmail } from '../../utils/helpers';     

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', type: '', message: '', resumeUrl: '', location: '', preferredContact: 'EMAIL'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitInquiry, { error: mutationError }] = useMutation(SUBMIT_INQUIRY);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'email') setEmailError(''); 
  };

  const handleNextStep = () => {
    // Validate email before moving past step 2
    if (step === 2) {
      if (!validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleFinish = async () => {
    try {
      await submitInquiry({ variables: { ...formData } });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1050 }}>
      {/* 1. Floating Action Bubble Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: '60px', height: '60px', fontSize: '24px' }}
        >
          💬
        </button>
      )}

      {/* 2. Conversational Chat Window Container */}
      {isOpen && (
        <div className="card shadow-lg border-light" style={{ width: '360px', height: '480px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header Bar */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
            <h6 className="mb-0 fw-bold">Consulting Assistant</h6>
            <button onClick={() => setIsOpen(false)} className="btn-close btn-close-white" style={{ fontSize: '14px' }}></button>
          </div>

          {/* Conversation Feed Body */}
          <div className="card-body overflow-auto bg-light" style={{ flex: '1' }}>
            {isSubmitted ? (
              <div className="text-center py-5">
                <span style={{ fontSize: '40px' }}>🎉</span>
                <h4 className="mt-3 fw-bold">Thank you!</h4>
                <p className="text-muted small">Your inquiry has been successfully saved. We will contact you shortly!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                
                {/* Step 1: Greeting & Name Input */}
                <div>
                  <div className="bg-white p-3 rounded shadow-sm border text-secondary small animate__animated animate__fadeIn" style={{ maxWidth: '85%' }}>
                    Hello! Welcome to our firm. What is your full name?
                  </div>
                  {step >= 1 && (
                    <input type="text" name="name" className="form-control form-control-sm mt-2" placeholder="Your name..." value={formData.name} onChange={handleInputChange} />
                  )}
                  {step === 1 && formData.name.trim() && (
                    <button onClick={handleNextStep} className="btn btn-primary btn-sm mt-2 px-3">Next</button>
                  )}
                </div>

                {/* Step 2: Contact & Location details */}
                {step >= 2 && (
                  <div>
                    <div className="bg-white p-3 rounded shadow-sm border text-secondary small animate__animated animate__fadeIn" style={{ maxWidth: '85%' }}>
                      Hi {formData.name}! What is your email address and where are you located?
                    </div>
                    <input type="email" name="email" className={`form-control form-control-sm mt-2 ${emailError ? 'is-invalid' : ''}`} placeholder="Your email..." value={formData.email} onChange={handleInputChange} />
                    {emailError && <div className="invalid-feedback small">{emailError}</div>}
                    
                    <input type="text" name="location" className="form-control form-control-sm mt-2" placeholder="Location (e.g. Berlin, London)..." value={formData.location} onChange={handleInputChange} />
                    
                    {step === 2 && formData.email && formData.location.trim() && (
                      <button onClick={handleNextStep} className="btn btn-primary btn-sm mt-2 px-3">Next</button>
                    )}
                  </div>
                )}

                {/* Step 3: Qualification Type Selection */}
                {step >= 3 && (
                  <div>
                    <div className="bg-white p-3 rounded shadow-sm border text-secondary small animate__animated animate__fadeIn" style={{ maxWidth: '85%' }}>
                      Are you looking for business consulting (CLIENT) or are you a job seeker (CANDIDATE)?
                    </div>
                    <select name="type" className="form-select form-select-sm mt-2" value={formData.type} onChange={handleInputChange}>
                      <option value="">-- Please select --</option>
                      <option value="CLIENT">Business / Consulting Inquiry</option>
                      <option value="CANDIDATE">Candidate / Recruiting Pool</option>
                    </select>
                    {step === 3 && formData.type && (
                      <button onClick={handleNextStep} className="btn btn-primary btn-sm mt-2 px-3">Next</button>
                    )}
                  </div>
                )}

                {/* Step 4: Text Message Payload & Execution */}
                {step >= 4 && (
                  <div>
                    <div className="bg-white p-3 rounded shadow-sm border text-secondary small animate__animated animate__fadeIn" style={{ maxWidth: '85%' }}>
                      {formData.type === 'CANDIDATE' ? 'Please provide a quick intro message and paste your resume link below.' : 'Please briefly describe your project or needs.'}
                    </div>
                    <textarea name="message" className="form-control form-control-sm mt-2" rows="2" placeholder="Your message..." value={formData.message} onChange={handleInputChange} />
                    
                    {formData.type === 'CANDIDATE' && (
                      <input type="text" name="resumeUrl" className="form-control form-control-sm mt-2" placeholder="Resume URL (e.g. Google Drive link)..." value={formData.resumeUrl} onChange={handleInputChange} />
                    )}

                    <div className="mt-2">
                      <label className="text-muted small fw-bold mb-1">Preferred contact method:</label>
                      <select name="preferredContact" className="form-select form-select-sm" value={formData.preferredContact} onChange={handleInputChange}>
                        <option value="EMAIL">Email</option>
                        <option value="PHONE">Phone Call</option>
                        <option value="WHATSAPP">WhatsApp</option>
                      </select>
                    </div>

                    <button onClick={handleFinish} className="btn btn-success btn-sm w-100 mt-3 fw-bold py-2 shadow-sm">Submit Inquiry</button>
                  </div>
                )}

                {mutationError && (
                  <div className="alert alert-danger p-2 small mt-2">
                    Submission failed. Please check your data and try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
