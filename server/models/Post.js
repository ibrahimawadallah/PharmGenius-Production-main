import { MongoClient } from 'mongodb';

class Post {
  constructor() {
    this.collection = null;
    this.db = null;
  }

  async initialize(db) {
    this.db = db;
    this.collection = db.collection('posts');
    
    // Create indexes
    await this.collection.createIndex({ title: 1 });
    await this.collection.createIndex({ slug: 1 }, { unique: true });
    await this.collection.createIndex({ authorId: 1 });
    await this.collection.createIndex({ organizationId: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ category: 1 });
    await this.collection.createIndex({ tags: 1 });
    await this.collection.createIndex({ publishedAt: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ "seo.keywords": 1 });
  }

  async create(postData) {
    try {
      const {
        title,
        content,
        excerpt,
        authorId,
        organizationId,
        category,
        tags = [],
        featuredImage = null,
        seo = {},
        status = 'draft',
        allowComments = true,
        publishedAt = null
      } = postData;

      // Validate required fields
      if (!title || !content || !authorId || !category) {
        throw new Error('Missing required fields: title, content, authorId, and category are required');
      }

      // Generate slug from title
      const slug = this.generateSlug(title);

      // Check if slug already exists
      const existingPost = await this.collection.findOne({ slug });
      if (existingPost) {
        throw new Error('A post with this title already exists');
      }

      const post = {
        title,
        slug,
        content,
        excerpt: excerpt || this.generateExcerpt(content),
        authorId,
        organizationId,
        category, // healthcare, technology, research, news, etc.
        tags,
        featuredImage,
        seo: {
          title: seo.title || title,
          description: seo.description || excerpt || this.generateExcerpt(content),
          keywords: seo.keywords || tags,
          ogImage: seo.ogImage || featuredImage,
          canonicalUrl: seo.canonicalUrl || null
        },
        status, // draft, published, archived
        allowComments,
        publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shares: 0,
        readingTime: this.calculateReadingTime(content),
        metadata: {
          lastModified: new Date(),
          version: '1.0.0',
          language: 'en'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(post);
      post._id = result.insertedId;
      
      return post;
    } catch (error) {
      throw error;
    }
  }

  async findById(postId) {
    try {
      return await this.collection.findOne({ _id: postId });
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug) {
    try {
      return await this.collection.findOne({ slug, status: 'published' });
    } catch (error) {
      throw error;
    }
  }

  async update(postId, updateData) {
    try {
      const updateFields = {
        ...updateData,
        updatedAt: new Date(),
        'metadata.lastModified': new Date()
      };

      // Don't allow updating sensitive fields directly
      delete updateFields.authorId;
      delete updateFields.organizationId;
      delete updateFields.slug;
      delete updateFields.viewCount;
      delete updateFields.likeCount;
      delete updateFields.commentCount;

      // Regenerate excerpt if content changed
      if (updateData.content) {
        updateFields.excerpt = this.generateExcerpt(updateData.content);
        updateFields.readingTime = this.calculateReadingTime(updateData.content);
      }

      // Update publishedAt if status changes to published
      if (updateData.status === 'published' && !updateData.publishedAt) {
        updateFields.publishedAt = new Date();
      }

      const result = await this.collection.updateOne(
        { _id: postId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        throw new Error('Post not found');
      }

      return await this.findById(postId);
    } catch (error) {
      throw error;
    }
  }

  async publish(postId, publishedAt = null) {
    try {
      const post = await this.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const updateData = {
        status: 'published',
        publishedAt: publishedAt || new Date(),
        updatedAt: new Date(),
        'metadata.lastModified': new Date()
      };

      const result = await this.collection.updateOne(
        { _id: postId },
        { $set: updateData }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async archive(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $set: { 
            status: 'archived',
            updatedAt: new Date(),
            'metadata.lastModified': new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async incrementViewCount(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $inc: { viewCount: 1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async incrementLikeCount(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $inc: { likeCount: 1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async decrementLikeCount(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $inc: { likeCount: -1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async incrementCommentCount(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $inc: { commentCount: 1 },
          $set: { updatedAt: new Date() }
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async decrementCommentCount(postId) {
    try {
      const result = await this.collection.updateOne(
        { _id: postId },
        { 
          $inc: { commentCount: -1 },
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
      if (filters.authorId) query.authorId = filters.authorId;
      if (filters.organizationId) query.organizationId = filters.organizationId;
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { content: { $regex: filters.search, $options: 'i' } },
          { excerpt: { $regex: filters.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
      }
      if (filters.dateFrom) {
        query.publishedAt = { $gte: new Date(filters.dateFrom) };
      }
      if (filters.dateTo) {
        if (query.publishedAt) {
          query.publishedAt.$lte = new Date(filters.dateTo);
        } else {
          query.publishedAt = { $lte: new Date(filters.dateTo) };
        }
      }

      let sort = {};
      if (filters.sortBy === 'popular') {
        sort = { viewCount: -1, publishedAt: -1 };
      } else if (filters.sortBy === 'latest') {
        sort = { publishedAt: -1 };
      } else if (filters.sortBy === 'oldest') {
        sort = { publishedAt: 1 };
      } else {
        sort = { publishedAt: -1 };
      }

      const posts = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray();

      const total = await this.collection.countDocuments(query);

      return {
        posts,
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

  async getByAuthor(authorId, status = 'published') {
    try {
      const query = { authorId };
      if (status) query.status = status;

      return await this.collection
        .find(query)
        .sort({ publishedAt: -1 })
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
        .sort({ publishedAt: -1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getByCategory(category, limit = 10) {
    try {
      return await this.collection
        .find({ category, status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getRelatedPosts(postId, limit = 5) {
    try {
      const post = await this.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const query = {
        _id: { $ne: postId },
        status: 'published',
        $or: [
          { category: post.category },
          { tags: { $in: post.tags } }
        ]
      };

      return await this.collection
        .find(query)
        .sort({ publishedAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getPopularPosts(limit = 10, timeRange = '30d') {
    try {
      const dateFrom = new Date();
      if (timeRange === '7d') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      } else if (timeRange === '30d') {
        dateFrom.setDate(dateFrom.getDate() - 30);
      } else if (timeRange === '90d') {
        dateFrom.setDate(dateFrom.getDate() - 90);
      }

      return await this.collection
        .find({ 
          status: 'published',
          publishedAt: { $gte: dateFrom }
        })
        .sort({ viewCount: -1, likeCount: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getRecentPosts(limit = 10) {
    try {
      return await this.collection
        .find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async getPostStats(postId) {
    try {
      const post = await this.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      return {
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        shares: post.shares,
        readingTime: post.readingTime,
        publishedAt: post.publishedAt,
        lastModified: post.metadata.lastModified
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoryStats() {
    try {
      const stats = await this.collection.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$viewCount' },
            totalLikes: { $sum: '$likeCount' },
            totalComments: { $sum: '$commentCount' }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();

      return stats;
    } catch (error) {
      throw error;
    }
  }

  async searchPosts(query, filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      let searchQuery = {
        status: 'published',
        $text: { $search: query }
      };
      
      if (filters.category) searchQuery.category = filters.category;
      if (filters.authorId) searchQuery.authorId = filters.authorId;
      if (filters.organizationId) searchQuery.organizationId = filters.organizationId;
      if (filters.tags && filters.tags.length > 0) {
        searchQuery.tags = { $in: filters.tags };
      }

      const posts = await this.collection
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: 'textScore' } })
        .toArray();

      const total = await this.collection.countDocuments(searchQuery);

      return {
        posts,
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

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  generateExcerpt(content, maxLength = 160) {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) {
      return textContent;
    }
    return textContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  async delete(postId) {
    try {
      const result = await this.collection.deleteOne({ _id: postId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new Post();
