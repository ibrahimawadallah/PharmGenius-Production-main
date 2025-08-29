// Authentication Service for PharmGenius
import { authService as apiAuthService, userService } from './api';
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // API-backed login
  async login(email, password) {
    try {
      // Call real API
      const response = await apiAuthService.login({ email, password });
      const { accessToken, refreshToken, user } = response || {};

      if (!accessToken || !refreshToken) {
        return { success: false, error: 'Invalid login response' };
      }

      // Persist tokens for interceptors and app session
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Ensure we have user info; if not provided, fetch it
      let resolvedUser = user;
      if (!resolvedUser) {
        try {
          resolvedUser = await userService.getProfile();
        } catch {
          // swallow: profile fetch can fail if backend doesn’t return user in login
        }
      }

      if (resolvedUser) {
        this.currentUser = resolvedUser;
        this.isAuthenticated = true;
        // Keep backward compatibility for any code reading this key
        localStorage.setItem('pharmgenius_user', JSON.stringify(resolvedUser));
      }

      return {
        success: true,
        user: resolvedUser || null,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  }

  // API-backed logout
  logout() {
    try {
      // Best-effort server-side logout
      apiAuthService.logout().catch(() => {});
    } finally {
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('pharmgenius_user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Get current user
  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('pharmgenius_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    }
    return this.currentUser;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    const token = localStorage.getItem('accessToken');
    return !!token && !!this.getCurrentUser();
  }

  // Check user permissions
  hasPermission(permission) {
    const user = this.getCurrentUser();
    return !!(user && Array.isArray(user.permissions) && user.permissions.includes(permission));
  }

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Get available features for current user
  getAvailableFeatures() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return user.permissions || [];
  }
}

export default new AuthService();