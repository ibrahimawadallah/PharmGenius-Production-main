import { MongoClient } from 'mongodb';

class Course {
  constructor() {
    this.collection = null;
    this.db = null;
  }

  async initialize(db) {
    this.db = db;
    this.collection = db.collection('courses');
    
    // Create indexes
    await this.collection.createIndex({ title: 1 });
    await this.collection.createIndex({ category: 1 });
    await this.collection.createIndex({ difficulty: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ instructorId: 1 });
    await this.collection.createIndex({ organizationId: 1 });
    await this.collection.createIndex({ tags: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ "modules.title": 1 });
  }

  async create(courseData) {
    try {
      const {
        title,
        description,
        category,
        difficulty = 'beginner',
        instructorId,
        organizationId,
        tags = [],
        modules = [],
        prerequisites = [],
        learningObjectives = [],
        estimatedDuration = 0,
        thumbnail = null,
        status = 'draft'
      } = courseData;

      // Validate required fields
      if (!title || !description || !category || !instructorId) {
        throw new Error('Missing required fields: title, description, category, and instructorId are required');
      }

      const course = {
        title,
        description,
        category, // pharmacology, clinical_practice, regulations, etc.
        difficulty, // beginner, intermediate, advanced, expert
        instructorId,
        organizationId,
        tags,
        modules: modules.map((module, index) => ({
          id: module.id || `module_${index + 1}`,
          title: module.title,
          description: module.description,
          type: module.type || 'video', // video, text, quiz, interactive
          content: module.content || '',
          duration: module.duration || 0,
          order: module.order || index + 1,
          resources: module.resources || [],
          quiz: module.quiz || null,
          isPublished: module.isPublished || false
        })),
        prerequisites,
        learningObjectives,
        estimatedDuration, // in minutes
        thumbnail,
        status, // draft, published, archived
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
        reviews: [],
        metadata: {
          language: 'en',
          version: '1.0.0',
          lastUpdated: new Date(),
          certifications: [],
          ceCredits: 0
        },
        settings: {
          allowReviews: true,
          requireCompletion: true,
          allowDownload: false,
          maxAttempts: 3
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(course);
      course._id = result.insertedId;
      
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findById(courseId) {
    try {
      return await this.collection.findOne({ _id: courseId });
    } catch (error) {
      throw error;
    }
  }

  async update(courseId, updateData) {
    try {
      const updateFields = {
        ...updateData,
        updatedAt: new Date()
      };

      // Don't allow updating sensitive fields directly
      delete updateFields.instructorId;
      delete updateFields.organizationId;
      delete updateFields.enrollmentCount;
      delete updateFields.completionCount;

      const result = await this.collection.updateOne(
        { _id: courseId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        throw new Error('Course not found');
      }

      return await this.findById(courseId);
    } catch (error) {
      throw error;
    }
  }

  async addModule(courseId, moduleData) {
    try {
      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const newModule = {
        id: moduleData.id || `module_${course.modules.length + 1}`,
        title: moduleData.title,
        description: moduleData.description,
        type: moduleData.type || 'video',
        content: moduleData.content || '',
        duration: moduleData.duration || 0,
        order: course.modules.length + 1,
        resources: moduleData.resources || [],
        quiz: moduleData.quiz || null,
        isPublished: moduleData.isPublished || false
      };

      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $push: { modules: newModule },
          $set: { updatedAt: new Date() }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async updateModule(courseId, moduleId, updateData) {
    try {
      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      const updatedModules = [...course.modules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        ...updateData
      };

      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $set: { 
            modules: updatedModules,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteModule(courseId, moduleId) {
    try {
      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedModules = course.modules.filter(m => m.id !== moduleId);
      
      // Reorder remaining modules
      updatedModules.forEach((module, index) => {
        module.order = index + 1;
      });

      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $set: { 
            modules: updatedModules,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async publishCourse(courseId) {
    try {
      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if all modules are ready
      const unpublishedModules = course.modules.filter(m => !m.isPublished);
      if (unpublishedModules.length > 0) {
        throw new Error('All modules must be published before publishing the course');
      }

      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $set: { 
            status: 'published',
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addRating(courseId, ratingData) {
    try {
      const {
        userId,
        rating,
        review = '',
        categories = {}
      } = ratingData;

      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if user already rated
      const existingRatingIndex = course.ratings.findIndex(r => r.userId === userId);
      const newRating = {
        userId,
        rating,
        review,
        categories,
        timestamp: new Date()
      };

      let updatedRatings, updatedReviews;
      if (existingRatingIndex !== -1) {
        // Update existing rating
        updatedRatings = [...course.ratings];
        updatedRatings[existingRatingIndex] = newRating;
        updatedReviews = course.reviews.filter(r => r.userId !== userId);
        if (review) {
          updatedReviews.push(newRating);
        }
      } else {
        // Add new rating
        updatedRatings = [...course.ratings, newRating];
        updatedReviews = [...course.reviews];
        if (review) {
          updatedReviews.push(newRating);
        }
      }

      // Calculate new average
      const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
      const newAverageRating = totalRating / updatedRatings.length;

      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $set: { 
            ratings: updatedRatings,
            reviews: updatedReviews,
            averageRating: newAverageRating,
            totalRatings: updatedRatings.length,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async incrementEnrollment(courseId) {
    try {
      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $inc: { enrollmentCount: 1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async incrementCompletion(courseId) {
    try {
      const result = await this.collection.updateOne(
        { _id: courseId },
        { 
          $inc: { completionCount: 1 },
          $set: { updatedAt: new Date() }
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
      
      let query = { status: 'published' };
      
      if (filters.category) query.category = filters.category;
      if (filters.difficulty) query.difficulty = filters.difficulty;
      if (filters.instructorId) query.instructorId = filters.instructorId;
      if (filters.organizationId) query.organizationId = filters.organizationId;
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      if (filters.minRating) {
        query.averageRating = { $gte: parseFloat(filters.minRating) };
      }

      const courses = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      const total = await this.collection.countDocuments(query);

      return {
        courses,
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

  async getByInstructor(instructorId, status = null) {
    try {
      let query = { instructorId };
      if (status) query.status = status;

      return await this.collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getByOrganization(organizationId, status = 'published') {
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

  async getPopularCourses(limit = 10) {
    try {
      return await this.collection
        .find({ status: 'published' })
        .sort({ enrollmentCount: -1, averageRating: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getRecentCourses(limit = 10) {
    try {
      return await this.collection
        .find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getCourseStats(courseId) {
    try {
      const course = await this.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      return {
        enrollmentCount: course.enrollmentCount,
        completionCount: course.completionCount,
        completionRate: course.enrollmentCount > 0 ? 
          (course.completionCount / course.enrollmentCount * 100).toFixed(2) : 0,
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        moduleCount: course.modules.length,
        totalDuration: course.modules.reduce((sum, m) => sum + m.duration, 0)
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(courseId) {
    try {
      const result = await this.collection.deleteOne({ _id: courseId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new Course();
