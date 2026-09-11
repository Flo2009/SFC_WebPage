import React, { useState, useEffect } from 'react';

// Cryptographic GraphQL API Network Mappings
const RECRUITER_QUERIES = {
  FETCH_ALL: `
    query AdminViewTalent {
      getAllCandidatesAdmin {
        _id
        name
        email
        phone
        assignedPillar
        extractedSkills
        resumeText
        recruiterRating
        recruiterNotes
        createdAt
      }
    }
  `
};

// 🚀 ADMINISTRATIVE DATABANK MUTATIONS MATRIX MAP
const RECRUITER_MUTATIONS = {
  SUBMIT_EVALUATION: `
    mutation UpdateTalentScore($id: ID!, $rating: Int!, $notes: String!, $assignedPillar: String) {
      updateCandidateEvaluation(id: $id, rating: $rating, notes: $notes, assignedPillar: $assignedPillar) {
        _id
        assignedPillar
        recruiterRating
        recruiterNotes
      }
    }
  `,
  PURGE_RECORD: `
    mutation ScrubTalentTrack($id: ID!) {
      purgeCandidateFromRepo(id: $id)
    }
  `,
  MANUAL_INTAKE: `
    mutation DashboardManualIntake($fileName: String!, $fileData: String!, $email: String!, $forcedPillar: String!) {
      processSecureResumeIntake(fileName: $fileName, fileData: $fileData, email: $email, forcedPillar: $forcedPillar) {
        _id
        name
        assignedPillar
      }
    }
  `,
  // Add inside your existing RECRUITER_MUTATIONS matrix:
    CREATE_JOB: `
    mutation CreateJob($title: String!, $pillar: String!, $description: String!, $location: String, $jdPdfData: String) {
      createJobMandate(title: $title, pillar: $pillar, description: $description, location: $location, jdPdfData: $jdPdfData) {
        _id
        title
        pillar
        description
        jdPdfData
      }
    }
  `,

  REMOVE_JOB: `
    mutation RemoveJob($id: ID!) {
      removeJobMandate(id: $id)
    }
  `
};


const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // Mapped tabs options: 'All' | 'Engineering' | 'Management'
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Evaluation Editing States Container
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editRating, setEditRating] = useState(3);
  const [editNotes, setEditNotes] = useState('');
  
  // Dashboard Manual Upload States
  const [editPillar, setEditPillar] = useState('Engineering');
  const [manualPillar, setManualPillar] = useState('Engineering');
  const [manualEmail, setManualEmail] = useState('');
  const [uploading, setUploading] = useState(false);

  const [jobsList, setJobsList] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobPillar, setNewJobPillar] = useState('Engineering');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [showJobManager, setShowJobManager] = useState(false); // Toggles the modal drawer view
  const [newJobPdf, setNewJobPdf] = useState(''); // Stores the clean Base64 JD PDF string
  const [selectedJob, setSelectedJob] = useState(null); // Track which job is clicked for viewing


  // Synchronize component views with backend datastores upon mounting
  useEffect(() => {
    syncTalentPool();
    syncActiveJobs();
  }, []);

    // 🚀 THE ULTIMATE PERSISTENCE BINDING HOOK:
  // Dynamically populates inputs from your MongoDB data values whenever a card is clicked!
  useEffect(() => {
    if (selectedCandidate) {
      setEditRating(selectedCandidate.recruiterRating !== undefined ? selectedCandidate.recruiterRating : 3);
      setEditNotes(selectedCandidate.recruiterNotes || '');
      setEditPillar(selectedCandidate.assignedPillar || 'Engineering'); // 🚀 Synced category on select context parameter!
    }
  }, [selectedCandidate]);

  const syncActiveJobs = async () => {
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ getAllJobsPublic { _id title pillar description location jdPdfData } }` })
      });
      const result = await response.json();
      if (result?.data?.getAllJobsPublic) setJobsList(result.data.getAllJobsPublic);
    } catch (err) { console.error(err); }
  };

  const syncTalentPool = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('id_token'); // Enforces local JWT authentication guards
      
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ query: RECRUITER_QUERIES.FETCH_ALL })
      });

      const result = await response.json();
      if (result?.data?.getAllCandidatesAdmin) {
        setCandidates(result.data.getAllCandidatesAdmin);
      }
    } catch (err) {
      console.error("Failed to stream secure recruiter data tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) return;
    try {
      const token = localStorage.getItem('id_token');
      await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          query: RECRUITER_MUTATIONS.CREATE_JOB,
          variables: { 
            title: newJobTitle, 
            pillar: newJobPillar, 
            description: newJobDesc,
            jdPdfData: newJobPdf // 🚀 Passes your pure Base64 document payload string!
          }
        })
      });
      setNewJobTitle('');
      setNewJobDesc('');
      setNewJobPdf(''); // Clean picker state after upload
      syncActiveJobs();
      alert("New vacancy and visual JD uploaded directly to public pipelines!");
    } catch (err) { console.error(err); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      const token = localStorage.getItem('id_token');
      await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: RECRUITER_MUTATIONS.REMOVE_JOB, variables: { id } })
      });
      syncActiveJobs();
    } catch (err) { console.error(err); }
  };

    // 🚀 FIXED HIGH-SPEED ATS PIPELINE MIGRATION RESYNC HANDLER
  const handleSaveEvaluation = async (id) => {
    try {
      
      setUpdatingId(id);
      const token = localStorage.getItem('id_token');
      
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          query: RECRUITER_MUTATIONS.SUBMIT_EVALUATION,
          variables: { 
            id, 
            rating: parseInt(editRating, 10), 
            notes: editNotes, 
            assignedPillar: editPillar 
          }
        })
      });

      const result = await response.json();

      if (result?.data?.updateCandidateEvaluation) {
        // 🎯 THE STABILITY BREAKTHROUGH: 
        // Force the frontend component to completely flush its memory caches and pull 
        // a 100% fresh, live data track directly out of your MongoDB collections!
        await syncTalentPool(); 

        // Clear out the card slide-out focus panel instantly to trigger smooth visual re-sorting
        setSelectedCandidate(null);
        alert("Applicant profile records and pipeline tracks updated successfully in MongoDB!");
      } else {
        console.error("GraphQL validation exceptions:", result.errors);
        alert("Failed to update candidate category profile parameters.");
      }
    } catch (err) {
      console.error("Administrative update sequence crash:", err);
      alert("Network transmission error sending payload data down backend pipelines.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Security Alert: Are you sure you want to permanently purge this candidate record from disk?")) return;
    try {
      const token = localStorage.getItem('id_token');
      await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          query: RECRUITER_MUTATIONS.PURGE_RECORD,
          variables: { id }
        })
      });
      setCandidates(prev => prev.filter(c => c._id !== id));
      if (selectedCandidate?._id === id) setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !manualEmail.trim()) {
      alert("Please specify candidate target email before dropping a file package.");
      return;
    }
    
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const token = localStorage.getItem('id_token');
        const pureBase64 = evt.target.result.split(',')[1];
        
        await fetch('http://localhost:3001/graphql', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            query: RECRUITER_MUTATIONS.MANUAL_INTAKE,
            variables: { fileName: file.name, fileData: pureBase64, email: manualEmail, forcedPillar: manualPillar }
          })
        });
        
        setManualEmail('');
        syncTalentPool(); // Smoothly sync lists down memory arrays
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredCandidates = activeTab === 'All' 
    ? candidates 
    : candidates.filter(c => c.assignedPillar === activeTab);

  return (
    <div className="container-fluid py-5 px-md-5 bg-light" style={{ minHeight: '100vh', marginTop: '80px', fontFamily: "'Quicksand', sans-serif" }}>
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="fw-bold text-dark m-0">💼 Recruiter Intake Ledger</h2>
          <p className="text-muted m-0">Review, flag, and filter sandboxed candidate applications live.</p>
          
          {/* DYNAMIC JOB MANAGER PANELS TOGGLE ACCELERATOR CONTROL */}
          <button 
            onClick={() => { setShowJobManager(!showJobManager); syncActiveJobs(); }} 
            className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold mt-2"
          >
            {showJobManager ? "📋 View Resumes Ledger" : "🛠️ Manage Open Vacancies"}
          </button>
        </div>
        
        {/* MANUAL CATEGORY INTAKE VALVE CONTROL */}
        <div className="col-auto bg-white p-3 border rounded shadow-sm d-flex gap-2 align-items-center">
          <input type="email" className="form-control form-control-sm rounded-pill" placeholder="Candidate Email" value={manualEmail} onChange={e => setManualEmail(e.target.value)} disabled={uploading} style={{ width: '180px' }} />
          <select className="form-select form-select-sm rounded-pill" value={manualPillar} onChange={e => setManualPillar(e.target.value)} disabled={uploading} style={{ width: '130px' }}>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
          </select>
          <label className="btn btn-sm btn-dark rounded-pill px-3 m-0">
            {uploading ? "⏳ Parsing..." : "➕ Upload CV"}
            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleManualUpload} disabled={uploading || !manualEmail.trim()} />
          </label>
        </div>
      </div>

      {/* FILTER TOGGLE ROWS */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        {['All', 'Engineering', 'Management'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`btn rounded-pill px-4 fw-bold btn-sm ${activeTab === tab ? 'btn-dark' : 'btn-outline-secondary'}`}>{tab} ({candidates.filter(c => tab === 'All' || c.assignedPillar === tab).length})</button>
        ))}
      </div>
      {/* 🚀 THE FIXED DYNAMIC INTERFACE ROW CONTAINER */}
      <div className="row g-4">
        
        {showJobManager ? (
          /* ========================================================================= */
          /* 🛠️ SECURE JOB VACANCIES MANAGEMENT CONTROL SHEET                        */
          /* ========================================================================= */
          <div className="col-12">
            <div className="row g-4">
              {/* LEFT HALF: JOB CREATION FORM AND LISTING INDEX */}
              <div className={selectedJob ? "col-lg-7" : "col-12"}>
                <div className="card p-4 border bg-white shadow-sm rounded-3 mb-4">
                  <h3 className="h5 fw-bold mb-3 text-dark">🚀 Post a New Corporate Mandate</h3>
                  <form onSubmit={handlePostJob} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Job Title</label>
                      <input type="text" className="form-control rounded-pill border-secondary-subtle px-3" style={{ height: '42px' }} placeholder="e.g. Senior Cloud Architect" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Career Pipeline Stream</label>
                      <select className="form-select rounded-pill border-secondary-subtle px-3" style={{ height: '42px' }} value={newJobPillar} onChange={e => setNewJobPillar(e.target.value)}>
                        <option value="Engineering">🛠️ Engineering</option>
                        <option value="Management">💼 Management</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Job Requirements Summary Overview</label>
                      <textarea className="form-control rounded-3 border-secondary-subtle p-3" rows="3" placeholder="Describe core tasks, parameters, or target tech specifications..." value={newJobDesc} onChange={e => setNewJobDesc(e.target.value)} required></textarea>
                    </div>
                    
                    {/* 📎 ATTACH OFFICIAL JOB DESCRIPTION PDF CONTROLLER */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted d-block">Attach Official Visual JD Document (PDF)</label>
                      <label className={`btn btn-sm rounded-pill px-4 fw-bold ${newJobPdf ? "btn-success" : "btn-outline-dark"}`}>
                        {newJobPdf ? "✅ JD Document Loaded & Secured!" : "📎 Attach official JD PDF"}
                        <input 
                          type="file" 
                          accept=".pdf" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            const files = e.target.files;
                            // 🚀 SECURITY GUARD: Wenn keine Datei ausgewählt wurde, brich die Ausführung ab
                            if (!files || files.length === 0) return;
                            
                            // Schnappe dir die konkrete erste Datei aus dem Array!
                            const targetJobFile = files[0];

                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const base64Parts = evt.target.result.split(',');
                              
                              // 🚀 EXTRACTION FIX: Nutze exakt Index, um den reinen Base64-String ohne Header zu isolieren!
                              const pureBase64Data = base64Parts[1];
                              setNewJobPdf(pureBase64Data); 
                            };
                            
                            // 🎯 TARGETING FIX: Übergib das konkrete Datei-Objekt anstelle der Liste!
                            reader.readAsDataURL(targetJobFile);
                          }} 
                        />
                      </label>
                    </div>

                    <div className="col-12 mt-3">
                      <button type="submit" className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm">
                        📢 Upload and Publish Job
                      </button>
                    </div>
                  </form>
                </div>

                {/* CURRENT SYSTEM ACTIVE MANDATES SUMMARY GRID LIST */}
                <div className="card p-4 border bg-white shadow-sm rounded-3">
                  <h3 className="h5 fw-bold mb-3 text-dark">📋 Currently Active Vacancies ({jobsList.length})</h3>
                  {jobsList.length === 0 ? (
                    <div className="text-center py-4 text-muted border border-dashed rounded bg-light small">No public roles open. Use the form above to add one!</div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {jobsList.map(j => (
                        <div key={j._id} onClick={() => setSelectedJob(j)} className={`p-3 border rounded bg-light d-flex justify-content-between align-items-center cursor-pointer ${selectedJob?._id === j._id ? 'border-warning shadow-sm' : ''}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div>
                            <strong className="text-dark d-block h6 m-0 fw-bold">{j.title}</strong>
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>{j.jdPdfData ? "📄 Includes Document Attachment" : "📝 Text Description Only"}</small>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteJob(j._id); if (selectedJob?._id === j._id) setSelectedJob(null); }} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">✕ Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT HALF: SECURE VISUAL JOB DESCRIPTION COMPOSITION VIEWER IFRAME */}
              {selectedJob && (
                <div className="col-lg-5">
                  <div className="card p-4 border bg-white shadow-sm rounded-3 position-sticky" style={{ top: '100px' }}>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                      <h3 className="h5 fw-bold text-dark m-0">📄 Visual Mandate Preview</h3>
                      <button className="btn-close" onClick={() => setSelectedJob(null)}></button>
                    </div>
                    <strong className="text-dark d-block mb-1">{selectedJob.title}</strong>
                    <p className="text-secondary small mb-3">{selectedJob.description}</p>
                    
                    {selectedJob.jdPdfData ? (
                      /* 🎯 Re-composes the pure Base64 job description string straight into a visual layout native frame! */
                      <iframe
                        src={`data:application/pdf;base64,${selectedJob.jdPdfData}`}
                        title="Visual JD Document Preview"
                        width="100%"
                        height="450px"
                        style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff' }}
                      />
                    ) : (
                      <div className="text-center py-5 text-muted border border-dashed rounded bg-light small">This job was created with text summaries only. No file asset uploaded.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 📄 STANDARD RESUMES WORKSPACE INTAKE BLOCKS                               */
          /* ========================================================================= */
          <>
            {/* LEFT COLUMN: CANDIDATE GRID SUMMARY OVERVIEW */}
            <div className={selectedCandidate ? "col-lg-7" : "col-12"}>
              <div className="d-flex flex-column gap-3">
                {loading ? (
                  <div className="text-center py-5 text-muted">Streaming active candidate parameters out of MongoDB registry...</div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded bg-white shadow-sm">No applicant metadata packages registered for this track.</div>
                ) : (
                  filteredCandidates.map(c => (
                    <div key={c._id} onClick={() => { setSelectedCandidate(c); setEditRating(c.recruiterRating !== undefined ? c.recruiterRating : 3); setEditNotes(c.recruiterNotes || ''); setEditPillar(c.assignedPillar || 'Engineering'); }} className={`p-4 border bg-white shadow-sm rounded-3 cursor-pointer position-relative ${selectedCandidate?._id === c._id ? 'border-warning' : ''}`} style={{ transition: 'all 0.2s', cursor: 'pointer' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h4 className="fw-bold text-dark m-0 h5">{c.name}</h4>
                          <small className="text-muted d-block">{c.email}</small>
                        </div>
                        <span className={`badge ${c.assignedPillar === 'Engineering' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning-emphasis'} px-3 py-2 rounded-pill small fw-bold`}>{c.assignedPillar}</span>
                      </div>
                      
                      <div className="my-2 text-warning fs-5">
                        {"★".repeat(c.recruiterRating || 3)}{"☆".repeat(5 - (c.recruiterRating || 3))}
                      </div>

                      {c.recruiterNotes && (
                        <p className="text-muted small border-start ps-2 py-1 mb-2 bg-light text-truncate" style={{ fontStyle: 'italic' }}>📌 {c.recruiterNotes}</p>
                      )}
                      
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCandidate(c._id); }} className="btn btn-sm btn-outline-danger rounded-pill px-3 position-absolute" style={{ bottom: '15px', right: '15px' }}>✕ Purge</button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* RIGHT COLUMN: RECRUITER SELECTION ACTION CONTROL CENTER */}
            {selectedCandidate && (
              <div className="col-lg-5">
                <div className="card p-4 border bg-white shadow-sm rounded-3 position-sticky" style={{ top: '100px' }}>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <h3 className="h5 fw-bold text-dark m-0">📝 Talent Scoring Card</h3>
                    <button className="btn-close" onClick={() => setSelectedCandidate(null)}></button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Recruiter Talent Rating Flag ({editRating} Stars)</label>
                    <input type="range" className="form-range" min="1" max="5" value={editRating} onChange={(e) => setEditRating(parseInt(e.target.value))} />
                    <div className="d-flex justify-content-between small text-muted"><span>1 (Low Fit)</span><span>5 (Top Tier)</span></div>
                  </div>

                  {/* MANUAL PILLAR CLASSIFICATION OVERRIDE SELECTOR */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Assigned Career Pipeline Track</label>
                    <select className="form-select rounded-3 border-secondary-subtle" value={editPillar} onChange={(e) => setEditPillar(e.target.value)} style={{ height: '42px', fontSize: '0.95rem' }} >
                      <option value="Engineering">🛠️ Engineering Registry Pipeline</option>
                      <option value="Management">💼 Corporate Management Pipeline</option>
                    </select>
                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>If your local AI incorrectly routes a profile, you can manually re-assign them to a new track here.</small>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Persistent Evaluation Notation Logs</label>
                    <textarea className="form-control rounded-3" rows="4" placeholder="Enter evaluation summaries..." value={editNotes} onChange={(e) => setEditNotes(e.target.value)} ></textarea>
                  </div>

                  <button onClick={() => handleSaveEvaluation(selectedCandidate._id)} className="btn btn-warning w-100 rounded-pill fw-bold mb-4" disabled={updatingId === selectedCandidate._id}>
                    {updatingId === selectedCandidate._id ? "Saving..." : "💾 Update Applicant Score"}
                  </button>

                  {/* VISUAL PDF RESUME VIEWER MODULE */}
                  <div className="bg-light p-3 rounded-3 border mt-3">
                    <strong className="text-dark small d-block mb-2">📄 Visual PDF Resume Viewer:</strong>
                    {selectedCandidate.resumeText && !selectedCandidate.resumeText.startsWith("%PDF") ? (
                      <iframe src={`data:application/pdf;base64,${selectedCandidate.resumeText}`} title="PDF Resume Preview" width="100%" height="500px" style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff' }} />
                    ) : (
                      <div className="bg-white p-3 rounded border text-secondary small style-scroll" style={{ maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-line', fontSize: '0.85rem' }}>{selectedCandidate.resumeText}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;

      

