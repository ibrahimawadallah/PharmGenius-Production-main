import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  ClipboardList, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Pill,
  Calendar,
  BarChart3,
  FileText,
  Heart,
  AlertTriangle,
  Shield,
  Clock
} from 'lucide-react';

const MedicationTherapyManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <ClipboardList className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Medication Therapy Management
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive medication optimization services designed to improve therapeutic outcomes, 
            reduce adverse events, and enhance your overall health through evidence-based pharmaceutical care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule MTM Session
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
                Optimize Your Medication Regimen for Better Health Outcomes
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Medication Therapy Management (MTM) is a comprehensive service that goes beyond simple 
                medication dispensing. Our licensed pharmacists work collaboratively with you and your 
                healthcare team to ensure your medications are working optimally, safely, and cost-effectively.
              </p>
              <p className="text-lg text-gray-600">
                Through systematic medication reviews, we identify potential drug interactions, optimize 
                dosages, address side effects, and ensure your treatment plan aligns with current clinical 
                guidelines. This proactive approach helps prevent medication-related problems and improves 
                your overall quality of life.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Goal-Oriented Care</h3>
                  <p className="text-gray-600">Personalized treatment plans aligned with your health objectives</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Continuous Monitoring</h3>
                  <p className="text-gray-600">Ongoing assessment and adjustment of your medication therapy</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  <p className="text-gray-600">Comprehensive safety monitoring and risk assessment</p>
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
              Comprehensive MTM Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Medication Therapy Management program covers every aspect of medication optimization, 
              ensuring you receive the most effective and safest treatment possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Comprehensive Medication Review</CardTitle>
                <CardDescription>
                  Thorough analysis of all medications, including prescription drugs, over-the-counter 
                  medications, and herbal supplements to identify potential interactions and optimization opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Treatment Optimization</CardTitle>
                <CardDescription>
                  Evidence-based recommendations for dosage adjustments, medication timing, and 
                  therapeutic alternatives to maximize effectiveness while minimizing side effects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Drug Interaction Analysis</CardTitle>
                <CardDescription>
                  Comprehensive screening for potential drug-drug, drug-food, and drug-disease 
                  interactions to prevent adverse events and ensure medication safety.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Chronic Disease Management</CardTitle>
                <CardDescription>
                  Specialized support for managing complex medication regimens in diabetes, 
                  hypertension, cardiovascular disease, and other chronic conditions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Medication Action Plans</CardTitle>
                <CardDescription>
                  Personalized action plans with clear instructions, monitoring parameters, 
                  and follow-up schedules to ensure optimal medication adherence and outcomes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Care Coordination</CardTitle>
                <CardDescription>
                  Collaboration with your healthcare team to ensure seamless communication 
                  and coordinated care across all providers and settings.
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
            Benefits of Medication Therapy Management
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Improved Health Outcomes
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                MTM services lead to better disease control, reduced symptoms, and improved quality of life. 
                By optimizing your medication regimen, we help you achieve your health goals more effectively 
                and efficiently.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Enhanced Medication Safety
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our comprehensive screening identifies potential drug interactions, contraindications, and 
                adverse effects before they become problems. This proactive approach significantly reduces 
                medication-related hospitalizations and emergency room visits.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Cost Savings
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                MTM services help identify cost-effective alternatives, prevent unnecessary medications, 
                and reduce the need for expensive medical interventions. The long-term savings often 
                significantly exceed the cost of the service.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Better Medication Adherence
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Through education, simplified regimens, and ongoing support, we help improve your 
                medication adherence. Better adherence leads to better outcomes and reduced healthcare costs.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Personalized Care
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Every MTM session is tailored to your specific needs, health goals, and lifestyle. 
                We consider your unique circumstances to create the most effective and practical 
                medication management plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* MTM Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Our MTM Process
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Assessment</h3>
              <p className="text-gray-600">
                Comprehensive review of your medical history, current medications, and health goals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Medication Analysis</h3>
              <p className="text-gray-600">
                Detailed review of your medication regimen for safety, effectiveness, and optimization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Plan</h3>
              <p className="text-gray-600">
                Development of personalized recommendations and implementation strategies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow-up</h3>
              <p className="text-gray-600">
                Ongoing monitoring, support, and adjustment of your medication therapy plan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Education Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Patient Education Tips for MTM
              </CardTitle>
              <CardDescription className="text-green-700">
                How to prepare for and make the most of your Medication Therapy Management session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Bring all medications:</strong> Include prescription drugs, over-the-counter 
                  medications, vitamins, herbal supplements, and any discontinued medications from the past year.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>List your health goals:</strong> Be prepared to discuss what you want to achieve 
                  with your medications and any concerns you have about your current treatment.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Document side effects:</strong> Note any side effects you're experiencing, 
                  when they occur, and how they affect your daily life.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Ask questions:</strong> Don't hesitate to ask about any aspect of your 
                  medications, including costs, alternatives, and long-term implications.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Follow the plan:</strong> Implement the recommendations from your MTM session 
                  and schedule follow-up appointments to monitor your progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Medication Therapy?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Take control of your health with our comprehensive Medication Therapy Management services. 
            Our expert pharmacists are ready to help you achieve better outcomes through optimized medication care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your MTM Session
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
              Learn More About MTM
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicationTherapyManagement;
