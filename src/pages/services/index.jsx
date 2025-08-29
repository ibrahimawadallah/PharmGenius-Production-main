import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Stethoscope, 
  ClipboardList, 
  BookOpen, 
  Heart, 
  Search, 
  GraduationCap,
  ArrowRight,
  Users,
  Shield,
  Award,
  Clock,
  Globe
} from 'lucide-react';

const ServicesIndex = () => {
  const services = [
    {
      id: 'online-pharmacy-consultation',
      title: 'Online Pharmacy Consultation',
      description: 'Connect with licensed UAE pharmacists for personalized medication advice, prescription reviews, and comprehensive pharmaceutical care from the comfort of your home.',
      icon: Stethoscope,
      color: 'blue',
      features: [
        'Video consultations with licensed pharmacists',
        'Medication reviews and optimization',
        '24/7 availability',
        'Secure and private platform'
      ],
      cta: 'Book Consultation',
      path: '/services/online-pharmacy-consultation'
    },
    {
      id: 'medication-therapy-management',
      title: 'Medication Therapy Management (MTM)',
      description: 'Comprehensive medication optimization services designed to improve therapeutic outcomes, reduce adverse events, and enhance your overall health through evidence-based pharmaceutical care.',
      icon: ClipboardList,
      color: 'green',
      features: [
        'Comprehensive medication reviews',
        'Drug interaction analysis',
        'Personalized action plans',
        'Ongoing monitoring and support'
      ],
      cta: 'Schedule MTM Session',
      path: '/services/medication-therapy-management'
    },
    {
      id: 'patient-education-awareness',
      title: 'Patient Education & Awareness',
      description: 'Empowering patients with knowledge through comprehensive health education, interactive learning resources, and evidence-based information to improve health outcomes.',
      icon: BookOpen,
      color: 'purple',
      features: [
        'Interactive video modules',
        'Multilingual support',
        'Condition-specific programs',
        'Mobile learning apps'
      ],
      cta: 'Start Learning',
      path: '/services/patient-education-awareness'
    },
    {
      id: 'chronic-disease-support',
      title: 'Chronic Disease Support',
      description: 'Comprehensive support and management programs for diabetes, hypertension, obesity, and other chronic conditions, helping you live a healthier, more fulfilling life.',
      icon: Heart,
      color: 'red',
      features: [
        'Specialized condition management',
        'Lifestyle coaching',
        'Support groups',
        'Crisis prevention strategies'
      ],
      cta: 'Get Support',
      path: '/services/chronic-disease-support'
    },
    {
      id: 'drug-information-safety-check',
      title: 'Drug Information & Safety Check',
      description: 'Comprehensive medication database with real-time safety checks, drug interaction screening, and evidence-based information to ensure your medication safety.',
      icon: Search,
      color: 'teal',
      features: [
        'Real-time interaction checking',
        'Comprehensive medication database',
        'Safety alerts and updates',
        'UAE formulary integration'
      ],
      cta: 'Check Your Medications',
      path: '/services/drug-information-safety-check'
    },
    {
      id: 'professional-training-pharmacists',
      title: 'Professional Training for Pharmacists',
      description: 'Advanced continuing education programs designed to enhance pharmaceutical expertise, improve patient care, and advance your professional development in the UAE healthcare sector.',
      icon: GraduationCap,
      color: 'indigo',
      features: [
        'Accredited programs',
        'Flexible learning formats',
        'Expert instructors',
        'Career advancement focus'
      ],
      cta: 'Enroll Now',
      path: '/services/professional-training-pharmacists'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      red: 'bg-red-100 text-red-600 hover:bg-red-200',
      teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
      indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  const getButtonColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      red: 'bg-red-600 hover:bg-red-700',
      teal: 'bg-teal-600 hover:bg-teal-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700'
    };
    return colorMap[color] || 'bg-gray-600 hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Users className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Healthcare Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Discover our comprehensive range of healthcare and pharmaceutical services designed to improve 
            patient outcomes, enhance professional development, and advance healthcare delivery in the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Shield className="w-5 h-5 mr-2" />
              Learn More
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our services are designed to meet the diverse needs of patients, healthcare professionals, 
              and organizations, providing innovative solutions for modern healthcare challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(service.color)}`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={service.path}>
                    <Button className={`w-full ${getButtonColor(service.color)} text-white`}>
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Why Choose Our Services?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Licensed healthcare professionals with extensive experience in UAE healthcare
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Evidence-based practices and continuous quality improvement
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Deep understanding of UAE healthcare regulations and cultural needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Available</h3>
              <p className="text-gray-600">
                24/7 access to healthcare services and support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose the service that best meets your needs and take the first step toward 
            improved health outcomes and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <Shield className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              Contact Our Team
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesIndex;
