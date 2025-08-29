import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  Stethoscope, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Pill,
  Video,
  MessageCircle,
  FileText,
  Heart,
  AlertTriangle
} from 'lucide-react';

const OnlinePharmacyConsultation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Stethoscope className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Online Pharmacy Consultation
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed UAE pharmacists for personalized medication advice, 
            prescription reviews, and comprehensive pharmaceutical care from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Video className="w-5 h-5 mr-2" />
              Book Consultation
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
                Professional Pharmaceutical Care at Your Fingertips
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our online pharmacy consultation service brings expert pharmaceutical expertise directly to you. 
                Whether you need medication reviews, dosage adjustments, or guidance on managing multiple prescriptions, 
                our licensed UAE pharmacists are here to provide comprehensive, evidence-based care.
              </p>
              <p className="text-lg text-gray-600">
                We understand that managing medications can be complex, especially for patients with chronic conditions 
                or those taking multiple drugs. Our consultations ensure you receive personalized attention, clear explanations, 
                and practical strategies for optimal medication management and improved health outcomes.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">UAE Licensed</h3>
                  <p className="text-gray-600">All our pharmacists are fully licensed and registered in the UAE</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">24/7 Availability</h3>
                  <p className="text-gray-600">Access professional consultation whenever you need it</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure & Private</h3>
                  <p className="text-gray-600">HIPAA-compliant platform ensuring your privacy and security</p>
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
              Comprehensive Consultation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our online pharmacy consultations cover all aspects of pharmaceutical care, 
              ensuring you receive the most comprehensive and personalized service available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Medication Review</CardTitle>
                <CardDescription>
                  Comprehensive analysis of your current medications, including potential interactions, 
                  side effects, and optimization opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Dosage Guidance</CardTitle>
                <CardDescription>
                  Expert advice on proper medication timing, administration techniques, 
                  and dosage adjustments based on your specific needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>
                  Help with prescription renewals, medication scheduling, and coordination 
                  with your healthcare providers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Chronic Disease Support</CardTitle>
                <CardDescription>
                  Specialized guidance for managing medications related to diabetes, 
                  hypertension, heart disease, and other chronic conditions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Side Effect Management</CardTitle>
                <CardDescription>
                  Strategies for managing medication side effects, including lifestyle 
                  modifications and alternative approaches when appropriate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Family Consultation</CardTitle>
                <CardDescription>
                  Family-focused medication management, including pediatric dosing, 
                  geriatric considerations, and family health coordination.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Why Choose Our Online Pharmacy Consultation?
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Convenience & Accessibility
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Access professional pharmaceutical care from anywhere, anytime. No need to travel to a pharmacy 
                or wait in long queues. Our platform is available 24/7, making it easy to get expert advice 
                when you need it most.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Expert UAE-Licensed Pharmacists
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                All our pharmacists are fully licensed and registered in the UAE, with extensive experience 
                in both local and international pharmaceutical practices. They stay updated with the latest 
                medical guidelines and UAE-specific regulations.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Comprehensive Medication Analysis
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our pharmacists conduct thorough reviews of your medication regimen, identifying potential 
                drug interactions, contraindications, and opportunities for optimization. We consider your 
                complete health profile for personalized recommendations.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Cost-Effective Care
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Online consultations are typically more affordable than in-person visits, while providing 
                the same level of expertise. We also help identify cost-saving alternatives and generic 
                options when appropriate.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Ongoing Support & Follow-up
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our relationship doesn't end after one consultation. We provide ongoing support, follow-up 
                consultations, and continuous monitoring of your medication therapy to ensure optimal outcomes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Patient Education Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Patient Education Tips
              </CardTitle>
              <CardDescription className="text-blue-700">
                Essential information to help you make the most of your online pharmacy consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  <strong>Prepare your medication list:</strong> Have a complete list of all your current 
                  medications, including dosages, frequency, and any over-the-counter supplements.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  <strong>Note any side effects:</strong> Document any side effects you're experiencing 
                  and when they occur to help your pharmacist provide better guidance.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  <strong>Ask questions:</strong> Don't hesitate to ask about anything unclear regarding 
                  your medications, including proper storage, timing, and what to do if you miss a dose.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  <strong>Follow up:</strong> Schedule follow-up consultations to monitor your progress 
                  and make any necessary adjustments to your medication therapy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Professional Online Pharmacy Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust our licensed pharmacists for their medication management needs. 
            Book your consultation today and take the first step toward better medication safety and health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <Video className="w-5 h-5 mr-2" />
              Book Your Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              Learn More About Our Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OnlinePharmacyConsultation;
