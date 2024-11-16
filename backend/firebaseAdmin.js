const admin = require('firebase-admin');

const serviceAccount = require('./fitfeud-34151-firebase-adminsdk-qsbfy-1eb5bd7cb7.json');

// Initialize Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };