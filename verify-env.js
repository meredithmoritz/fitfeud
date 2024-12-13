console.log('Verifying Firebase Test Environment Variables:');
console.log('----------------------------------------');
console.log('PROJECT_ID:', process.env.FIREBASE_TEST_PROJECT_ID);
console.log('API_KEY exists:', !!process.env.FIREBASE_TEST_API_KEY);
console.log('MESSAGING_SENDER_ID:', process.env.FIREBASE_TEST_MESSAGING_SENDER_ID);
console.log('APP_ID:', process.env.FIREBASE_TEST_APP_ID);
console.log('USE_EMULATOR:', process.env.USE_FIREBASE_EMULATOR);
console.log('----------------------------------------');

// Validate the variables
const requiredVars = [
    'FIREBASE_TEST_PROJECT_ID',
    'FIREBASE_TEST_API_KEY',
    'FIREBASE_TEST_MESSAGING_SENDER_ID',
    'FIREBASE_TEST_APP_ID'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
} else {
    console.log('✅ All required environment variables are present');
}