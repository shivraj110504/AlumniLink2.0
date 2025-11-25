import 'dotenv/config';
import mongoose from 'mongoose';
import User from './server/models/User.js';

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log('Users in DB:', users);

        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.log(`Found ${users.length} users.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking DB:', error);
        process.exit(1);
    }
};

checkDb();
