const mongoose = require('mongoose');

// Fallback cleanly to your precise corporate consulting database namespace parameter
const targetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suess_consulting';

mongoose.connect(targetUri);

module.exports = mongoose.connection;
