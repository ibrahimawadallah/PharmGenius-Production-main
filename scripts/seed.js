const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmgenius';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing collections
    await db.collection('users').deleteMany({});
    await db.collection('organizations').deleteMany({});
    await db.collection('consultations').deleteMany({});
    await db.collection('courses').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('posts').deleteMany({});
    
    console.log('Cleared existing collections');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ organizationId: 1 });
    await db.collection('consultations').createIndex({ userId: 1 });
    await db.collection('consultations').createIndex({ providerId: 1 });
    await db.collection('courses').createIndex({ title: 'text', description: 'text' });
    await db.collection('posts').createIndex({ title: 'text', content: 'text' });
    
    console.log('Created indexes');
    
    // Seed Organizations
    const organizations = [
      {
        name: 'PharmGenius Healthcare',
        type: 'healthcare_provider',
        description: 'Leading healthcare technology company',
        address: {
          street: '123 Healthcare Blvd',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
          postalCode: '12345'
        },
        contact: {
          email: 'info@pharmgenius.com',
          phone: '+971-50-123-4567',
          website: 'https://pharmgenius.com'
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        features: ['drug_database', 'consultations', 'learning', 'analytics'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dubai Medical Center',
        type: 'medical_center',
        description: 'Comprehensive medical services',
        address: {
          street: '456 Medical District',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
          postalCode: '67890'
        },
        contact: {
          email: 'contact@dubaimedical.com',
          phone: '+971-50-987-6543',
          website: 'https://dubaimedical.com'
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        features: ['drug_database', 'consultations'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const orgResult = await db.collection('organizations').insertMany(organizations);
    console.log(`Created ${orgResult.insertedCount} organizations`);
    
    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        email: 'admin@pharmgenius.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        organizationId: orgResult.insertedIds[0],
        emailVerified: true,
        profile: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'System Administrator',
          specialization: 'Healthcare Technology',
          experience: '10+ years'
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        features: ['drug_database', 'consultations', 'learning', 'analytics', 'admin_panel'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'doctor@pharmgenius.com',
        password: hashedPassword,
        firstName: 'Dr. Sarah',
        lastName: 'Ahmed',
        role: 'provider',
        organizationId: orgResult.insertedIds[0],
        emailVerified: true,
        profile: {
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          bio: 'Senior Pharmacist',
          specialization: 'Clinical Pharmacy',
          experience: '8 years',
          license: 'UAE-PH-12345',
          certifications: ['BCPS', 'CDE']
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        features: ['drug_database', 'consultations', 'learning'],
        availability: [
          {
            day: 'monday',
            slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          },
          {
            day: 'tuesday',
            slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          },
          {
            day: 'wednesday',
            slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'patient@pharmgenius.com',
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        role: 'basic',
        organizationId: orgResult.insertedIds[0],
        emailVerified: true,
        profile: {
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Patient seeking healthcare guidance',
          specialization: 'General Health',
          experience: 'N/A'
        },
        subscription: {
          plan: 'basic',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        features: ['drug_database', 'basic_consultations'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const userResult = await db.collection('users').insertMany(users);
    console.log(`Created ${userResult.insertedCount} users`);
    
    // Seed Courses
    const courses = [
      {
        title: 'Clinical Pharmacology Fundamentals',
        description: 'Comprehensive course covering essential principles of clinical pharmacology',
        instructor: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        category: 'pharmacology',
        level: 'intermediate',
        duration: '8 weeks',
        modules: [
          {
            title: 'Introduction to Drug Actions',
            content: 'Understanding how drugs interact with the body',
            duration: '2 hours',
            order: 1
          },
          {
            title: 'Pharmacokinetics',
            content: 'Drug absorption, distribution, metabolism, and excretion',
            duration: '3 hours',
            order: 2
          },
          {
            title: 'Drug Interactions',
            content: 'Identifying and managing drug-drug interactions',
            duration: '2 hours',
            order: 3
          }
        ],
        price: 299.99,
        currency: 'USD',
        published: true,
        enrollmentCount: 45,
        completionCount: 12,
        rating: 4.8,
        totalRatings: 23,
        tags: ['pharmacology', 'clinical', 'drugs', 'interactions'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mental Health First Aid',
        description: 'Learn to recognize and respond to mental health crises',
        instructor: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        category: 'mental_health',
        level: 'beginner',
        duration: '6 weeks',
        modules: [
          {
            title: 'Understanding Mental Health',
            content: 'Overview of common mental health conditions',
            duration: '2 hours',
            order: 1
          },
          {
            title: 'Crisis Intervention',
            content: 'How to respond to mental health emergencies',
            duration: '3 hours',
            order: 2
          }
        ],
        price: 199.99,
        currency: 'USD',
        published: true,
        enrollmentCount: 78,
        completionCount: 34,
        rating: 4.9,
        totalRatings: 45,
        tags: ['mental_health', 'first_aid', 'crisis_intervention'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const courseResult = await db.collection('courses').insertMany(courses);
    console.log(`Created ${courseResult.insertedCount} courses`);
    
    // Seed Consultations
    const consultations = [
      {
        userId: userResult.insertedIds[2],
        providerId: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        type: 'general_consultation',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 30,
        notes: 'Patient seeking advice on medication management',
        messages: [
          {
            senderId: userResult.insertedIds[2],
            content: 'Hello, I have some questions about my medications',
            timestamp: new Date(),
            type: 'text'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: userResult.insertedIds[2],
        providerId: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        type: 'medication_review',
        status: 'completed',
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        duration: 45,
        notes: 'Comprehensive medication review completed',
        diagnosis: 'Medication optimization needed',
        prescription: 'Adjusted dosage for better efficacy',
        rating: 5,
        review: 'Excellent consultation, very helpful',
        messages: [
          {
            senderId: userResult.insertedIds[1],
            content: 'Your medication review is complete. I\'ve made some adjustments.',
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
            type: 'text'
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
      }
    ];
    
    const consultationResult = await db.collection('consultations').insertMany(consultations);
    console.log(`Created ${consultationResult.insertedCount} consultations`);
    
    // Seed Posts
    const posts = [
      {
        title: 'The Future of Personalized Medicine',
        slug: 'future-personalized-medicine',
        excerpt: 'How AI and genomics are revolutionizing healthcare treatment',
        content: 'Personalized medicine represents a paradigm shift in healthcare...',
        authorId: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        category: 'healthcare_technology',
        tags: ['personalized_medicine', 'AI', 'genomics', 'healthcare'],
        status: 'published',
        publishedAt: new Date(),
        viewCount: 156,
        likeCount: 23,
        comments: [
          {
            userId: userResult.insertedIds[2],
            content: 'Very informative article!',
            timestamp: new Date(),
            likes: 5
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Understanding Drug Interactions',
        slug: 'understanding-drug-interactions',
        excerpt: 'Essential guide for healthcare professionals and patients',
        content: 'Drug interactions can significantly impact treatment efficacy...',
        authorId: userResult.insertedIds[1],
        organizationId: orgResult.insertedIds[0],
        category: 'pharmacology',
        tags: ['drug_interactions', 'pharmacology', 'safety', 'medication'],
        status: 'published',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        viewCount: 89,
        likeCount: 15,
        comments: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];
    
    const postResult = await db.collection('posts').insertMany(posts);
    console.log(`Created ${postResult.insertedCount} posts`);
    
    // Seed Payments
    const payments = [
      {
        userId: userResult.insertedIds[2],
        organizationId: orgResult.insertedIds[0],
        type: 'subscription',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        description: 'Monthly subscription - Basic Plan',
        paymentMethod: 'credit_card',
        transactionId: 'txn_123456789',
        metadata: {
          plan: 'basic',
          duration: '1 month'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: userResult.insertedIds[2],
        organizationId: orgResult.insertedIds[0],
        type: 'course_purchase',
        amount: 199.99,
        currency: 'USD',
        status: 'completed',
        description: 'Mental Health First Aid Course',
        paymentMethod: 'credit_card',
        transactionId: 'txn_987654321',
        metadata: {
          courseId: courseResult.insertedIds[1],
          courseTitle: 'Mental Health First Aid'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];
    
    const paymentResult = await db.collection('payments').insertMany(payments);
    console.log(`Created ${paymentResult.insertedCount} payments`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@pharmgenius.com / password123');
    console.log('Doctor: doctor@pharmgenius.com / password123');
    console.log('Patient: patient@pharmgenius.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedDatabase();
