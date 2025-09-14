const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('tenants').deleteMany({});
    await db.collection('notes').deleteMany({});
    console.log('Cleared existing data');

    // Create tenants
    const tenants = await db.collection('tenants').insertMany([
      {
        name: 'Acme',
        slug: 'acme',
        subscription: 'free',
        subscriptionUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Globex',
        slug: 'globex',
        subscription: 'free',
        subscriptionUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Created tenants');

    // Get tenant IDs
    const acmeTenant = await db.collection('tenants').findOne({ slug: 'acme' });
    const globexTenant = await db.collection('tenants').findOne({ slug: 'globex' });

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 12);
    console.log('Password hashed successfully');

    // Create users
    const users = await db.collection('users').insertMany([
      {
        email: 'admin@acme.test',
        password: hashedPassword,
        role: 'admin',
        tenantId: acmeTenant._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@acme.test',
        password: hashedPassword,
        role: 'member',
        tenantId: acmeTenant._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'admin@globex.test',
        password: hashedPassword,
        role: 'admin',
        tenantId: globexTenant._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@globex.test',
        password: hashedPassword,
        role: 'member',
        tenantId: globexTenant._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Created 4 users');

    // Create notes
    await db.collection('notes').insertMany([
      {
        title: 'Welcome to Acme',
        content: 'This is your first note at Acme Corporation.',
        tenantId: acmeTenant._id,
        createdBy: users.insertedIds[0],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Important Meeting',
        content: 'Meeting with clients on Friday at 2 PM.',
        tenantId: acmeTenant._id,
        createdBy: users.insertedIds[1],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Created sample notes');

    // Verify the data
    const userCount = await db.collection('users').countDocuments();
    const tenantCount = await db.collection('tenants').countDocuments();
    const noteCount = await db.collection('notes').countDocuments();
    
    console.log(`Users in database: ${userCount}`);
    console.log(`Tenants in database: ${tenantCount}`);
    console.log(`Notes in database: ${noteCount}`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: admin@acme.test');
    console.log('Password: password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();