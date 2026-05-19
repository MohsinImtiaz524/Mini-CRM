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

        // Create 25 demo leads for the first user to allow comprehensive pagination testing
        const statuses = ['new', 'contacted', 'converted'];
        const demoLeads = [];
        const names = [
            'John Doe', 'Jane Smith', 'Robert Brown', 'Emily Davis', 'Michael Johnson',
            'Sarah Wilson', 'David Jones', 'Jessica Taylor', 'James Miller', 'Karen Anderson',
            'Thomas Jackson', 'Nancy White', 'Daniel Harris', 'Lisa Martin', 'Matthew Thompson',
            'Sandra Garcia', 'Mark Martinez', 'Ashley Robinson', 'Paul Clark', 'Donna Rodriguez',
            'Andrew Lewis', 'Carol Lee', 'Steven Walker', 'Betty Hall', 'Kenneth Allen'
        ];
        
        for (let i = 0; i < names.length; i++) {
            demoLeads.push({
                name: names[i],
                email: `${names[i].toLowerCase().replace(' ', '.')}@example.com`,
                phone: `555-01${10 + i}`,
                status: statuses[i % statuses.length],
                assignedTo: createdUsers[0].username
            });
        }

        await Lead.create(demoLeads);
        console.log(`Demo leads (${demoLeads.length}) created.`);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
