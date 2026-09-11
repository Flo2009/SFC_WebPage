const { Schema, model } = require('mongoose');

const jobMandateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      default: 'Suess Consulting'
    },
    pillar: {
      type: String,
      enum: ['Engineering', 'Management'],
      required: true
    },
    location: {
      type: String,
      default: 'Remote / Hybrid'
    },
    description: {
      type: String,
      required: true
    },
    // 🚀 NEW PARAMETER: Stores the 100% pure Base64 document text string for visual previews
    jdPdfData: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const JobMandate = model('JobMandate', jobMandateSchema);
module.exports = JobMandate;

