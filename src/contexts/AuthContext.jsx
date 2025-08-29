import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  accessToken: null,
  refreshToken: null,
  userRole: null,
  permissions: [],
  lastActivity: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        userRole: action.payload.user.role,
        permissions: action.payload.user.permissions || [],
        lastActivity: new Date().toISOString(),
      };
      
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userRole: null,
        permissions: [],
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
      
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload.user,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        userRole: action.payload.user.role,
        permissions: action.payload.user.permissions || [],
        lastActivity: new Date().toISOString(),
      };
      
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        lastActivity: new Date().toISOString(),
      };
      
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        userRole: action.payload.role || state.userRole,
        permissions: action.payload.permissions || state.permissions,
      };
      
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    case AUTH_ACTIONS.VERIFY_EMAIL:
      return {
        ...state,
        user: { ...state.user, emailVerified: true },
      };
      
    case AUTH_ACTIONS.FORGOT_PASSWORD:
      return {
        ...state,
        error: null,
      };
      
    case AUTH_ACTIONS.RESET_PASSWORD:
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing tokens on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        try {
          // Verify token validity
          const response = await authService.refreshToken(refreshToken);
          dispatch({
            type: AUTH_ACTIONS.REFRESH_TOKEN,
            payload: { accessToken: response.accessToken },
          });
          
          // Get user profile
          const userResponse = await fetch('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch({
              type: AUTH_ACTIONS.UPDATE_PROFILE,
              payload: userData,
            });
          }
        } catch (error) {
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };

    initializeAuth();
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkInactivity = () => {
      if (state.lastActivity) {
        const lastActivity = new Date(state.lastActivity);
        const now = new Date();
        const inactiveTime = now - lastActivity;
        const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

        if (inactiveTime > maxInactiveTime) {
          logout();
        }
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.lastActivity, state.isAuthenticated]);

  // Update activity timestamp on user interaction
  useEffect(() => {
    const updateActivity = () => {
      if (state.isAuthenticated) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE,
          payload: { lastActivity: new Date().toISOString() },
        });
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [state.isAuthenticated]);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authService.login(credentials);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await authService.register(userData);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.accessToken) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      await authService.forgotPassword(email);
      
      dispatch({ type: AUTH_ACTIONS.FORGOT_PASSWORD });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      await authService.resetPassword(token, password);
      
      dispatch({ type: AUTH_ACTIONS.RESET_PASSWORD });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE,
          payload: updatedUser,
        });
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check permissions function
  const hasPermission = (permission) => {
    return state.permissions.includes(permission);
  };

  // Check role function
  const hasRole = (role) => {
    return state.userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return Array.isArray(roles) ? roles.includes(state.userRole) : roles === state.userRole;
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => state.permissions.includes(permission));
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => state.permissions.includes(permission));
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    accessToken: state.accessToken,
    userRole: state.userRole,
    permissions: state.permissions,
    
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
    
    // Utility functions
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for role-based access control
export const withRole = (WrappedComponent, requiredRole) => {
  return function WithRoleComponent(props) {
    const { hasRole, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (!hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Higher-order component for permission-based access control
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function WithPermissionComponent(props) {
    const { hasPermission, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (!hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;
