const { Schema, model } = require('mongoose');

const submissionSchema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: [/.+@.+\..+/, 'Must use a valid email address'] 
  },
  phone: { type: String },
  type: { 
    type: String, 
    required: true, 
    enum: ['CLIENT', 'CANDIDATE'] // Separates consulting leads from job seekers
  },
  message: { type: String, required: true }, // For project comments or cover letters
  resumeUrl: { type: String }, // Stores the secure cloud download URL for the resume file
}, { timestamps: true });

const Submission = model('Submission', submissionSchema);
module.exports = Submission;