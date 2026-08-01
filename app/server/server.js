require('dotenv').config(); // Loaded globally as the absolute first step!

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require("./utils/auth");

// Biometric Passkey Server Dependencies
const { 
  generateAuthenticationOptions, 
  verifyAuthenticationResponse 
} = require('@simplewebauthn/server');
const { User } = require('./models');
const { signToken } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Configure Passkey Environment Parameters
const rpID = 'localhost'; // Becomes your real domain name when deploying to a live server
const origin = `http://${rpID}:5173`; // Matches your local Vite React dev server port

const startApolloServer = async () => {
  await server.start();

  // Middleware setups
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors({ origin })); // Allows React to securely access Passkey endpoints cross-origin

  // =========================================================================
  // BIOMETRIC PASSKEY REST ENDPOINTS
  // =========================================================================

  // Endpoint 1: Generate a biometric challenge for the web browser
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

      // Temporarily store challenge string to verify it in the next execution block
      user.currentChallenge = options.challenge;
      await user.save();

      res.json(options);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint 2: Verify the computer/phone signature scan response
  app.post('/api/passkey/verify', async (req, res) => {
    try {
      const { email, body } = req.body; // 'body' is the raw biometric payload from React
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
        // Increment clone prevention counter
        passkey.counter = verification.authenticationInfo.newCounter;
        user.currentChallenge = null; // Flush validation challenge out of memory
        await user.save();

        // Sign an authentication token to open the dashboard view
        const token = signToken(user);
        return res.json({ 
          verified: true, 
          token, 
          user: { username: user.username, email: user.email } 
        });
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
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve production client/dist static bundles
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

