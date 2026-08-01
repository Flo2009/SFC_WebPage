const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  summary: { 
    type: String // A short subtitle/preview snippet for your blog list page
  },
  imageUrl: { 
    type: String 
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Blog = model('Blog', blogSchema);
module.exports = Blog;
