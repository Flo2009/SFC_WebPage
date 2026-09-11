const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt to hash manually in a clean single-pass!

// Read your true server configuration keys out of your root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suess_consulting';

const seedDatabaseComplete = async () => {
  try {
    console.log('🔄 INITIALIZING MASTER TOTAL PURGE RESET WORKER...');
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Connected straight to server cluster database files.');

    // 1. OBLITERATE THE CORES SYSTEM DATABASE DATA ON DISK
    console.log('🗑️ Dropping the entire database structure clean from filesystem disk memory...');
    await mongoose.connection.db.dropDatabase();
    console.log('✨ Database completely wiped out. Starting from absolute zero.');

    console.log('👤 Compiling secure enterprise administrative credentials...');
    
    const targetEmail = 'management_4@suessconsulting.com';
    const targetPassword = 'SuessSecure2028!';
    
    // 2. EXPLICIT CONTROL: Manual single-pass encryption hash generation
    // Match this number (e.g. 5 or 10) to whatever encryption salt rounds your backend uses!
    const manualSingleHash = await bcrypt.hash(targetPassword, 5);

    const adminUserId = new mongoose.Types.ObjectId();

    // 3. BYPASS HOOKS ENTIRELY: Write directly to the underlying raw MongoDB collection driver!
    await mongoose.connection.db.collection('users').insertOne({
      _id: adminUserId,
      username: 'Florian',
      email: targetEmail,
      password: manualSingleHash, // Embedded directly as a clean, single-hashed string parameter
      message: 'Master Platform System Administrator Profile Initialized Natively via Master Seed.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('👤 Raw User profile document written cleanly.');

    console.log('📝 Seeding initial multilingual consulting articles...');
    
    await mongoose.connection.db.collection('blogs').insertOne({
      title: 'Optimizing Injection Molding Cycles Using DoE Strategy',
      summary: 'Practical parameter synchronization for industrial component manufacturing.',
      content: 'By implementing strict Design of Experiments parameters, manufacturing plants can accurately map internal cooling thresholds and systematically reduce cycle times by up to 14% without sacrificing dimensional tolerances.',
      category: 'Engineering',
      imageUrl: 'https://picsum.photos',
      author: adminUserId, // Link object reference
      createdAt: new Date().toISOString().split('T')[0]
    });

    // 4. DATABASE INTEGRITY READ AUDIT
    console.log('\n==================================================');
    console.log('🔍 RUNNING LIVE DATABASE INTEGRITY READ AUDIT...');
    const verificationCheck = await mongoose.connection.db.collection('users').findOne({ email: targetEmail });
    
    if (verificationCheck) {
      console.log('✅ Document successfully located inside collection!');
      console.log(`✅ Active Email in DB:   ${verificationCheck.email}`);
      console.log(`✅ Single-Hash Storage:  ${verificationCheck.password.substring(0, 20)}...`);
      console.log(`✅ Expected Input Pass:  ${targetPassword}`);
    }
    console.log('==================================================\n');

  } catch (err) {
    console.error('❌ Reset aborted due to critical error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Database worker disconnected cleanly.');
    process.exit(0);
  }
};

seedDatabaseComplete();








