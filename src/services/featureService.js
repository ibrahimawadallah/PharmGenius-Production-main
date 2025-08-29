// Feature Service for PharmGenius - Manages all application features and their content
import axios from 'axios';

class FeatureService {
  constructor() {
    this.baseURL = '/api/features';
    this.cache = new Map();
  }

  // Get all PharmGenius features
  getPharmGeniusFeatures() {
    return [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Comprehensive overview of drug database and system metrics',
        icon: 'FaHome',
        category: 'overview',
        permissions: ['dashboard'],
        resources: {
          endpoints: ['/api/stats/overview', '/api/stats/recent-activity'],
          documentation: '/docs/dashboard',
          tutorials: [
            { title: 'Dashboard Overview', url: '/tutorials/dashboard-basics' },
            { title: 'Reading Metrics', url: '/tutorials/metrics-guide' }
          ]
        },
        content: {
          title: 'PharmGenius Dashboard',
          subtitle: 'Real-time insights into UAE pharmaceutical database',
          features: [
            'Live drug database statistics',
            'Recent approval activities',
            'System health monitoring',
            'Quick action shortcuts'
          ]
        }
      },
      {
        id: 'drug-search',
        name: 'Drug Search',
        description: 'Advanced pharmaceutical search and verification system',
        icon: 'FaPills',
        category: 'core',
        permissions: ['drug-search'],
        resources: {
          endpoints: ['/api/drug-service/search', '/api/drug-service/drugs/:id'],
          documentation: '/docs/drug-search',
          tutorials: [
            { title: 'Basic Drug Search', url: '/tutorials/search-basics' },
            { title: 'Advanced Filters', url: '/tutorials/advanced-search' },
            { title: 'Verification Process', url: '/tutorials/verification' }
          ]
        },
        content: {
          title: 'Drug Search & Verification',
          subtitle: 'Search and verify medications from UAE Health Authority database',
          features: [
            'Real-time drug database search',
            'Approval status verification',
            'Detailed drug information',
            'Manufacturer details',
            'Dosage and strength information'
          ]
        }
      },
      {
        id: 'drug-database',
        name: 'Drug Database',
        description: 'Complete pharmaceutical database management',
        icon: 'FaDatabase',
        category: 'management',
        permissions: ['drug-database', 'admin'],
        resources: {
          endpoints: ['/api/drugs', '/api/drugs/bulk', '/api/drugs/import'],
          documentation: '/docs/database-management',
          tutorials: [
            { title: 'Database Overview', url: '/tutorials/database-basics' },
            { title: 'Adding New Drugs', url: '/tutorials/add-drugs' },
            { title: 'Bulk Operations', url: '/tutorials/bulk-operations' }
          ]
        },
        content: {
          title: 'Drug Database Management',
          subtitle: 'Comprehensive pharmaceutical database administration',
          features: [
            'Complete drug catalog management',
            'Bulk import/export operations',
            'Data validation and verification',
            'Audit trail and versioning',
            'Integration with UAE Health Authority'
          ]
        }
      },
      {
        id: 'providers',
        name: 'Healthcare Providers',
        description: 'Healthcare provider network management',
        icon: 'FaHospital',
        category: 'network',
        permissions: ['providers', 'admin'],
        resources: {
          endpoints: ['/api/providers', '/api/providers/network', '/api/providers/verification'],
          documentation: '/docs/provider-management',
          tutorials: [
            { title: 'Provider Network', url: '/tutorials/provider-basics' },
            { title: 'Verification Process', url: '/tutorials/provider-verification' },
            { title: 'Network Analytics', url: '/tutorials/network-analytics' }
          ]
        },
        content: {
          title: 'Healthcare Provider Network',
          subtitle: 'Comprehensive healthcare provider management system',
          features: [
            'Provider registration and verification',
            'Network analytics and insights',
            'Prescription tracking',
            'Provider performance metrics',
            'Compliance monitoring'
          ]
        }
      },
      {
        id: 'reports',
        name: 'Reports & Analytics',
        description: 'Advanced reporting and analytics dashboard',
        icon: 'FaFileAlt',
        category: 'analytics',
        permissions: ['reports'],
        resources: {
          endpoints: ['/api/reports', '/api/analytics', '/api/exports'],
          documentation: '/docs/reporting',
          tutorials: [
            { title: 'Report Generation', url: '/tutorials/report-basics' },
            { title: 'Custom Analytics', url: '/tutorials/custom-analytics' },
            { title: 'Data Export', url: '/tutorials/data-export' }
          ]
        },
        content: {
          title: 'Reports & Analytics',
          subtitle: 'Comprehensive pharmaceutical data analytics',
          features: [
            'Custom report generation',
            'Real-time analytics dashboard',
            'Data visualization tools',
            'Export capabilities',
            'Scheduled reporting'
          ]
        }
      },
      {
        id: 'lab-results',
        name: 'Lab Results',
        description: 'Laboratory test results and drug interaction analysis',
        icon: 'FaFlask',
        category: 'clinical',
        permissions: ['lab-results', 'clinical'],
        resources: {
          endpoints: ['/api/lab-results', '/api/interactions', '/api/clinical-data'],
          documentation: '/docs/lab-integration',
          tutorials: [
            { title: 'Lab Integration', url: '/tutorials/lab-basics' },
            { title: 'Interaction Analysis', url: '/tutorials/interactions' },
            { title: 'Clinical Insights', url: '/tutorials/clinical-data' }
          ]
        },
        content: {
          title: 'Laboratory Results & Analysis',
          subtitle: 'Clinical data integration and drug interaction analysis',
          features: [
            'Lab result integration',
            'Drug interaction analysis',
            'Clinical decision support',
            'Safety alerts and warnings',
            'Patient-specific recommendations'
          ]
        }
      }
    ];
  }

  // Get feature by ID
  getFeatureById(featureId) {
    const features = this.getPharmGeniusFeatures();
    return features.find(feature => feature.id === featureId);
  }

  // Get features by category
  getFeaturesByCategory(category) {
    const features = this.getPharmGeniusFeatures();
    return features.filter(feature => feature.category === category);
  }

  // Get features by user permissions
  getFeaturesByPermissions(userPermissions) {
    const features = this.getPharmGeniusFeatures();
    return features.filter(feature => 
      feature.permissions.some(permission => userPermissions.includes(permission))
    );
  }

  // Get feature content with resources
  async getFeatureContent(featureId) {
    const feature = this.getFeatureById(featureId);
    if (!feature) return null;

    // Check cache first
    const cacheKey = `feature_content_${featureId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try to fetch dynamic content from API
      const response = await axios.get(`${this.baseURL}/${featureId}/content`);
      const content = { ...feature, dynamicContent: response.data };
      
      // Cache the result
      this.cache.set(cacheKey, content);
      return content;
    } catch (error) {
      // Return static content if API fails
      return feature;
    }
  }

  // Get system statistics
  async getSystemStats() {
    try {
      const response = await axios.get('/api/stats/system');
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return {
        totalMedications: 12847,
        approvedDrugs: 11203,
        pendingReview: 1644,
        healthcareProviders: 2156,
        lastUpdated: new Date().toISOString(),
        systemHealth: {
          database: 'online',
          apiServices: 'operational',
          lastBackup: '2h ago'
        }
      };
    }
  }

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await axios.get('/api/stats/recent-activities');
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return [
        {
          id: 1,
          type: 'approval',
          drugName: 'Paracetamol 500mg',
          status: 'approved',
          date: '2024-12-15',
          provider: 'Al Zahra Hospital'
        },
        {
          id: 2,
          type: 'review',
          drugName: 'Amoxicillin 250mg',
          status: 'pending',
          date: '2024-12-14',
          provider: 'Dubai Hospital'
        },
        {
          id: 3,
          type: 'approval',
          drugName: 'Ibuprofen 400mg',
          status: 'approved',
          date: '2024-12-13',
          provider: 'Sheikh Khalifa Hospital'
        }
      ];
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export default new FeatureService();