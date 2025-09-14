const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-saas');
    console.log('Connected to MongoDB');

    // Get the database instance
    const db = mongoose.connection.db;
    
    // Check if database exists, create if not
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(database => database.name === 'notes-saas');
    
    if (!dbExists) {
      console.log('Creating database: notes-saas');
      // Just using the connection will create the database
      await db.collection('users').find().limit(1).toArray();
    }

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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Globex',
        slug: 'globex',
        subscription: 'free',
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

    // Verify the data was created
    const userCount = await db.collection('users').countDocuments();
    const tenantCount = await db.collection('tenants').countDocuments();
    
    console.log(`Users in database: ${userCount}`);
    console.log(`Tenants in database: ${tenantCount}`);

    // Test password verification
    const testUser = await db.collection('users').findOne({ email: 'admin@acme.test' });
    if (testUser) {
      const isPasswordCorrect = await bcrypt.compare('password', testUser.password);
      console.log('Password verification test:', isPasswordCorrect ? 'SUCCESS' : 'FAILED');
      console.log('User email:', testUser.email);
    } else {
      console.log('Test user not found');
    }

    // List all users
    const allUsers = await db.collection('users').find({}).toArray();
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

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

fixSeed();