import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  BookOpen, 
  Lightbulb, 
  Users, 
  CheckCircle, 
  ArrowRight,
  GraduationCap,
  Video,
  FileText,
  Heart,
  Shield,
  Globe,
  Smartphone,
  Calendar,
  Award,
  Pill
} from 'lucide-react';

const PatientEducationAwareness = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Patient Education & Awareness
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering patients with knowledge through comprehensive health education, 
            interactive learning resources, and evidence-based information to improve health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              <GraduationCap className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Explore Resources
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
                Knowledge is Power: Your Health Education Journey Starts Here
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Patient Education & Awareness program is designed to bridge the knowledge gap between 
                healthcare providers and patients. We believe that informed patients make better health decisions, 
                leading to improved outcomes, better medication adherence, and enhanced quality of life.
              </p>
              <p className="text-lg text-gray-600">
                Through our comprehensive educational resources, interactive learning modules, and multilingual 
                content, we ensure that every patient, regardless of their background or health literacy level, 
                has access to reliable, easy-to-understand health information that empowers them to take an 
                active role in their healthcare journey.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evidence-Based Content</h3>
                  <p className="text-gray-600">All educational materials are based on current clinical guidelines and research</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Multilingual Support</h3>
                  <p className="text-gray-600">Available in Arabic, English, and other languages to serve our diverse community</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Patient-Centered</h3>
                  <p className="text-gray-600">Content designed specifically for patients and their families</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Educational Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our patient education platform offers a wide range of learning tools and resources 
              designed to meet the diverse needs of our patient community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Interactive Video Modules</CardTitle>
                <CardDescription>
                  Engaging video content covering medication safety, disease management, 
                  and healthy lifestyle practices with interactive quizzes and assessments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Educational Brochures</CardTitle>
                <CardDescription>
                  Comprehensive, easy-to-read materials on common health conditions, 
                  medications, and preventive care strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Mobile Learning Apps</CardTitle>
                <CardDescription>
                  User-friendly mobile applications providing on-the-go access to health 
                  information, medication reminders, and educational content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Group Education Sessions</CardTitle>
                <CardDescription>
                  Interactive group sessions led by healthcare professionals covering 
                  topics like diabetes management, heart health, and medication safety.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Condition-Specific Programs</CardTitle>
                <CardDescription>
                  Specialized educational programs for chronic conditions including diabetes, 
                  hypertension, asthma, and cardiovascular disease management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Certification Programs</CardTitle>
                <CardDescription>
                  Structured learning pathways with certificates upon completion, 
                  helping patients track their health education progress and achievements.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Topics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Key Educational Topics
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pill className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Medication Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Proper medication use, storage, side effects, and interaction awareness
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Disease Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Understanding and managing chronic conditions effectively
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Preventive Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Vaccination, screening, and lifestyle prevention strategies
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Family Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Pediatric care, geriatric considerations, and family wellness
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Benefits of Patient Education
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Improved Health Outcomes
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Educated patients are more likely to follow treatment plans, recognize early warning signs, 
                and make informed decisions about their health. This leads to better disease control, 
                fewer complications, and improved overall health status.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Better Medication Adherence
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Understanding why medications are prescribed and how they work increases patient motivation 
                to take them as directed. This results in better therapeutic outcomes and reduced 
                medication-related problems.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Enhanced Patient-Provider Communication
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Educated patients can communicate more effectively with their healthcare providers, 
                ask relevant questions, and participate actively in treatment decisions. This leads 
                to more personalized and effective care.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Reduced Healthcare Costs
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Patient education helps prevent complications, reduce hospital readmissions, and minimize 
                unnecessary medical interventions. The long-term cost savings often significantly exceed 
                the investment in education programs.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Empowerment and Confidence
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Knowledge gives patients confidence in managing their health conditions and making 
                informed decisions. This empowerment leads to better self-management and improved 
                quality of life.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Your Learning Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600">
                Evaluate your current health knowledge and identify learning priorities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning</h3>
              <p className="text-gray-600">
                Access personalized educational content through various learning modalities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-gray-600">
                Apply learned knowledge to daily health practices and decision-making
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluation</h3>
              <p className="text-gray-600">
                Assess progress and continue learning with advanced topics and refreshers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Education Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Tips for Effective Learning
              </CardTitle>
              <CardDescription className="text-purple-700">
                How to make the most of your patient education experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800">
                  <strong>Set learning goals:</strong> Identify specific health topics you want to understand 
                  better and set realistic learning objectives for yourself.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800">
                  <strong>Take notes:</strong> Write down key points, questions, and action items to help 
                  reinforce your learning and guide future discussions with healthcare providers.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800">
                  <strong>Practice regularly:</strong> Apply what you learn in your daily routine and 
                  practice new health behaviors consistently to build lasting habits.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800">
                  <strong>Ask questions:</strong> Don't hesitate to seek clarification on topics you find 
                  confusing or want to explore further with healthcare professionals.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800">
                  <strong>Share knowledge:</strong> Discuss what you've learned with family members and 
                  friends to reinforce your understanding and help others improve their health literacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health Education?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start your journey toward better health literacy today. Our comprehensive educational resources 
            are designed to empower you with the knowledge and confidence to make informed health decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
              <GraduationCap className="w-5 h-5 mr-2" />
              Begin Your Learning Journey
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
              Explore Our Resources
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientEducationAwareness;
