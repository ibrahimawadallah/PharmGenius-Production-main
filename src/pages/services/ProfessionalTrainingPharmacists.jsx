import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  GraduationCap, 
  Award, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  BookOpen,
  Video,
  FileText,
  Globe,
  Smartphone,
  Zap,
  Heart,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';

const ProfessionalTrainingPharmacists = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Training for Pharmacists
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced continuing education programs designed to enhance pharmaceutical expertise, 
            improve patient care, and advance your professional development in the UAE healthcare sector.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Enroll Now
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              View Courses
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
                Elevate Your Pharmaceutical Practice: Advanced Training for Modern Healthcare
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Professional Training for Pharmacists program offers comprehensive continuing 
                education designed to keep you at the forefront of pharmaceutical practice. Whether 
                you're a newly licensed pharmacist or an experienced professional, our courses provide 
                the knowledge and skills needed to excel in today's dynamic healthcare environment.
              </p>
              <p className="text-lg text-gray-600">
                Our training programs are developed by leading pharmaceutical experts and aligned with 
                UAE healthcare standards and international best practices. We focus on practical applications, 
                evidence-based approaches, and real-world scenarios to ensure you can immediately apply 
                what you learn to improve patient outcomes and advance your career.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Accredited Programs</h3>
                  <p className="text-gray-600">UAE-accredited continuing education units and certifications</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Career Advancement</h3>
                  <p className="text-gray-600">Skills and knowledge to advance your professional practice</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Expert Instructors</h3>
                  <p className="text-gray-600">Learn from leading pharmaceutical professionals and researchers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our training programs cover essential areas of pharmaceutical practice, from clinical 
              skills to business management, ensuring comprehensive professional development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Clinical Pharmacy Practice</CardTitle>
                <CardDescription>
                  Advanced clinical skills including medication therapy management, patient assessment, 
                  and evidence-based treatment recommendations for complex cases.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Specialized Therapeutics</CardTitle>
                <CardDescription>
                  In-depth training in oncology, cardiology, infectious diseases, and other 
                  specialized areas of pharmaceutical practice.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Patient Care & Communication</CardTitle>
                <CardDescription>
                  Enhanced patient counseling skills, cultural competency training, and effective 
                  communication strategies for diverse patient populations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Technology & Innovation</CardTitle>
                <CardDescription>
                  Digital health tools, pharmacy automation, telepharmacy, and emerging technologies 
                  transforming pharmaceutical practice.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Regulatory Compliance</CardTitle>
                <CardDescription>
                  UAE pharmaceutical regulations, international standards, quality assurance, 
                  and compliance best practices for pharmacy operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Business & Leadership</CardTitle>
                <CardDescription>
                  Pharmacy management, financial planning, team leadership, and strategic 
                  thinking for pharmacy business success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Formats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Flexible Learning Formats
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Learning</h3>
                  <p className="text-gray-600">
                    Self-paced online courses with interactive modules, video lectures, and 
                    assessments accessible from anywhere, anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Webinars</h3>
                  <p className="text-gray-600">
                    Interactive live sessions with expert instructors, real-time Q&A, and 
                    networking opportunities with fellow professionals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Workshops & Seminars</h3>
                  <p className="text-gray-600">
                    Hands-on workshops, case study discussions, and practical training sessions 
                    for skill development and real-world application.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Learning</h3>
                  <p className="text-gray-600">
                    Mobile-optimized content and apps for learning on-the-go, with offline 
                    access and progress synchronization across devices.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Blended Learning</h3>
                  <p className="text-gray-600">
                    Combination of online and in-person learning experiences for optimal 
                    knowledge retention and practical skill development.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Certification Programs</h3>
                  <p className="text-gray-600">
                    Structured certification pathways with comprehensive assessments and 
                    recognized credentials for professional advancement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Benefits of Professional Training
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Enhanced Clinical Skills
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Advanced training improves your ability to provide evidence-based pharmaceutical care, 
                manage complex cases, and contribute to better patient outcomes. Enhanced clinical 
                skills lead to increased confidence and professional recognition.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Career Advancement
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Professional development opens doors to new opportunities, leadership roles, and 
                specialized positions. Continuous learning demonstrates commitment to excellence 
                and positions you for career growth and advancement.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Improved Patient Care
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Enhanced knowledge and skills directly translate to better patient care, improved 
                medication safety, and more effective patient counseling. Better care leads to 
                improved patient satisfaction and outcomes.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Professional Recognition
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Advanced training and certifications enhance your professional credibility and 
                recognition within the healthcare community. This can lead to increased trust 
                from patients and colleagues.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Networking Opportunities
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Training programs provide opportunities to connect with fellow professionals, 
                experts in the field, and potential mentors. These connections can lead to 
                collaborative opportunities and professional growth.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Training Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Your Training Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600">
                Evaluate your current skills and identify areas for professional development
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning</h3>
              <p className="text-gray-600">
                Engage with comprehensive training content through your preferred learning format
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-gray-600">
                Apply new knowledge and skills in your daily practice and patient care
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification</h3>
              <p className="text-gray-600">
                Earn recognized credentials and continue your professional development journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Development Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="text-indigo-900 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2" />
                Professional Development Tips
              </CardTitle>
              <CardDescription className="text-indigo-700">
                Strategies to maximize your learning experience and advance your pharmaceutical career
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-indigo-800">
                  <strong>Set clear goals:</strong> Identify specific skills and knowledge areas you want 
                  to develop, and create a structured learning plan to achieve your objectives.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-indigo-800">
                  <strong>Practice regularly:</strong> Apply new knowledge in your daily practice to 
                  reinforce learning and develop practical skills through real-world application.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-indigo-800">
                  <strong>Network actively:</strong> Engage with fellow learners, instructors, and 
                  professionals to build relationships and expand your professional network.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-indigo-800">
                  <strong>Stay current:</strong> Commit to lifelong learning and stay updated with 
                  the latest developments in pharmaceutical practice and healthcare.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-indigo-800">
                  <strong>Seek feedback:</strong> Actively seek feedback from mentors, colleagues, 
                  and patients to identify areas for improvement and growth.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Advance Your Pharmaceutical Career?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Take the next step in your professional development. Our comprehensive training programs 
            are designed to enhance your skills, expand your knowledge, and advance your career in 
            pharmaceutical practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Enroll in Training Programs
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3">
              Explore Course Catalog
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalTrainingPharmacists;
