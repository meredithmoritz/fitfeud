import { seedTestData } from '../utils/seed-data.js';

async function main() {
    try {
        await seedTestData();
        console.log('✨ Successfully seeded emulator data');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed data:', error);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Failed to run seed script:', error);
    process.exit(1);
});