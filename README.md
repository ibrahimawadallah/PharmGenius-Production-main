# PharmGenius - Comprehensive Healthcare Application

PharmGenius is a modern, full-stack healthcare application designed to revolutionize healthcare delivery in the UAE and beyond. The platform provides comprehensive drug information, expert consultations, learning modules, and mental health support.

## 🚀 Features

### Core Healthcare Services
- **Drug Information Hub**: Comprehensive medication database with real-time interaction checking
- **Expert Consultations**: Connect with licensed healthcare professionals
- **Learning & Development**: Continuing education modules for healthcare professionals
- **Mental Health Support**: Resources and professional counseling services

### Advanced Technology Features
- **AI-Powered Search**: Intelligent search algorithms for medical terminology
- **Enterprise Security**: HIPAA-compliant security with end-to-end encryption
- **Mobile-First Design**: Responsive design optimized for all devices
- **Multi-Language Support**: Arabic and English with UAE healthcare standards

### User Management
- **Role-Based Access Control**: Admin, Provider, and Basic user roles
- **Organization Management**: Multi-tenant architecture for healthcare organizations
- **Subscription Plans**: Flexible pricing tiers (Basic, Professional, Enterprise)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Chakra UI** - Accessible and customizable component library
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and state management
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **SendGrid** - Email service integration

### Infrastructure
- **Cloud Deployment** - Scalable cloud infrastructure
- **Environment Configuration** - Comprehensive .env setup
- **Database Indexing** - Optimized queries and performance
- **Security Middleware** - Authentication and authorization layers

## 📁 Project Structure

```
pharmgenius/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Main navigation header
│   │   ├── Footer.jsx      # Site footer
│   │   └── Layout.jsx      # Main layout wrapper
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication state management
│   ├── pages/              # Application pages
│   │   ├── Hero.jsx        # Landing page
│   │   ├── Features.jsx    # Features overview
│   │   ├── Services.jsx    # Services listing
│   │   ├── About.jsx       # Company information
│   │   ├── Pricing.jsx     # Pricing plans
│   │   ├── Contact.jsx     # Contact form
│   │   ├── Support.jsx     # Support and help
│   │   ├── Blog.jsx        # Blog articles
│   │   ├── FAQ.jsx         # Frequently asked questions
│   │   ├── Investors.jsx   # Investor information
│   │   ├── Login.jsx       # User authentication
│   │   ├── Register.jsx    # User registration
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── Profile.jsx     # User profile management
│   │   ├── DrugSearch.jsx  # Drug information search
│   │   └── NotFound.jsx    # 404 error page
│   └── App.jsx             # Main application component
├── server/
│   ├── models/             # Database models
│   │   ├── User.js         # User management
│   │   ├── Organization.js # Organization management
│   │   ├── Consultation.js # Consultation management
│   │   ├── Course.js       # Learning course management
│   │   ├── Payment.js      # Payment and subscription
│   │   └── Post.js         # Blog post management
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # Authentication and authorization
│   ├── routes/             # API routes
│   │   └── auth.js         # Authentication endpoints
│   ├── services/           # Business logic services
│   │   └── emailService.js # Email service integration
│   └── server.js           # Main server file
├── scripts/
│   └── seed.js             # Database seeding script
├── .env.example            # Environment variables template
└── package.json            # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/pharmgenius.git
   cd pharmgenius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server    # Backend server
   npm run client    # Frontend development server
   ```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/pharmgenius
COSMOS_DB_URI=your_cosmos_db_uri

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
SESSION_SECRET=your_session_secret
BCRYPT_ROUNDS=10

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@pharmgenius.com

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# External APIs
NHS_API_KEY=your_nhs_api_key
OPENFDA_API_KEY=your_openfda_api_key
SNOMED_API_KEY=your_snomed_api_key
```

## 📊 Database Models

### User Model
- Authentication and profile management
- Role-based access control (admin, provider, basic)
- Subscription and feature management
- Organization association

### Organization Model
- Multi-tenant architecture
- Subscription and billing management
- Member management and permissions
- Feature access control

### Consultation Model
- Appointment scheduling and management
- Secure messaging and file sharing
- Diagnosis and prescription tracking
- Rating and review system

### Course Model
- Learning module management
- Progress tracking and assessments
- Certificate generation
- Content organization

### Payment Model
- Subscription management
- Payment processing and tracking
- Refund and cancellation handling
- Financial reporting

### Post Model
- Blog content management
- SEO optimization (slugs, meta tags)
- Engagement tracking (views, likes, comments)
- Content categorization

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Secure token-based authentication
- Automatic token refresh
- Role-based access control
- Resource ownership validation

### Middleware Functions
- `authenticateToken` - JWT verification
- `requireRole` - Role-based access control
- `requireOwnership` - Resource ownership validation
- `requireSubscription` - Plan-based feature access
- `rateLimit` - API rate limiting

## 📧 Email Service

Integrated SendGrid email service for:
- Welcome emails
- Password reset notifications
- Consultation confirmations
- Course enrollment confirmations
- Payment receipts
- Subscription renewal reminders

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Considerations
- Set `NODE_ENV=production`
- Configure production database connections
- Set up SSL certificates
- Configure production email services
- Set up monitoring and logging

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## 📈 Performance Optimization

- Database indexing for common queries
- React Query for efficient data fetching
- Lazy loading for route components
- Image optimization and CDN integration
- Caching strategies for static content

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting
- HIPAA compliance considerations

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `PUT /api/auth/change-password` - Password change
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Protected Routes
- All routes require valid JWT token
- Role-based access control
- Resource ownership validation
- Subscription plan validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@pharmgenius.com
- **Phone**: +971-50-123-4567
- **Documentation**: [docs.pharmgenius.com](https://docs.pharmgenius.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/pharmgenius/issues)

## 🏢 Company

PharmGenius is a healthcare technology company based in Dubai, UAE, focused on revolutionizing healthcare delivery through innovative digital solutions.

---

**Built with ❤️ for the healthcare community**