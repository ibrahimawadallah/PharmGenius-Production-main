import { MongoClient } from 'mongodb';

class Consultation {
  constructor() {
    this.collection = null;
    this.db = null;
  }

  async initialize(db) {
    this.db = db;
    this.collection = db.collection('consultations');
    
    // Create indexes
    await this.collection.createIndex({ patientId: 1 });
    await this.collection.createIndex({ providerId: 1 });
    await this.collection.createIndex({ organizationId: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ scheduledAt: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ consultationType: 1 });
    await this.collection.createIndex({ "tags": 1 });
  }

  async create(consultationData) {
    try {
      const {
        patientId,
        providerId,
        organizationId,
        consultationType,
        scheduledAt,
        duration = 30,
        description,
        symptoms,
        medicalHistory,
        medications,
        allergies,
        urgency = 'routine',
        tags = [],
        notes = '',
        attachments = []
      } = consultationData;

      // Validate required fields
      if (!patientId || !providerId || !consultationType || !scheduledAt) {
        throw new Error('Missing required fields: patientId, providerId, consultationType, and scheduledAt are required');
      }

      const consultation = {
        patientId,
        providerId,
        organizationId,
        consultationType, // video, audio, chat, in_person
        scheduledAt: new Date(scheduledAt),
        duration, // in minutes
        description: description || '',
        symptoms: symptoms || [],
        medicalHistory: medicalHistory || [],
        medications: medications || [],
        allergies: allergies || [],
        urgency, // routine, urgent, emergency
        tags,
        notes,
        attachments,
        status: 'scheduled',
        statusHistory: [{
          status: 'scheduled',
          timestamp: new Date(),
          note: 'Consultation scheduled'
        }],
        messages: [],
        diagnosis: null,
        prescription: null,
        followUp: null,
        rating: null,
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(consultation);
      consultation._id = result.insertedId;
      
      return consultation;
    } catch (error) {
      throw error;
    }
  }

  async findById(consultationId) {
    try {
      return await this.collection.findOne({ _id: consultationId });
    } catch (error) {
      throw error;
    }
  }

  async update(consultationId, updateData) {
    try {
      const updateFields = {
        ...updateData,
        updatedAt: new Date()
      };

      // Don't allow updating sensitive fields directly
      delete updateFields.patientId;
      delete updateFields.providerId;
      delete updateFields.organizationId;

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        throw new Error('Consultation not found');
      }

      return await this.findById(consultationId);
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(consultationId, newStatus, note = '') {
    try {
      const consultation = await this.findById(consultationId);
      if (!consultation) {
        throw new Error('Consultation not found');
      }

      const statusUpdate = {
        status: newStatus,
        statusHistory: [
          ...consultation.statusHistory,
          {
            status: newStatus,
            timestamp: new Date(),
            note
          }
        ],
        updatedAt: new Date()
      };

      // Add specific fields based on status
      if (newStatus === 'in_progress') {
        statusUpdate.startedAt = new Date();
      } else if (newStatus === 'completed') {
        statusUpdate.completedAt = new Date();
      } else if (newStatus === 'cancelled') {
        statusUpdate.cancelledAt = new Date();
      }

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { $set: statusUpdate }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addMessage(consultationId, messageData) {
    try {
      const {
        senderId,
        senderType, // patient, provider, system
        content,
        messageType = 'text', // text, image, file, audio
        attachments = []
      } = messageData;

      if (!senderId || !content) {
        throw new Error('Missing required fields: senderId and content are required');
      }

      const message = {
        id: Date.now().toString(),
        senderId,
        senderType,
        content,
        messageType,
        attachments,
        timestamp: new Date(),
        read: false
      };

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { 
          $push: { messages: message },
          $set: { updatedAt: new Date() }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async markMessageAsRead(consultationId, messageId, userId) {
    try {
      const result = await this.collection.updateOne(
        { 
          _id: consultationId,
          'messages.id': messageId
        },
        { 
          $set: { 
            'messages.$.read': true,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addDiagnosis(consultationId, diagnosisData) {
    try {
      const {
        condition,
        severity,
        notes,
        icd10Codes = [],
        recommendations = []
      } = diagnosisData;

      if (!condition) {
        throw new Error('Diagnosis condition is required');
      }

      const diagnosis = {
        condition,
        severity: severity || 'moderate',
        notes: notes || '',
        icd10Codes,
        recommendations,
        timestamp: new Date()
      };

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { 
          $set: { 
            diagnosis,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addPrescription(consultationId, prescriptionData) {
    try {
      const {
        medications = [],
        instructions = '',
        duration = '',
        refills = 0,
        notes = ''
      } = prescriptionData;

      const prescription = {
        medications,
        instructions,
        duration,
        refills,
        notes,
        timestamp: new Date()
      };

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { 
          $set: { 
            prescription,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addRating(consultationId, ratingData) {
    try {
      const {
        rating,
        feedback = '',
        categories = {}
      } = ratingData;

      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const ratingObj = {
        rating,
        feedback,
        categories,
        timestamp: new Date()
      };

      const result = await this.collection.updateOne(
        { _id: consultationId },
        { 
          $set: { 
            rating: ratingObj,
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
      
      let query = {};
      
      if (filters.patientId) query.patientId = filters.patientId;
      if (filters.providerId) query.providerId = filters.providerId;
      if (filters.organizationId) query.organizationId = filters.organizationId;
      if (filters.status) query.status = filters.status;
      if (filters.consultationType) query.consultationType = filters.consultationType;
      if (filters.urgency) query.urgency = filters.urgency;
      if (filters.dateFrom) {
        query.scheduledAt = { $gte: new Date(filters.dateFrom) };
      }
      if (filters.dateTo) {
        if (query.scheduledAt) {
          query.scheduledAt.$lte = new Date(filters.dateTo);
        } else {
          query.scheduledAt = { $lte: new Date(filters.dateTo) };
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      const consultations = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ scheduledAt: -1 })
        .toArray();

      const total = await this.collection.countDocuments(query);

      return {
        consultations,
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

  async getUpcomingConsultations(userId, userType, limit = 10) {
    try {
      const query = {
        status: { $in: ['scheduled', 'confirmed'] },
        scheduledAt: { $gte: new Date() }
      };

      if (userType === 'patient') {
        query.patientId = userId;
      } else if (userType === 'provider') {
        query.providerId = userId;
      }

      return await this.collection
        .find(query)
        .limit(limit)
        .sort({ scheduledAt: 1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getConsultationStats(userId, userType, timeRange = '30d') {
    try {
      const dateFrom = new Date();
      if (timeRange === '7d') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      } else if (timeRange === '30d') {
        dateFrom.setDate(dateFrom.getDate() - 30);
      } else if (timeRange === '90d') {
        dateFrom.setDate(dateFrom.getDate() - 90);
      }

      const query = {
        createdAt: { $gte: dateFrom }
      };

      if (userType === 'patient') {
        query.patientId = userId;
      } else if (userType === 'provider') {
        query.providerId = userId;
      }

      const stats = await this.collection.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            byStatus: {
              $push: {
                status: '$status',
                count: 1
              }
            },
            byType: {
              $push: {
                type: '$consultationType',
                count: 1
              }
            },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
          }
        }
      ]).toArray();

      return stats[0] || { total: 0, byStatus: [], byType: [], completed: 0, cancelled: 0 };
    } catch (error) {
      throw error;
    }
  }

  async delete(consultationId) {
    try {
      const result = await this.collection.deleteOne({ _id: consultationId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new Consultation();
