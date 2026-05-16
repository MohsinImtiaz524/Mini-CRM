const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');

dotenv.config();

const users = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123'
    },
    {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Lead.deleteMany({});
        console.log('Cleared existing data.');

        // Create Users
        const createdUsers = await User.create(users);
        console.log('Test users created.');

        // Create some demo leads for the first user
        const demoLeads = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                status: 'new',
                assignedTo: createdUsers[0].username
            },
            {
                name: 'Jane Smith',
                email: 'jane@enterprise.com',
                phone: '987-654-3210',
                status: 'contacted',
                assignedTo: createdUsers[0].username
            },
            {
                name: 'Robert Brown',
                email: 'robert@startup.io',
                phone: '555-0199',
                status: 'converted',
                assignedTo: createdUsers[0].username
            }
        ];

        await Lead.create(demoLeads);
        console.log('Demo leads created.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
