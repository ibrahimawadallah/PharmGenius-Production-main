import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Pill,
  Database,
  FileText,
  Clock,
  Users,
  Globe,
  Smartphone,
  Zap,
  Heart,
  Activity
} from 'lucide-react';

const DrugInformationSafetyCheck = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <Search className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Drug Information & Safety Check
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive medication database with real-time safety checks, drug interaction screening, 
            and evidence-based information to ensure your medication safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
              <Search className="w-5 h-5 mr-2" />
              Check Your Medications
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
                Your Safety is Our Priority: Comprehensive Medication Information
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Drug Information & Safety Check service provides instant access to a comprehensive 
                database of medications, including detailed information about dosages, side effects, 
                interactions, and safety guidelines. We help you make informed decisions about your 
                medications and prevent potential adverse events.
              </p>
              <p className="text-lg text-gray-600">
                With real-time interaction checking and up-to-date safety information, our platform 
                serves as your trusted resource for medication safety. Whether you're a patient, 
                caregiver, or healthcare professional, you'll find the information you need to ensure 
                safe and effective medication use.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Comprehensive Database</h3>
                  <p className="text-gray-600">Access to thousands of medications with detailed information</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Real-Time Updates</h3>
                  <p className="text-gray-600">Latest safety information and regulatory updates</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  <p className="text-gray-600">Proactive identification of potential safety concerns</p>
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
              Comprehensive Drug Information Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive medication information and safety checking tools 
              designed to protect your health and ensure optimal medication outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Drug Information Database</CardTitle>
                <CardDescription>
                  Comprehensive information on medications including indications, dosages, 
                  side effects, contraindications, and administration guidelines.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Interaction Checking</CardTitle>
                <CardDescription>
                  Real-time screening for drug-drug, drug-food, and drug-disease interactions 
                  to prevent adverse events and ensure medication safety.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </CardDescription>
                <CardTitle>Safety Alerts</CardTitle>
                <CardDescription>
                  Instant notifications about medication recalls, safety warnings, and 
                  important updates to ensure you stay informed about your medications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Pill className="w-6 h-6 text-green-600" />
                </CardDescription>
                <CardTitle>Dosage Guidelines</CardTitle>
                <CardDescription>
                  Evidence-based dosing recommendations based on age, weight, kidney function, 
                  and other individual factors for optimal therapeutic outcomes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </CardDescription>
                <CardTitle>Patient Education</CardTitle>
                <CardDescription>
                  Easy-to-understand medication information, administration instructions, 
                  and safety tips to help patients use their medications correctly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                </CardDescription>
                <CardTitle>Mobile Access</CardTitle>
                <CardDescription>
                  Convenient mobile access to medication information, allowing you to check 
                  drug safety information anytime, anywhere.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Advanced Safety Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Drug Interaction Screening</h3>
                  <p className="text-gray-600">
                    Comprehensive screening for potential interactions between medications, 
                    including severity levels and recommendations for management or avoidance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Allergy Checking</h3>
                  <p className="text-gray-600">
                    Automatic screening for known allergies and cross-reactivity to prevent 
                    allergic reactions and ensure medication safety.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Disease-Specific Warnings</h3>
                  <p className="text-gray-600">
                    Condition-specific safety alerts for patients with kidney disease, liver 
                    disease, heart conditions, and other chronic health issues.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                  <p className="text-gray-600">
                    Instant updates on medication safety alerts, recalls, and new safety 
                    information to keep you informed of the latest developments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">UAE Formulary Integration</h3>
                  <p className="text-gray-600">
                    Local medication information including UAE-specific availability, 
                    pricing, and regulatory requirements for medications.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">
                    All information is reviewed by licensed pharmacists and updated regularly 
                    to ensure accuracy and reliability of safety data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Benefits of Our Drug Information Service
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Enhanced Medication Safety
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Proactive identification of potential drug interactions, contraindications, and 
                safety concerns helps prevent adverse events and ensures safer medication use. 
                Our comprehensive screening catches issues that might otherwise go unnoticed.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Informed Decision Making
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Access to comprehensive, evidence-based medication information empowers patients 
                and healthcare providers to make informed decisions about treatment options, 
                dosages, and medication management strategies.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                Reduced Adverse Events
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Early identification of potential safety issues helps prevent medication-related 
                problems, reducing the risk of hospitalizations, emergency room visits, and 
                long-term complications.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Improved Patient Outcomes
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Better medication safety leads to improved therapeutic outcomes, better 
                medication adherence, and enhanced quality of life for patients managing 
                chronic conditions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                Cost Savings
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Preventing medication-related problems and adverse events results in significant 
                cost savings by reducing the need for expensive medical interventions, 
                hospitalizations, and additional treatments.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            How Our Safety Check Works
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Input Medications</h3>
              <p className="text-gray-600">
                Enter your current medications, including dosages and frequency
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Screening</h3>
              <p className="text-gray-600">
                Our system automatically screens for interactions and safety concerns
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Report</h3>
              <p className="text-gray-600">
                Receive a comprehensive safety report with recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-gray-600">
                Review findings with your healthcare provider and implement recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Education Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Medication Safety Tips
              </CardTitle>
              <CardDescription className="text-teal-700">
                Essential guidelines to ensure safe medication use and prevent adverse events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-teal-800">
                  <strong>Keep a complete medication list:</strong> Maintain an up-to-date list of all 
                  medications, including prescription drugs, over-the-counter medications, and supplements.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-teal-800">
                  <strong>Check for interactions:</strong> Always verify potential interactions when 
                  starting new medications or combining different treatments.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-teal-800">
                  <strong>Read labels carefully:</strong> Pay attention to dosage instructions, 
                  timing requirements, and any special instructions for your medications.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-teal-800">
                  <strong>Report side effects:</strong> Contact your healthcare provider immediately 
                  if you experience unexpected side effects or adverse reactions.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-teal-800">
                  <strong>Regular safety checks:</strong> Periodically review your medication regimen 
                  for safety, especially when changes are made to your treatment plan.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ensure Your Medication Safety?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Take the first step toward safer medication use. Our comprehensive drug information 
            and safety checking tools are designed to protect your health and prevent medication-related problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3">
              <Search className="w-5 h-5 mr-2" />
              Check Your Medications Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3">
              Learn More About Safety Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DrugInformationSafetyCheck;
