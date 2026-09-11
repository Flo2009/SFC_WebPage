const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const express = require('express'); 
const { ApolloServer } = require('apollo-server-express'); 
//const { expressMiddleware } = require('@apollo/server/express'); 
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const cors = require('cors'); 
const rateLimit = require('express-rate-limit'); 

const { typeDefs, resolvers } = require('./schemas'); 
const db = require('./config/connection'); 
const { authMiddleware } = require("./utils/auth"); 

const enterpriseLoginLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { errors: [{ message: 'Too many login failures detected from this network location. Access locked for 15 minutes.' }] }, 
  standardHeaders: true, 
  legacyHeaders: false, 
}); 

// Biometric Passkey Server Dependencies 
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server'); 
const { User } = require('./models'); 
const { signToken } = require('./utils/auth'); 

const PORT = process.env.PORT || 3001; 
const app = express(); 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  plugins: [
      ApolloServerPluginLandingPageLocalDefault({ 
        embed: true, // Forces the visual sandbox to compile locally inside your own browser window space!
        headers: {
          'Access-Control-Allow-Origin': 'https://apollographql.com',
          'Access-Control-Allow-Credentials': 'true'
        }
      }),
    ],
});

// Configure Passkey Environment Parameters 
const rpID = 'localhost'; 
const origin = `http://${rpID}:5173`; 

const startApolloServer = async () => { 
  await server.start(); 

  app.use(express.urlencoded({ extended: true })); 
  app.use(express.json()); 

  app.use(cors({ 
    origin: [ 
      'http://localhost:3000', 
      'http://localhost:5173', 
      'https://apollographql.com', // 🌟 ADD THIS LINE: Unlocks the interactive Sandbox!
      `http://localhost:${process.env.PORT || 3001}` 
    ], 
    credentials: true 
  })); 

  // 🚀 HIGH-CAPACITY FORWARDING VALVE: Scaled cleanly to 50MB to parse massive multi-page PDF documents effortlessly!
  app.use(express.urlencoded({ limit: '50mb', extended: true })); 
  app.use(express.json({ limit: '50mb' })); 

  app.use('/graphql', (req, res, next) => { 
    if (req.body && req.body.query && req.body.query.includes('login')) { 
      return enterpriseLoginLimiter(req, res, next); 
    } 
    next(); 
  }); 

    // 🚀 BYPASS FRAME BLOCKS: Add this right above your db.once('open') block near the footer
  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://apollographql.com;");
    next();
  });


  // ========================================================================= 
  // BIOMETRIC PASSKEY REST ENDPOINTS 
  // ========================================================================= 
  app.get('/api/passkey/generate-options', async (req, res) => { 
    try { 
      const { email } = req.query; 
      const user = await User.findOne({ email }); 
      if (!user) return res.status(404).json({ error: 'Admin user not found.' }); 

      const options = await generateAuthenticationOptions({ 
        rpID, 
        allowCredentials: user.passkeys.map(p => ({ 
          id: p.credentialID, 
          type: 'public-key', 
          transports: p.transports, 
        })), 
        userVerification: 'preferred', 
      }); 

      user.currentChallenge = options.challenge; 
      await user.save(); 
      res.json(options); 
    } catch (error) { 
      console.error(error); 
      res.status(500).json({ error: error.message }); 
    } 
  }); 

  app.post('/api/passkey/verify', async (req, res) => { 
    try { 
      const { email, body } = req.body; 
      const user = await User.findOne({ email }); 
      if (!user || !user.currentChallenge) { 
        return res.status(400).json({ error: 'Verification failed. Active challenge missing.' }); 
      } 

      const passkey = user.passkeys.find(p => p.credentialID === body.id); 
      if (!passkey) { 
        return res.status(404).json({ error: 'Passkey credential parameters not registered.' }); 
      } 

      const verification = await verifyAuthenticationResponse({ 
        response: body, 
        expectedChallenge: user.currentChallenge, 
        expectedOrigin: origin, 
        expectedRPID: rpID, 
        credential: { 
          id: passkey.credentialID, 
          publicKey: Buffer.from(passkey.credentialPublicKey, 'base64'), 
          counter: passkey.counter, 
        }, 
      }); 

      if (verification.verified) { 
        passkey.counter = verification.authenticationInfo.newCounter; 
        user.currentChallenge = null; 
        await user.save(); 

        const token = signToken(user); 
        return res.json({ verified: true, token, user: { username: user.username, email: user.email } }); 
      } 
      res.status(400).json({ verified: false, error: 'Biometric fingerprint signature invalid.' }); 
    } catch (error) { 
      console.error(error); 
      res.status(500).json({ error: error.message }); 
    } 
  });
  // ========================================================================= 
  // MAIN GRAPHQL ROUTING ENTRYPOINT 
  // ========================================================================= 
  //app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));
  // 🚀 PASTE THIS CORRECT MIDDLEWARE HOOK INSTEAD:
  server.applyMiddleware({ app, path: '/graphql' });
 

  // Serve production client/dist static bundles if in production mode
  if (process.env.NODE_ENV === 'production') { 
    app.use(express.static(path.join(__dirname, '../client/dist'))); 
    app.get('*', (req, res) => { 
      res.sendFile(path.join(__dirname, '../client/dist/index.html')); 
    }); 
  } 

  // Open Database Port Listener 
  db.once('open', () => { 
    app.listen(PORT, () => { 
      console.log(`🚀 API server running safely on port ${PORT}!`); 
      console.log(`📊 Open GraphQL Sandbox at http://localhost:${PORT}/graphql`); 
    }); 
  }); 
}; 

startApolloServer();


