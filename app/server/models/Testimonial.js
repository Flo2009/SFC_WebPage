const { Schema, model } = require('mongoose');

const testimonialSchema = new Schema({
  clientName: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, trim: true }, // e.g., Operations Director
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  imageUrl: { type: String }, // For corporate branding graphics or profiles
}, { timestamps: true });

const Testimonial = model('Testimonial', testimonialSchema);
module.exports = Testimonial;
