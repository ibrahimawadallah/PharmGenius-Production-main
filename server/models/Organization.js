import { MongoClient } from 'mongodb';

class Organization {
  constructor() {
    this.collection = null;
    this.db = null;
  }

  async initialize(db) {
    this.db = db;
    this.collection = db.collection('organizations');
    
    // Create indexes
    await this.collection.createIndex({ name: 1 });
    await this.collection.createIndex({ type: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ subscription: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ "address.country": 1 });
    await this.collection.createIndex({ "address.city": 1 });
  }

  async create(orgData) {
    try {
      const {
        name,
        type,
        description,
        address,
        contact,
        subscription = 'basic',
        adminUserId,
        settings = {}
      } = orgData;

      // Validate required fields
      if (!name || !type || !adminUserId) {
        throw new Error('Missing required fields: name, type, and adminUserId are required');
      }

      // Check if organization already exists
      const existingOrg = await this.collection.findOne({ name });
      if (existingOrg) {
        throw new Error('Organization with this name already exists');
      }

      const organization = {
        name,
        type, // hospital, clinic, pharmacy, research_institute, etc.
        description: description || '',
        address: {
          street: address?.street || '',
          city: address?.city || '',
          state: address?.state || '',
          country: address?.country || '',
          postalCode: address?.postalCode || '',
          coordinates: address?.coordinates || null
        },
        contact: {
          email: contact?.email || '',
          phone: contact?.phone || '',
          website: contact?.website || '',
          emergencyContact: contact?.emergencyContact || ''
        },
        subscription: {
          plan: subscription,
          status: 'active',
          startDate: new Date(),
          endDate: null,
          features: this.getFeaturesByPlan(subscription),
          maxUsers: this.getMaxUsersByPlan(subscription)
        },
        adminUserId,
        members: [adminUserId],
        memberCount: 1,
        status: 'active',
        settings: {
          allowMemberInvites: true,
          requireApproval: false,
          defaultUserRole: 'member',
          ...settings
        },
        metadata: {
          founded: null,
          specialties: [],
          accreditations: [],
          licenses: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(organization);
      organization._id = result.insertedId;
      
      return organization;
    } catch (error) {
      throw error;
    }
  }

  async findById(orgId) {
    try {
      return await this.collection.findOne({ _id: orgId });
    } catch (error) {
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await this.collection.findOne({ name });
    } catch (error) {
      throw error;
    }
  }

  async update(orgId, updateData) {
    try {
      const updateFields = {
        ...updateData,
        updatedAt: new Date()
      };

      // Don't allow updating sensitive fields directly
      delete updateFields.adminUserId;
      delete updateFields.members;
      delete updateFields.memberCount;

      const result = await this.collection.updateOne(
        { _id: orgId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        throw new Error('Organization not found');
      }

      return await this.findById(orgId);
    } catch (error) {
      throw error;
    }
  }

  async addMember(orgId, userId, role = 'member') {
    try {
      const result = await this.collection.updateOne(
        { _id: orgId },
        { 
          $addToSet: { members: userId },
          $inc: { memberCount: 1 }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Organization not found');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(orgId, userId) {
    try {
      const result = await this.collection.updateOne(
        { _id: orgId },
        { 
          $pull: { members: userId },
          $inc: { memberCount: -1 }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Organization not found');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateSubscription(orgId, subscriptionData) {
    try {
      const result = await this.collection.updateOne(
        { _id: orgId },
        { 
          $set: { 
            subscription: subscriptionData,
            updatedAt: new Date()
          }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async list(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      let query = { status: 'active' };
      
      if (filters.type) query.type = filters.type;
      if (filters.subscription) query['subscription.plan'] = filters.subscription;
      if (filters.country) query['address.country'] = filters.country;
      if (filters.city) query['address.city'] = filters.city;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const organizations = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      const total = await this.collection.countDocuments(query);

      return {
        organizations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getByAdminUser(adminUserId) {
    try {
      return await this.collection.findOne({ adminUserId });
    } catch (error) {
      throw error;
    }
  }

  async getByMember(userId) {
    try {
      return await this.collection.findOne({ members: userId });
    } catch (error) {
      throw error;
    }
  }

  async delete(orgId) {
    try {
      const result = await this.collection.deleteOne({ _id: orgId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    try {
      const stats = await this.collection.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            byType: {
              $push: {
                type: '$type',
                count: 1
              }
            },
            bySubscription: {
              $push: {
                plan: '$subscription.plan',
                count: 1
              }
            },
            totalMembers: { $sum: '$memberCount' }
          }
        }
      ]).toArray();

      return stats[0] || { total: 0, active: 0, byType: [], bySubscription: [], totalMembers: 0 };
    } catch (error) {
      throw error;
    }
  }

  getFeaturesByPlan(plan) {
    const features = {
      basic: ['basic_drug_search', 'basic_consultations', 'user_management'],
      pro: ['advanced_drug_search', 'consultations', 'learning_modules', 'analytics', 'user_management'],
      enterprise: ['advanced_drug_search', 'consultations', 'learning_modules', 'analytics', 'user_management', 'custom_integrations', 'priority_support', 'white_label']
    };
    return features[plan] || features.basic;
  }

  getMaxUsersByPlan(plan) {
    const limits = {
      basic: 10,
      pro: 50,
      enterprise: 1000
    };
    return limits[plan] || limits.basic;
  }
}

export default new Organization();
