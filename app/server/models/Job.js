const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  companyName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  requirements: { 
    type: String // Required skills or certifications
  },
  location: { 
    type: String, 
    required: true // e.g., "Berlin, Germany" or "Remote"
  },
  salaryRange: { 
    type: String // e.g., "$90,000 - $110,000"
  },
  imageUrl: { 
    type: String // Stores the company logo or banner image URL string
  }
}, { timestamps: true });

const Job = model('Job', jobSchema);
module.exports = Job;
