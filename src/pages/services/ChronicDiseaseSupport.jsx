import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  Heart, 
  Activity, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  Monitor,
  FileText,
  Shield,
  TrendingUp,
  Clock,
  Award,
  Pill,
  AlertTriangle,
  Zap
} from 'lucide-react';

const ChronicDiseaseSupport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Chronic Disease Support
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive support and management programs for diabetes, hypertension, obesity, and other 
            chronic conditions, helping you live a healthier, more fulfilling life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Get Support
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Living Well with Chronic Conditions: Your Journey to Better Health
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chronic diseases require ongoing management, but they don't have to control your life. 
                Our comprehensive support programs are designed to help you understand your condition, 
                manage symptoms effectively, and maintain the highest possible quality of life.
              </p>
              <p className="text-lg text-gray-600">
                Through personalized care plans, continuous monitoring, and ongoing support, we help 
                you navigate the challenges of chronic disease management. Our multidisciplinary approach 
                combines medical expertise with lifestyle guidance, ensuring you have the tools and 
                knowledge needed to thrive despite your health challenges.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Active Management</h3>
                  <p className="text-gray-600">Proactive approach to symptom control and disease progression</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Continuous Improvement</h3>
                  <p className="text-gray-600">Ongoing optimization of treatment plans and lifestyle strategies</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Support</h3>
                  <p className="text-gray-600">Collaborative care involving multiple healthcare professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Specialized Support Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our chronic disease support programs are tailored to address the unique challenges 
              and needs of each condition, providing comprehensive care and management strategies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Diabetes Management</CardTitle>
                <CardDescription>
                  Comprehensive diabetes care including blood glucose monitoring, medication management, 
                  lifestyle coaching, and complication prevention strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </CardTitle>
                <CardTitle>Hypertension Control</CardTitle>
                <CardDescription>
                  Blood pressure management through medication optimization, lifestyle modifications, 
                  and regular monitoring to prevent cardiovascular complications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </CardTitle>
                <CardTitle>Weight Management</CardTitle>
                <CardDescription>
                  Personalized weight loss and maintenance programs combining nutrition guidance, 
                  physical activity planning, and behavioral support strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </CardTitle>
                <CardTitle>Cardiovascular Health</CardTitle>
                <CardDescription>
                  Heart disease prevention and management through risk factor control, medication 
                  therapy, and lifestyle interventions to improve cardiovascular outcomes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </CardTitle>
                <CardTitle>Respiratory Conditions</CardTitle>
                <CardDescription>
                  Asthma and COPD management including medication optimization, breathing techniques, 
                  and environmental trigger avoidance strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-teal-600" />
                </CardTitle>
                <CardTitle>Chronic Pain Management</CardTitle>
                <CardDescription>
                  Multimodal pain management approaches combining medication, physical therapy, 
                  and alternative therapies for improved quality of life.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Comprehensive Support Services
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Medication Management</h3>
                  <p className="text-gray-600">
                    Comprehensive medication reviews, dosage optimization, and side effect management 
                    to ensure optimal therapeutic outcomes while minimizing adverse effects.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Regular Monitoring</h3>
                  <p className="text-gray-600">
                    Continuous tracking of key health indicators, regular check-ins, and proactive 
                    intervention when needed to prevent complications and maintain stability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifestyle Coaching</h3>
                  <p className="text-gray-600">
                    Personalized guidance on nutrition, physical activity, stress management, and 
                    other lifestyle factors that significantly impact chronic disease outcomes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Groups</h3>
                  <p className="text-gray-600">
                    Peer support networks and group sessions where patients can share experiences, 
                    learn from others, and build a supportive community around their health journey.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Crisis Prevention</h3>
                  <p className="text-gray-600">
                    Early warning systems, emergency protocols, and rapid response strategies to 
                    prevent acute complications and hospitalizations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Achievement</h3>
                  <p className="text-gray-600">
                    Setting and tracking realistic health goals, celebrating milestones, and 
                    maintaining motivation through continuous progress monitoring and support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Benefits of Chronic Disease Support
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Improved Disease Control
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Better management of symptoms, reduced disease progression, and improved control 
                of key health indicators through personalized care plans and continuous monitoring.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Enhanced Quality of Life
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Reduced symptom burden, improved physical function, and better emotional well-being 
                through comprehensive support and effective management strategies.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Prevention of Complications
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Proactive monitoring and early intervention help prevent serious complications, 
                reducing the risk of hospitalizations and long-term disability.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Reduced Healthcare Costs
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Better disease management leads to fewer emergency visits, hospitalizations, 
                and expensive interventions, resulting in significant long-term cost savings.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Empowerment and Independence
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Patients gain confidence in managing their conditions, leading to greater 
                independence and active participation in their healthcare decisions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Care Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Our Care Process
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600">
                Comprehensive evaluation of your condition, current treatment, and health goals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Planning</h3>
              <p className="text-gray-600">
                Development of personalized care plan with specific goals and strategies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation</h3>
              <p className="text-gray-600">
                Active support and guidance as you implement your care plan
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitoring</h3>
              <p className="text-gray-600">
                Continuous assessment and adjustment to ensure optimal outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Education Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Living Well with Chronic Disease
              </CardTitle>
              <CardDescription className="text-red-700">
                Essential tips for managing your chronic condition and maintaining quality of life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">
                  <strong>Stay informed:</strong> Educate yourself about your condition, treatment options, 
                  and lifestyle factors that can improve your health outcomes.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">
                  <strong>Build a support network:</strong> Connect with family, friends, support groups, 
                  and healthcare providers who can help you on your health journey.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">
                  <strong>Monitor regularly:</strong> Keep track of your symptoms, medications, and 
                  health indicators to identify patterns and early warning signs.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">
                  <strong>Maintain healthy habits:</strong> Focus on nutrition, physical activity, 
                  stress management, and adequate sleep to support your overall health.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800">
                  <strong>Communicate openly:</strong> Share your concerns, questions, and experiences 
                  with your healthcare team to ensure you receive the best possible care.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Chronic Disease?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Don't let chronic disease define your life. Our comprehensive support programs are designed 
            to help you manage your condition effectively and live life to the fullest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3">
              Learn More About Our Programs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChronicDiseaseSupport;
