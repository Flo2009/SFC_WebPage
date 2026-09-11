const mongoose = require('mongoose');
const User = require('./models/User'); // Check this relative path carefully!

// Point this connection string exactly to your local MongoDB port name
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suess_consulting';

const seedAdminUserClean = async () => {
  try {
    console.log('Connecting to MongoDB cluster...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connection successful.');

    // Remove old double-hashed corrupted record maps
    await User.deleteMany({ email: 'admin@suessconsulting.com' });

    console.log('Writing clean account profiles to user collection...');
    
    // Pass raw password plain text matching your server's expected resolver constraints!
    await User.create({
      username: 'Admin',
      email: 'admin@suessconsulting.com',
      password: 'SuessSecure2026!', 
      message: 'Master Platform Administrator Account Initialized cleanly.'
    });

    console.log('\n==================================================');
    console.log('🎉 SUCCESS: Admin account updated cleanly!');
    console.log('📧 Email:    admin@suessconsulting.com');
    console.log('🔑 Password: SuessSecure2026!');
    console.log('==================================================\n');

  } catch (err) {
    console.error('❌ Error during script processing:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Database worker disconnected cleanly.');
    process.exit(0);
  }
};

seedAdminUserClean();
