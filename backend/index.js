const express = require('express');
const cors = require('cors');
const { db, admin, auth } = require('./firebaseAdmin');

const app = express();

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// API Route: Create User Document
app.post('/api/createUserDocument', async (req, res) => {
    const { email, password, userData, uid } = req.body;

    try {
        if (!uid) {
            throw new Error('UID is required');
        }

        // Access Firestore counters
        const counterRef = db.collection('counters').doc('users');
        const counterSnap = await counterRef.get();

        let newUserId = 1;
        if (counterSnap.exists) {
            newUserId = counterSnap.data().latestUserId + 1;
        } else {
            await counterRef.set({ latestUserId: 1 });
        }

        // Create user document in Firestore
        await db.collection('users').doc(uid).set({
            ...userData,
            email,
            uid,
            userId: newUserId,
            role: userData.role || 'user',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update counters
        await counterRef.update({ latestUserId: newUserId });

        res.status(201).send({ message: 'User document created successfully', uid });
    } catch (error) {
        console.error('Error creating user document:', error);
        res.status(500).send({ error: error.message || 'Failed to create user document' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));