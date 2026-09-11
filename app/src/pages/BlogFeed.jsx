import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import automationBg from '../assets/Automation.png';

const translations = {
  EN: {
    heroTitle: "Consulting Insights",
    heroSubtitle: "Practical manufacturing intelligence, operational excellence breakthroughs, and industrial compliance strategy updates.",
    sectionTitle: "Articles",
    heading: "Company Blog",
    lblLogoutBtn: "Sign Out",
    lblCreateHeading: "Publish New Consulting Post",
    lblTitleField: "Article Title",
    lblSummaryField: "Brief Subtitle / Preview Snippet",
    lblCategoryField: "Operational Pillar",
    lblContentField: "Body Content / Technical Overview",
    btnPublish: "Publish Article",
    valRequired: "Please fill out all required fields.",
    optOps: "Operations",
    optMaint: "Maintenance",
    optEng: "Engineering",
    optQual: "Quality",
    lblEmpty: "No published consulting articles found inside the live database repository.",
    lblLoading: "Streaming insights from backend...",
    tabPosts: "Blog Feed",
    tabReviews: "Client Testimonials",
    lblCreateReview: "Record Approved Client Endorsement",
    lblClientName: "Client Name",
    lblClientCompany: "Company Name",
    lblClientRole: "Corporate Title / Role",
    lblClientQuote: "Client Praise Quote / Statement",
    btnSaveReview: "Publish Testimonial",
    tabLeads: "Inbound Inquiries",
    lblLeadEmpty: "No customer contact entries found inside the database repository.",
    lblMessage: "Project Scope Summary"
  },
  DE: {
    heroTitle: "Beratungseinblicke",
    heroSubtitle: "Praktisches Fertigungswissen, Durchbrüche in der Operational Excellence und Updates zur industriellen Compliance-Strategie.",
    sectionTitle: "Artikel",
    heading: "Unternehmens-Blog",
    lblLogoutBtn: "Abmelden",
    lblCreateHeading: "Neuen Beratungsbeitrag veröffentlichen",
    lblTitleField: "Artikeltitel",
    lblSummaryField: "Kurze Zusammenfassung / Vorschau-Snippet",
    lblCategoryField: "Betriebliche Säule",
    lblContentField: "Inhalt / Technischer Überblick",
    btnPublish: "Artikel veröffentlichen",
    valRequired: "Bitte füllen Sie alle Pflichtfelder aus.",
    optOps: "Operations / Produktion",
    optMaint: "Instandhaltung",
    optEng: "Ingenieurwesen",
    optQual: "Qualitätsmanagement",
    lblEmpty: "Keine veröffentlichten Beratungsartikel im Live-Datenbank-Repository gefunden.",
    lblLoading: "Einblicke werden vom Backend geladen...",
    tabPosts: "Blog-Beiträge",
    tabReviews: "Referenzen / Lob",
    lblCreateReview: "Freigegebene Client-Referenz aufzeichnen",
    lblClientName: "Name des Kunden",
    lblClientCompany: "Name des Unternehmens",
    lblClientRole: "Position / Titel",
    lblClientQuote: "Zitat des Kunden / Aussage",
    btnSaveReview: "Referenz veröffentlichen",
    tabLeads: "Eingehende Anfragen",
    lblLeadEmpty: "Keine Kundenkontakteinträge im Datenbank-Repository gefunden.",
    lblMessage: "Zusammenfassung des Projektumfangs"
  }
};

const BlogFeed = () => {
  const { lang, setLang } = useOutletContext();
  const t = translations[lang || 'EN'];
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('id_token'));
  const [activeTab, setActiveTab] = useState('blog');

  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [uiLoading, setUiLoading] = useState(true);

  const [newPost, setNewPost] = useState({ title: '', summary: '', category: 'Operations', content: '', imageUrl: '' });
  const [newReview, setNewReview] = useState({ clientName: '', company: '', role: '', quote: '', rating: 5, imageUrl: '' });
  const [validationError, setValidationError] = useState('');

  const syncPlatformStreams = async () => {
    try {
      setUiLoading(true);
      const token = localStorage.getItem('id_token');

      // Clear layout state arrays before downloading fresh elements
      setPosts([]);
      setTestimonials([]);
      setSubmissions([]);

      const publicResponse = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query FetchPublicFeeds {
              getAllBlogs { _id title content summary imageUrl createdAt }
              getAllTestimonials { _id clientName company role quote rating imageUrl createdAt }
            }
          `
        })
      });

      const publicResult = await publicResponse.json();
      if (publicResult?.data) {
        if (publicResult.data.getAllBlogs) setPosts(publicResult.data.getAllBlogs);
        if (publicResult.data.getAllTestimonials) setTestimonials(publicResult.data.getAllTestimonials);
      }

      if (token && isAdmin) {
        const adminResponse = await fetch('http://localhost:3001/graphql', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query FetchAdminLeads {
                getAllSubmissions { _id name email phone message createdAt }
              }
            `
          })
        });

        const adminResult = await adminResponse.json();
        if (adminResult?.data?.getAllSubmissions) {
          setSubmissions(adminResult.data.getAllSubmissions);
        }
      }

    } catch (err) {
      console.error("Pipeline data sync error:", err);
    } finally {
      setUiLoading(false);
    }
  };

  useEffect(() => {
    syncPlatformStreams();
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('id_token');
    setIsAdmin(false);
    setActiveTab('blog');
    syncPlatformStreams();
  };
  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setValidationError(t.valRequired);
      return;
    }

    try {
      await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('id_token')}` },
        body: JSON.stringify({
          query: `
            mutation CreateBlog($title: String!, $content: String!, $summary: String, $imageUrl: String) {
              createBlog(title: $title, content: $content, summary: $summary, imageUrl: $imageUrl) { _id }
            }
          `,
          variables: {
            title: newPost.title,
            content: newPost.content,
            summary: newPost.summary || '',
            imageUrl: newPost.imageUrl || ''
          }
        })
      });
      setNewPost({ title: '', summary: '', category: 'Operations', content: '', imageUrl: '' });
      setValidationError('');
      syncPlatformStreams();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishTestimonial = async (e) => {
    e.preventDefault();
    if (!newReview.clientName.trim() || !newReview.company.trim() || !newReview.quote.trim()) {
      setValidationError(t.valRequired);
      return;
    }

    try {
      await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('id_token')}` },
        body: JSON.stringify({
          query: `
            mutation CreateTestimonial($clientName: String!, $company: String!, $role: String, $quote: String!, $rating: Int, $imageUrl: String) {
              createTestimonial(clientName: $clientName, company: $company, role: $role, quote: $quote, rating: $rating, imageUrl: $imageUrl) { _id }
            }
          `,
          variables: { ...newReview, rating: parseInt(newReview.rating) }
        })
      });
      setNewReview({ clientName: '', company: '', role: '', quote: '', rating: 5, imageUrl: '' });
      setValidationError('');
      syncPlatformStreams();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePruneRecord = async (targetId, mutationName) => {
    if (!window.confirm("Are you certain you want to permanently clear this record from MongoDB?")) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('id_token')}` 
        },
        body: JSON.stringify({
          query: `
            mutation PruneRecord($id: ID!) {
              ${mutationName}(id: $id)
            }
          `,
          variables: { id: targetId }
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error("❌ Deletion rejected by backend server schema:", result.errors);
        return;
      }
      
      // Dynamic feed data refresh loop execution
      syncPlatformStreams();
    } catch (err) {
      console.error("Critical error firing administrative deletion matrix:", err);
    }
  };

    return (
    <div className="blog-page bg-white" style={{ fontFamily: "'Quicksand', sans-serif !important" }}>
      <style>{`
        .blog-page * { font-family: 'Quicksand', sans-serif !important; }
        .suess-hero-title { font-weight: 500 !important; font-size: 3.8rem; letter-spacing: -0.5px; color: #ffffff !important; }
        .suess-hero-subtitle { font-size: 1.35rem; font-weight: 400 !important; color: rgba(255, 255, 255, 0.9) !important; max-width: 850px; margin: 0 auto; letter-spacing: 0.5px; }
        .section-flag-title { font-size: 1rem; text-transform: uppercase; font-weight: 500 !important; color: #adb5bd; letter-spacing: 1.5px; display: inline-block; margin-bottom: 5px; }
        .section-flag-line { display: inline-block; width: 80px; height: 3px; background-color: #dc3545; margin-left: 15px; vertical-align: middle; }
        .section-main-heading { font-size: 2.6rem; font-weight: 500 !important; text-transform: uppercase; letter-spacing: -0.5px; color: #343a40; }
        
        .blog-article-card { border: 1px solid #e0e0e0; border-left: 5px solid #dc3545 !important; border-radius: 12px; background-color: #ffffff; transition: all 0.25s ease-in-out; }
        .blog-article-card:hover { border-left: 5px solid #ffc107 !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
        .blog-category-badge { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; display: inline-block; }
        
        .sub-tab-pill { background: transparent; border: 1px solid #dee2e6; color: #495057; font-weight: 600; padding: 8px 24px; border-radius: 25px; transition: all 0.2s ease; cursor: pointer; }
        .sub-tab-pill.active-sub-tab { background: #343a40; color: #ffffff; border-color: #343a40; }
        .admin-editor-card { border: 2px dashed #ffc107 !important; border-radius: 16px; background-color: #fff9e6; }
        
        .hero-alignment-wrapper { position: absolute; bottom: -68px; left: 0; width: 100%; z-index: 30; }
        .lang-toggle-badge { display: flex; gap: 10px; float: right; padding-right: 15px; }
        .lang-btn { background: #343a40; color: #fff; border: 1px solid #ffc107; font-size: 0.85rem; font-weight: 600; border-radius: 20px; padding: 5px 15px; cursor: pointer; transition: all 0.2s ease; }
        .lang-btn.active-lang { background: #ffc107; color: #343a40; }
      `}</style>

      {/* Hero Banner Section */}
      <section className="text-white px-3 text-center border-bottom border-dark position-relative" style={{ backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.75), rgba(33, 37, 41, 0.8)), url(${automationBg})`, backgroundSize: 'cover', minHeight: '400px', display: 'flex', alignItems: 'center', paddingTop: '140px' }}>
        <div className="container position-relative w-100" style={{ zIndex: 2 }}>
          <h1 className="suess-hero-title mb-3">{t.heroTitle}</h1>
          <p className="suess-hero-subtitle lh-md mb-3">{t.heroSubtitle}</p>
          
          {/* Language Toggle Badge sitting perfectly on the border split line row */}
          <div className="hero-alignment-wrapper">
            <div className="lang-toggle-badge">
              <button type="button" onClick={() => setLang('EN')} className={`lang-btn ${lang === 'EN' ? 'active-lang' : ''}`}>EN</button>
              <button type="button" onClick={() => setLang('DE')} className={`lang-btn ${lang === 'DE' ? 'active-lang' : ''}`}>DE</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Interface Layer */}
      <section className="py-5 bg-light px-3">
        <div className="container py-4" style={{ maxWidth: '850px', position: 'relative' }}>
          
          <div className="text-start mb-4 ps-2 d-flex justify-content-between align-items-end flex-wrap gap-3">
            <div>
              <div><span className="section-flag-title">{t.sectionTitle}</span><span className="section-flag-line"></span></div>
              <h2 className="section-main-heading mb-0">{activeTab === 'blog' ? t.heading : activeTab === 'testimonials' ? t.tabReviews : t.tabLeads}</h2>
            </div>
            {isAdmin && (
              <div>
                <button type="button" onClick={handleAdminLogout} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold">{t.lblLogoutBtn}</button>
              </div>
            )}
          </div>

          {/* DYNAMIC TAB NAVIGATION CONTROLS */}
          <div className="d-flex gap-2 mb-5 border-bottom pb-3">
            <button onClick={() => { setActiveTab('blog'); setValidationError(''); }} className={`sub-tab-pill ${activeTab === 'blog' ? 'active-sub-tab' : ''}`}>{t.tabPosts}</button>
            {(testimonials.length > 0 || isAdmin) && (
              <button onClick={() => { setActiveTab('testimonials'); setValidationError(''); }} className={`sub-tab-pill ${activeTab === 'testimonials' ? 'active-sub-tab' : ''}`}>{t.tabReviews}</button>
            )}
            {isAdmin && (
              <button onClick={() => { setActiveTab('leads'); setValidationError(''); }} className={`sub-tab-pill ${activeTab === 'leads' ? 'active-sub-tab' : ''}`}>{t.tabLeads}</button>
            )}
          </div>

          {/* ADMIN INPUT FORMS GATE SPLIT */}
          {isAdmin && activeTab === 'blog' && (
            <div className="admin-editor-card p-4 p-md-5 mb-5 shadow-sm">
              <h3 className="text-dark fw-bold mb-4 fs-5 border-bottom pb-2 border-warning">📝 {t.lblCreateHeading}</h3>
              <form onSubmit={handlePublishPost}>
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <input type="text" className="form-control" placeholder={t.lblTitleField} value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})}>
                      <option value="Operations">{t.optOps}</option>
                      <option value="Maintenance">{t.optMaint}</option>
                      <option value="Engineering">{t.optEng}</option>
                      <option value="Quality">{t.optQual}</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control" placeholder="📸 Article Showcase Graphic / Schematic File Link (URL)" value={newPost.imageUrl} onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control" placeholder={t.lblSummaryField} value={newPost.summary || ''} onChange={(e) => setNewPost({...newPost, summary: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control" rows="5" placeholder={t.lblContentField} value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} />
                  </div>
                </div>
                {validationError && <div className="alert alert-danger p-2 small">{validationError}</div>}
                <button type="submit" className="btn btn-dark px-4 rounded-pill">{t.btnPublish}</button>
              </form>
            </div>
          )}

          {isAdmin && activeTab === 'testimonials' && (
            <div className="admin-editor-card p-4 p-md-5 mb-5 shadow-sm">
              <h3 className="text-dark fw-bold mb-4 fs-5 border-bottom pb-2 border-warning">🤝 {t.lblCreateReview}</h3>
              <form onSubmit={handlePublishTestimonial}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6"><input type="text" className="form-control" name="clientName" placeholder={t.lblClientName} value={newReview.clientName} onChange={(e) => setNewReview({...newReview, clientName: e.target.value})} required /></div>
                  <div className="col-md-6"><input type="text" className="form-control" name="company" placeholder={t.lblClientCompany} value={newReview.company} onChange={(e) => setNewReview({...newReview, company: e.target.value})} required /></div>
                  <div className="col-md-12"><input type="text" className="form-control" name="role" placeholder={t.lblClientRole} value={newReview.role} onChange={(e) => setNewReview({...newReview, role: e.target.value})} /></div>
                  <div className="col-md-12"><input type="text" className="form-control" name="imageUrl" placeholder="📸 Corporate Brand Logo URL or Avatar Link (Optional)" value={newReview.imageUrl} onChange={(e) => setNewReview({...newReview, imageUrl: e.target.value})} /></div>
                  <div className="col-md-12"><textarea className="form-control" rows="4" name="quote" placeholder={t.lblClientQuote} value={newReview.quote} onChange={(e) => setNewReview({...newReview, quote: e.target.value})} required /></div>
                </div>
                {validationError && <div className="alert alert-danger p-2 small">{validationError}</div>}
                <button type="submit" className="btn btn-dark px-4 rounded-pill">{t.btnSaveReview}</button>
              </form>
            </div>
          )}
          {/* DISPLAY CONTENT LIST STREAMS */}
          <div className="d-flex flex-column gap-4 w-100">
            {uiLoading ? (
              <div className="text-center py-5 text-muted">{t.lblLoading}</div>
            ) : (
              <>
                {/* 1. BLOG FEED POSTS LOOP */}
                {activeTab === 'blog' && (
                  posts.length === 0 ? (
                    <div className="text-center py-4 border rounded bg-white shadow-sm">{t.lblEmpty}</div>
                  ) : (
                    posts.map((post) => (
                      <article key={post._id} className="blog-article-card p-4 p-md-5 shadow-sm bg-white w-100">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                          <span className="blog-category-badge">Suess Intel Insights</span>
                          <small className="text-muted fw-medium">{post.createdAt ? new Date(parseInt(post.createdAt) ? parseInt(post.createdAt) : post.createdAt).toLocaleDateString() : 'Recent'}</small>
                        </div>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-100 mb-4 rounded-3 shadow-sm border" style={{ maxHeight: '350px', objectFit: 'cover' }} />}
                        <h3 className="text-dark fw-bold mb-2 h4">{post.title}</h3>
                        {post.summary && <h5 className="text-secondary fw-semibold small mb-3 fs-6">{post.summary}</h5>}
                        <p className="text-secondary lh-lg mb-0" style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>{post.content}</p>
                        
                        {/* ADMIN POST REMOVAL REFRESH */}
                        {isAdmin && (
                          <div className="text-end border-top pt-2 mt-4">
                            <button type="button" onClick={() => handlePruneRecord(post._id, 'deleteBlog')} className="btn btn-sm btn-outline-danger rounded-pill px-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>🗑️ Delete Article</button>
                          </div>
                        )}
                      </article>
                    ))
                  )
                )}

                {/* 2. TESTIMONIALS LOOP */}
                {activeTab === 'testimonials' && (
                  testimonials.length === 0 ? (
                    <div className="text-center py-4 border rounded bg-white shadow-sm">No client reviews published yet.</div>
                  ) : (
                    testimonials.map((test) => (
                      <article key={test._id} className="p-4 p-md-5 border rounded-4 bg-white shadow-sm d-flex gap-4 align-items-start w-100" style={{ borderLeft: '5px solid #ffc107 !important' }}>
                        {test.imageUrl && <img src={test.imageUrl} alt={test.company} className="rounded-circle border bg-light flex-shrink-0 d-none d-sm-block" style={{ width: '65px', height: '64px', objectFit: 'cover' }} />}
                        <div className="flex-grow-1">
                          <p className="text-dark fst-italic lh-lg mb-3 fs-5">"{test.quote}"</p>
                          <h5 className="text-dark fw-bold mb-1 fs-6">{test.clientName}</h5>
                          <span className="text-muted small fw-medium">{test.role} — <strong className="text-dark">{test.company}</strong></span>
                        </div>
                        {/* ADMIN TESTIMONIAL REMOVAL REFRESH */}
                        {isAdmin && (
                          <div className="text-end border-top pt-2 mt-2">
                            <button type="button" onClick={() => handlePruneRecord(test._id, 'deleteTestimonial')} className="btn btn-sm btn-outline-danger rounded-pill px-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>🗑️ Remove Testimonial</button>
                          </div>
                        )}
                      </article>
                    ))
                  )
                )}

                {/* 3. INBOUND LEADS SECURED LOOP */}
                {activeTab === 'leads' && isAdmin && (
                  <div className="d-flex flex-column gap-3 w-100">
                    <div className="text-end mb-2">
                      <button type="button" onClick={syncPlatformStreams} className="btn btn-sm btn-dark rounded-pill px-4 shadow-sm border border-warning" style={{ fontSize: '0.85rem', fontWeight: 600 }}>🔄 Refresh Live Feed</button>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="text-center py-5 text-muted border rounded bg-white shadow-sm">{t.lblLeadEmpty}</div>
                    ) : (
                      submissions.map((lead) => (
                        <div key={lead._id} className="p-4 border rounded-3 bg-white shadow-sm border-start border-warning border-4 w-100">
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3 flex-wrap gap-2">
                            <div>
                              <h5 className="text-dark fw-bold mb-0 fs-5">{lead.name}</h5>
                              <span className="text-muted small fw-semibold">Suess Consulting Inbound Lead</span>
                            </div>
                            <small className="text-muted fw-medium">{lead.createdAt ? new Date(parseInt(lead.createdAt) ? parseInt(lead.createdAt) : lead.createdAt).toLocaleDateString() : 'Recent'}</small>
                          </div>
                          <p className="text-secondary mb-3 lh-base fs-6" style={{ whiteSpace: 'pre-line' }}>
                            <strong className="text-dark small d-block mb-1">📋 {t.lblMessage}:</strong>
                            "{lead.message}"
                          </p>
                          <div className="bg-light p-3 rounded text-muted small border d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <span>
                              📧 <strong>Email Address:</strong> <a href={`mailto:${lead.email}`} className="text-danger text-decoration-none fw-semibold">{lead.email}</a>
                              {lead.phone && <span className="ms-3">📞 <strong>Contact Phone:</strong> {lead.phone}</span>}
                            </span>
                            <button type="button" onClick={() => handlePruneRecord(lead._id, 'deleteSubmission')} className="btn btn-sm btn-danger rounded-pill px-4 fw-bold shadow-sm" style={{ fontSize: '0.85rem' }}>✓ Archive / Contacted</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default BlogFeed;









