import { MongoClient } from 'mongodb';

class Payment {
  constructor() {
    this.collection = null;
    this.db = null;
  }

  async initialize(db) {
    this.db = db;
    this.collection = db.collection('payments');
    
    // Create indexes
    await this.collection.createIndex({ userId: 1 });
    await this.collection.createIndex({ organizationId: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ type: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ subscriptionId: 1 });
    await this.collection.createIndex({ stripePaymentIntentId: 1 });
    await this.collection.createIndex({ "subscription.plan": 1 });
  }

  async createPayment(paymentData) {
    try {
      const {
        userId,
        organizationId,
        type,
        amount,
        currency = 'USD',
        description,
        metadata = {},
        stripePaymentIntentId = null,
        subscriptionId = null
      } = paymentData;

      // Validate required fields
      if (!userId || !type || !amount) {
        throw new Error('Missing required fields: userId, type, and amount are required');
      }

      const payment = {
        userId,
        organizationId,
        type, // subscription, one_time, refund, credit
        amount, // in cents
        currency,
        description: description || '',
        metadata,
        stripePaymentIntentId,
        subscriptionId,
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Payment created'
        }],
        attempts: 0,
        maxAttempts: 3,
        lastAttempt: null,
        errorMessage: null,
        refunded: false,
        refundAmount: 0,
        refundReason: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(payment);
      payment._id = result.insertedId;
      
      return payment;
    } catch (error) {
      throw error;
    }
  }

  async createSubscription(subscriptionData) {
    try {
      const {
        userId,
        organizationId,
        plan,
        interval,
        amount,
        currency = 'USD',
        trialDays = 0,
        metadata = {},
        stripeSubscriptionId = null
      } = subscriptionData;

      // Validate required fields
      if (!userId || !plan || !interval || !amount) {
        throw new Error('Missing required fields: userId, plan, interval, and amount are required');
      }

      const subscription = {
        userId,
        organizationId,
        plan, // basic, pro, enterprise
        interval, // monthly, yearly
        amount, // in cents
        currency,
        trialDays,
        metadata,
        stripeSubscriptionId,
        status: 'active',
        statusHistory: [{
          status: 'active',
          timestamp: new Date(),
          note: 'Subscription created'
        }],
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.calculatePeriodEnd(new Date(), interval),
        trialStart: trialDays > 0 ? new Date() : null,
        trialEnd: trialDays > 0 ? this.addDays(new Date(), trialDays) : null,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
        endedAt: null,
        features: this.getFeaturesByPlan(plan),
        maxUsers: this.getMaxUsersByPlan(plan),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(subscription);
      subscription._id = result.insertedId;
      
      return subscription;
    } catch (error) {
      throw error;
    }
  }

  async findPaymentById(paymentId) {
    try {
      return await this.collection.findOne({ _id: paymentId });
    } catch (error) {
      throw error;
    }
  }

  async findSubscriptionById(subscriptionId) {
    try {
      return await this.collection.findOne({ _id: subscriptionId });
    } catch (error) {
      throw error;
    }
  }

  async findSubscriptionByStripeId(stripeSubscriptionId) {
    try {
      return await this.collection.findOne({ stripeSubscriptionId });
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(paymentId, newStatus, note = '') {
    try {
      const payment = await this.findPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const statusUpdate = {
        status: newStatus,
        statusHistory: [
          ...payment.statusHistory,
          {
            status: newStatus,
            timestamp: new Date(),
            note
          }
        ],
        updatedAt: new Date()
      };

      if (newStatus === 'succeeded') {
        statusUpdate.succeededAt = new Date();
      } else if (newStatus === 'failed') {
        statusUpdate.failedAt = new Date();
        statusUpdate.attempts = payment.attempts + 1;
        statusUpdate.lastAttempt = new Date();
      }

      const result = await this.collection.updateOne(
        { _id: paymentId },
        { $set: statusUpdate }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriptionStatus(subscriptionId, newStatus, note = '') {
    try {
      const subscription = await this.findSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const statusUpdate = {
        status: newStatus,
        statusHistory: [
          ...subscription.statusHistory,
          {
            status: newStatus,
            timestamp: new Date(),
            note
          }
        ],
        updatedAt: new Date()
      };

      if (newStatus === 'cancelled') {
        statusUpdate.cancelledAt = new Date();
      } else if (newStatus === 'ended') {
        statusUpdate.endedAt = new Date();
      }

      const result = await this.collection.updateOne(
        { _id: subscriptionId },
        { $set: statusUpdate }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    try {
      const subscription = await this.findSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const updateData = {
        cancelAtPeriodEnd,
        updatedAt: new Date()
      };

      if (!cancelAtPeriodEnd) {
        updateData.status = 'cancelled';
        updateData.cancelledAt = new Date();
        updateData.endedAt = new Date();
      }

      const result = await this.collection.updateOne(
        { _id: subscriptionId },
        { $set: updateData }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async processRefund(paymentId, refundAmount, reason = '') {
    try {
      const payment = await this.findPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'succeeded') {
        throw new Error('Payment must be succeeded to process refund');
      }

      if (refundAmount > payment.amount) {
        throw new Error('Refund amount cannot exceed payment amount');
      }

      const result = await this.collection.updateOne(
        { _id: paymentId },
        { 
          $set: { 
            refunded: true,
            refundAmount,
            refundReason: reason,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentsByUser(userId, filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      let query = { userId };
      
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.dateFrom) {
        query.createdAt = { $gte: new Date(filters.dateFrom) };
      }
      if (filters.dateTo) {
        if (query.createdAt) {
          query.createdAt.$lte = new Date(filters.dateTo);
        } else {
          query.createdAt = { $lte: new Date(filters.dateTo) };
        }
      }

      const payments = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      const total = await this.collection.countDocuments(query);

      return {
        payments,
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

  async getSubscriptionsByUser(userId, status = null) {
    try {
      let query = { userId };
      if (status) query.status = status;

      return await this.collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionsByOrganization(organizationId, status = 'active') {
    try {
      const query = { organizationId };
      if (status) query.status = status;

      return await this.collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getActiveSubscription(userId) {
    try {
      return await this.collection.findOne({ 
        userId, 
        status: 'active',
        type: 'subscription'
      });
    } catch (error) {
      throw error;
    }
  }

  async getPaymentStats(userId = null, organizationId = null, timeRange = '30d') {
    try {
      const dateFrom = new Date();
      if (timeRange === '7d') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      } else if (timeRange === '30d') {
        dateFrom.setDate(dateFrom.getDate() - 30);
      } else if (timeRange === '90d') {
        dateFrom.setDate(dateFrom.getDate() - 90);
      }

      let query = { createdAt: { $gte: dateFrom } };
      if (userId) query.userId = userId;
      if (organizationId) query.organizationId = organizationId;

      const stats = await this.collection.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            byStatus: {
              $push: {
                status: '$status',
                count: 1
              }
            },
            byType: {
              $push: {
                type: '$type',
                count: 1
              }
            },
            successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, 1, 0] } },
            failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
            refundedAmount: { $sum: '$refundAmount' }
          }
        }
      ]).toArray();

      return stats[0] || { 
        totalPayments: 0, 
        totalAmount: 0, 
        byStatus: [], 
        byType: [], 
        successfulPayments: 0, 
        failedPayments: 0, 
        refundedAmount: 0 
      };
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionStats(organizationId = null) {
    try {
      let query = { type: 'subscription' };
      if (organizationId) query.organizationId = organizationId;

      const stats = await this.collection.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalSubscriptions: { $sum: 1 },
            activeSubscriptions: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            cancelledSubscriptions: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
            byPlan: {
              $push: {
                plan: '$plan',
                count: 1
              }
            },
            byInterval: {
              $push: {
                interval: '$interval',
                count: 1
              }
            },
            totalRevenue: { $sum: '$amount' }
          }
        }
      ]).toArray();

      return stats[0] || { 
        totalSubscriptions: 0, 
        activeSubscriptions: 0, 
        cancelledSubscriptions: 0, 
        byPlan: [], 
        byInterval: [], 
        totalRevenue: 0 
      };
    } catch (error) {
      throw error;
    }
  }

  calculatePeriodEnd(startDate, interval) {
    const endDate = new Date(startDate);
    if (interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    return endDate;
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

  async deletePayment(paymentId) {
    try {
      const result = await this.collection.deleteOne({ _id: paymentId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      const result = await this.collection.deleteOne({ _id: subscriptionId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new Payment();
