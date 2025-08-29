import { ObjectId } from 'mongodb';

class User {
  constructor(data) {
    this._id = data._id || new ObjectId();
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role || 'basic';
    this.organizationId = data.organizationId;
    this.emailVerified = data.emailVerified || false;
    this.status = data.status || 'active';
    this.permissions = data.permissions || [];
    this.profile = data.profile || {};
    this.preferences = data.preferences || {};
    this.lastLogin = data.lastLogin;
    this.loginAttempts = data.loginAttempts || 0;
    this.lockedUntil = data.lockedUntil;
    this.emailVerificationToken = data.emailVerificationToken;
    this.emailVerificationExpires = data.emailVerificationExpires;
    this.passwordResetToken = data.passwordResetToken;
    this.passwordResetExpires = data.passwordResetExpires;
    this.passwordChangedAt = data.passwordChangedAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async initialize(db) {
    this.db = db;
    this.collection = db.collection('users');
    
    // Create indexes
    await this.collection.createIndex({ email: 1 }, { unique: true });
    await this.collection.createIndex({ organizationId: 1 });
    await this.collection.createIndex({ role: 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ createdAt: 1 });
    await this.collection.createIndex({ emailVerificationToken: 1 });
    await this.collection.createIndex({ passwordResetToken: 1 });
    
    console.log('User model initialized');
  }

  static async create(userData) {
    try {
      const user = new User(userData);
      const result = await this.collection.insertOne(user);
      user._id = result.insertedId;
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  static async findById(id) {
    try {
      const userData = await this.collection.findOne({ _id: new ObjectId(id) });
      return userData ? new User(userData) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const userData = await this.collection.findOne({ email: email.toLowerCase() });
      return userData ? new User(userData) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(filter) {
    try {
      const userData = await this.collection.findOne(filter);
      return userData ? new User(userData) : null;
    } catch (error) {
      throw error;
    }
  }

  static async find(filter = {}, options = {}) {
    try {
      const {
        sort = { createdAt: -1 },
        limit = 50,
        skip = 0,
        projection = {}
      } = options;

      const cursor = this.collection.find(filter, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const users = await cursor.toArray();
      return users.map(userData => new User(userData));
    } catch (error) {
      throw error;
    }
  }

  static async updateOne(filter, update) {
    try {
      const result = await this.collection.updateOne(filter, {
        $set: { ...update, updatedAt: new Date() }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id, update) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...update, updatedAt: new Date() } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteOne(filter) {
    try {
      const result = await this.collection.deleteOne(filter);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async count(filter = {}) {
    try {
      return await this.collection.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  static async aggregate(pipeline) {
    try {
      return await this.collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw error;
    }
  }

  // Instance methods
  async save() {
    try {
      this.updatedAt = new Date();
      
      if (this._id) {
        // Update existing user
        const result = await User.collection.updateOne(
          { _id: this._id },
          { $set: this }
        );
        return result;
      } else {
        // Create new user
        this.createdAt = new Date();
        const result = await User.collection.insertOne(this);
        this._id = result.insertedId;
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  async update(updateData) {
    try {
      this.updatedAt = new Date();
      Object.assign(this, updateData);
      
      const result = await User.collection.updateOne(
        { _id: this._id },
        { $set: updateData }
      );
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      const result = await User.collection.deleteOne({ _id: this._id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  getDisplayName() {
    return this.profile?.displayName || this.getFullName();
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions) {
    return permissions.some(permission => this.permissions.includes(permission));
  }

  hasAllPermissions(permissions) {
    return permissions.every(permission => this.permissions.includes(permission));
  }

  hasRole(role) {
    return this.role === role;
  }

  hasAnyRole(roles) {
    return Array.isArray(roles) ? roles.includes(this.role) : roles === this.role;
  }

  isActive() {
    return this.status === 'active';
  }

  isEmailVerified() {
    return this.emailVerified;
  }

  isLocked() {
    return this.lockedUntil && this.lockedUntil > new Date();
  }

  canLogin() {
    return this.isActive() && !this.isLocked();
  }

  // Profile methods
  updateProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
    this.updatedAt = new Date();
  }

  updatePreferences(preferencesData) {
    this.preferences = { ...this.preferences, ...preferencesData };
    this.updatedAt = new Date();
  }

  // Authentication methods
  incrementLoginAttempts() {
    this.loginAttempts += 1;
    this.updatedAt = new Date();
    
    // Lock account after 5 failed attempts for 15 minutes
    if (this.loginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
  }

  resetLoginAttempts() {
    this.loginAttempts = 0;
    this.lockedUntil = null;
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }

  // Token methods
  setEmailVerificationToken(token, expiresIn = 24 * 60 * 60 * 1000) {
    this.emailVerificationToken = token;
    this.emailVerificationExpires = new Date(Date.now() + expiresIn);
    this.updatedAt = new Date();
  }

  clearEmailVerificationToken() {
    this.emailVerificationToken = null;
    this.emailVerificationExpires = null;
    this.updatedAt = new Date();
  }

  setPasswordResetToken(token, expiresIn = 60 * 60 * 1000) {
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + expiresIn);
    this.updatedAt = new Date();
  }

  clearPasswordResetToken() {
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
    this.updatedAt = new Date();
  }

  // Data sanitization for API responses
  toJSON() {
    const user = { ...this };
    delete user.password;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpires;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    return user;
  }

  toPublicJSON() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: this.getDisplayName(),
      role: this.role,
      organizationId: this.organizationId,
      profile: this.profile,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

export default User;
