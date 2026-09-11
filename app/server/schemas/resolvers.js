const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Submission, Blog, Job, Testimonial, CandidateRepo, JobMandate } = require('../models');
const { signToken } = require('../utils/auth');
const pdfParse = require('pdf-parse');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user) {
        throw new GraphQLError("Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.findById(context.user._id);
    },
    getAllUsers: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.find({});
    },
    getAllSubmissions: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user) {
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Submission.find({}).sort({ createdAt: -1 });
    },
    getSubmissionById: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Access denied. Please Log In!", { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await Submission.findById(id);
    },
    getAllBlogs: async () => {
      return await Blog.find({}).populate('author').sort({ createdAt: -1 });
    },
    getBlogById: async (parent, { id }) => {
      return await Blog.findById(id).populate('author');
    },
    getAllJobs: async () => {
      return await Job.find({}).sort({ createdAt: -1 });
    },
    getJobById: async (parent, { id }) => {
      return await Job.findById(id);
    },
    getAllTestimonials: async () => {
      try {
        return await Testimonial.find({}).sort({ createdAt: -1 });
      } catch (err) {
        console.error("Failed to query testimonials collection:", err);
        throw new Error(err);
      }
    },
        // 🚀 RECRUITER PILLAR SCREENING EXTRACTOR
    getCandidatesByPillar: async (parent, { pillar }, context) => {
      // 🎯 THE STABILITY FIX: Safely check for user metrics across both root and nested .req layers
      const currentUserProfile = context.user || context.req?.user;
      
      if (!currentUserProfile) {
        throw new GraphQLError('Access denied. Recruiter credentials required.');
      }
      return await CandidateRepo.find({ assignedPillar: pillar }).sort({ createdAt: -1 });
    },

    // 🚀 ADMINISTRATIVE AGGREGATION PIPELINE
    getAllCandidatesAdmin: async (parent, args, context) => {
      // 🎯 THE STABILITY FIX: Safely check for user metrics across both root and nested .req layers
      const currentUserProfile = context.user || context.req?.user;
      
      if (!currentUserProfile) {
        throw new GraphQLError('Access denied. Admin credentials required.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return await CandidateRepo.find({}).sort({ createdAt: -1 });
    },

    getAllJobsPublic: async () => {
      return await JobMandate.find({}).sort({ createdAt: -1 });
    }

  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        if (args.email) {
          args.email = args.email.toLowerCase().trim();
        }
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error("Failed to provision administrator profile:", err);
        throw new GraphQLError("Registration aborted due to structural duplication or validation error.");
      }
    },

    updateUser: async (parent, { id, username, email, message }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Authentication required.');
      }
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email.toLowerCase().trim();
      if (message) updateData.message = message;

      return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    },

    login: async (parent, { email, password }) => {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        throw new GraphQLError("Please Enter your Email!", {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const storedHash = user.password;
      const correctPw = await bcrypt.compare(password, storedHash);

      if (!correctPw) {
        throw new GraphQLError("Incorrect Password!", {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const token = signToken(user);
      return { token, user };
    },

    deleteUser: async (parent, { id }, context) => {
      if (!context.user) throw new GraphQLError('Access denied. Session credentials expired.');
      await User.findByIdAndDelete(id);
      return "Administrator profile permanently expunged out of system cores.";
    },

    submitInquiry: async (parent, args) => {
      try {
        if (args.email) args.email = args.email.toLowerCase().trim();
        return await Submission.create(args);
      } catch (err) {
        console.error("Public form pipeline drop error:", err);
        throw new Error("Failed to drop contact submission down data streams.");
      }
    },

    deleteSubmission: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Operational tracking personnel privileges required.');
      }
      const lead = await Submission.findByIdAndDelete(id);
      if (!lead) return "Inquiry object not found or already archived.";
      return "Client inquiry record successfully archived and pruned from disk.";
    },
    createBlog: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Operational dashboard session parameters required.');
      }
      return await Blog.create({
        ...args,
        author: context.user._id
      });
    },

    updateBlog: async (parent, { id, title, content, summary, imageUrl }, context) => {
      if (!context.user) throw new GraphQLError('Access denied. Session tracking keys invalid.');
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (summary) updateData.summary = summary;
      if (imageUrl) updateData.imageUrl = imageUrl;

      return await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    },

    deleteBlog: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Administrator clearance codes missing.');
      }
      const post = await Blog.findByIdAndDelete(id);
      if (!post) return "Consulting article not found or already removed.";
      return "Corporate insight document successfully deleted out of database array caches.";
    },

    createJob: async (parent, args, context) => {
      if (!context.user) throw new GraphQLError('Access denied. Admin portal lock active.');
      return await Job.create(args);
    },

    updateJob: async (parent, { id, title, companyName, description, requirements, location, salaryRange, imageUrl }, context) => {
      if (!context.user) throw new GraphQLError('Access denied.');
      const updateData = {};
      if (title) updateData.title = title;
      if (companyName) updateData.companyName = companyName;
      if (description) updateData.description = description;
      if (requirements) updateData.requirements = requirements;
      if (location) updateData.location = location;
      if (salaryRange) updateData.salaryRange = salaryRange;
      if (imageUrl) updateData.imageUrl = imageUrl;

      return await Job.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    },

    deleteJob: async (parent, { id }, context) => {
      if (!context.user) throw new GraphQLError('Access denied.');
      const career = await Job.findByIdAndDelete(id);
      if (!career) return "Open position record not located or already pruned.";
      return "Career recruitment posting cleanly un-published and erased from database grids.";
    },

    createTestimonial: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Authorized administrator login required.');
      }
      return await Testimonial.create(args);
    },

    deleteTestimonial: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Access denied. Admin session verification parameters missing.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      try {
        const prunedReview = await Testimonial.findByIdAndDelete(id);
        if (!prunedReview) {
          return "Testimonial record not located inside MongoDB or already purged.";
        }
        return "Testimonial successfully removed from database cache layers.";
      } catch (err) {
        console.error("Critical crash during testimonial deletion execution:", err);
        throw new Error("Failed to clear testimonial record from MongoDB collection cluster.");
      }
    },
        // 🚀 6. OPEN-SOURCE AI RECRUITER ASSISTANT INTAKE CONTROLLER (With Live Vacancy Validation Caches!)
    sendAssistantMessage: async (parent, { history }) => {
      try {
        // 🔍 LIVE POSITION AUDIT HOOK: Counts exact mandates currently published inside MongoDB
        const openEngineeringCount = await Job.countDocuments({ category: 'Engineering' });
        const openManagementCount = await Job.countDocuments({ category: 'Management' });
        const aggregateTotalOpenOpenings = openEngineeringCount + openManagementCount;

        // Establish the conditional instructional vector based on live data limits
        let liveDatabaseMandateContextString = "";
        if (aggregateTotalOpenOpenings === 0) {
          liveDatabaseMandateContextString = "CRITICAL METRIC: There are currently NO active job postings published online. You MUST explicitly state that nothing is currently posted, but reassure them that we will screen all uploaded resumes as soon as fresh openings arise.";
        } else {
          liveDatabaseMandateContextString = `CRITICAL METRIC: There are currently active vacancies available. We have exactly [${openEngineeringCount}] Engineering positions open and [${openManagementCount}] Management positions open. Match candidate skills against these tracks.`;
        }

        const systemPersona = {
          role: "system",
          content: `You are the Executive Talent Acquisition AI Officer for Suess Recruiting. Your sole objective is to screen applicants looking to fill vacancies inside our two active recruiting pillars: 1.) Engineering (Mechanical, Automation, Manufacturing Systems) and 2.) Management (Operations Directors, Plant Leads, Projects Executives). 

          ${liveDatabaseMandateContextString}

          Be engaging, highly professional, and perfectly honest about placement metrics. Evaluate the candidate's skills, ask about their experience level in these domains, extract compensation expectations, and determine if they match an active mandate.`
        };

        const fullPayload = [systemPersona, ...history];

        // Hit your free local Ollama server instance on port 11434
        const aiResponse = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "llama3.1",
            messages: fullPayload,
            stream: false,
            options: { temperature: 0.7 }
          })
        });

        const aiResult = await aiResponse.json();
        return aiResult?.message?.content || "I am currently optimizing our internal server data intake arrays. Please drop a direct application via our contact portal panel.";
      } catch (err) {
        console.error("Local open-source AI engine communication link failure:", err);
        return "The local connection to the Suess Recruiting AI matrix is temporarily offline. Ensure Ollama is running 'llama3.1' locally on port 11434.";
      }
    },

    // 🔒 AUTHENTICATED TALENT PURGE WORKFLOW
    purgeCandidateFromRepo: async (parent, { id }, context) => {
      const currentUserProfile = context.user || context.req?.user;
      if (!currentUserProfile) {
        throw new GraphQLError('Access Denied. Cryptographic token missing or invalid.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      const targetRecord = await CandidateRepo.findByIdAndDelete(id);
      if (!targetRecord) return "Candidate profile trace was not located.";
      return "Candidate data records permanently deleted.";
    },

    // 🚀 FIXED SECURE SCORING & PIPELINE LANE MIGRATION RESYNC ENGINE
    updateCandidateEvaluation: async (parent, { id, rating, notes, assignedPillar }, context) => {
      // 🔒 Administrative token checkpoint guards
      const currentUserProfile = context.user || context.req?.user;
      if (!currentUserProfile) {
        throw new GraphQLError('Access Denied. Administrative token invalid.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        const cleanRatingInt = parseInt(rating, 10);
        const cleanNotesString = String(notes).trim();
        
        // Build a dynamic storage update query parameter block matrix
        const updateFields = {
          recruiterRating: cleanRatingInt,
          recruiterNotes: cleanNotesString
        };

        // If the recruiter explicitly passed a category override parameter, append it safely!
        if (assignedPillar && ['Engineering', 'Management'].includes(assignedPillar)) {
          updateFields.assignedPillar = assignedPillar;
        }

        // 🎯 THE FIX: Atomic update execution context filters
        const updatedProfileRecord = await CandidateRepo.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { 
            new: true,         // Explicitly ensures the newest modified document returns
            runValidators: true // Enforces Mongoose blueprint configuration validation constraints
          }
        );

        if (!updatedProfileRecord) {
          throw new Error("Target candidate record was not located inside MongoDB collections.");
        }

        // 🎯 CRITICAL FIX PLACEWELL: This return statement MUST run under all conditions 
        // to pass the fully transformed schema document structure directly back to the frontend!
        return updatedProfileRecord;

      } catch (err) {
        console.error("Administrative ATS persistence pipeline crash logs:", err);
        throw new Error("Failed to save updated candidate metrics to database disk.");
      }
    },

    // 🚀 SECURE BASE64 STORAGE ENGINE: Fixes file encoding mismatch instantly
    processSecureResumeIntake: async (parent, { fileName, fileData, email, forcedPillar }) => {
      try {
        const normalizedNameString = fileName.toLowerCase().trim();
        if (!normalizedNameString.includes('.pdf')) {
          throw new Error("Security Alert: Unsanctioned document profile rejected.");
        }

        let finalAssignedPillar = forcedPillar && ['Engineering', 'Management'].includes(forcedPillar) 
          ? forcedPillar 
          : 'Management'; 

        // 🎯 THE STABILITY CORRECTION: 
        // We write the incoming 'fileData' variable DIRECTLY into your resumeText parameter block!
        // This ensures the 100% pure Base64 document text is preserved in MongoDB completely unaltered.
        const finalizedTalentProfile = await CandidateRepo.create({
          name: fileName.replace('.pdf', '').replace(/_/g, ' '), 
          email: email.toLowerCase().trim(),
          assignedPillar: finalAssignedPillar,
          extractedSkills: [],
          resumeText: fileData.trim(), // 🚀 SAVES PURE BASE64 TEXT INSTEAD OF BINARY GIBBERISH!
          recruiterRating: 3,
          recruiterNotes: ''
        });

        // 🤖 OPTIONAL: Independent background AI categorization valve keeps running smoothly
        fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "llama3.1",
            messages: [
              { role: "system", content: "Is this resume 'Engineering' or 'Management'? Respond with ONLY the word." },
              { role: "user", content: fileName } // Uses the clean file name signature to speed up response cycles
            ],
            stream: false
          })
        })
        .then(res => res.json())
        .then(async aiResult => {
          const classification = aiResult?.message?.content || "";
          let updatedPillar = 'Management';
          if (classification.toLowerCase().includes('engineering')) {
            updatedPillar = 'Engineering';
          }
          await CandidateRepo.findByIdAndUpdate(finalizedTalentProfile._id, { $set: { assignedPillar: updatedPillar } });
        })
        .catch(err => console.log("Ollama background connection skipped, default track preserved."));

        return finalizedTalentProfile;

      } catch (err) {
        console.error("Infrastructure error during document extraction sequence:", err);
        throw new Error("Document intake transaction aborted by server security managers.");
      }
    },
    
    createJobMandate: async (parent, { title, pillar, description, location, jdPdfData }, context) => {
      const currentUserProfile = context.user || context.req?.user;
      if (!currentUserProfile) {
        throw new GraphQLError('Access Denied. Administrative token missing.');
      }
      return await JobMandate.create({ 
        title, 
        pillar, 
        description, 
        location: location || 'Remote / Hybrid',
        jdPdfData: jdPdfData || '' // 🎯 Stores the pure Base64 file payload cleanly
      });
    },

    removeJobMandate: async (parent, { id }, context) => {
      const currentUserProfile = context.user || context.req?.user;
      if (!currentUserProfile) {
        throw new GraphQLError('Access Denied. Administrative token missing.');
      }
      await JobMandate.findByIdAndDelete(id);
      return "Job mandate removed successfully.";
    }
  }
};

module.exports = resolvers;
