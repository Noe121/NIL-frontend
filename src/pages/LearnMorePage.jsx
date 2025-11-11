import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function LearnMorePage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  const sections = [
    {
      id: 'intro',
      title: 'Welcome to NILBx',
      duration: '30s',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to NILBx</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The first comprehensive platform connecting student-athletes with legitimate sponsorship opportunities while ensuring full NCAA/NAIA compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Athletes</h3>
                <p className="text-gray-600">Monetize your talent safely and compliantly</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">For Brands</h3>
                <p className="text-gray-600">Connect with authentic student-athletes</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Compliance First</h3>
                <p className="text-gray-600">Every deal vetted for regulatory compliance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'How NIL Deals Work',
      duration: '45s',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">How NIL Deals Work</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Student-Athletes</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Create Your Profile</h4>
                    <p className="text-gray-600">Showcase your achievements, stats, and social media presence</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Get Matched with Brands</h4>
                    <p className="text-gray-600">Our algorithm connects you with relevant sponsorship opportunities</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Negotiate & Sign</h4>
                    <p className="text-gray-600">Use our templates and tools to finalize compliant agreements</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Earn & Track</h4>
                    <p className="text-gray-600">Receive payments and monitor your sponsorship portfolio</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Brands</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Browse Athletes</h4>
                    <p className="text-gray-600">Search by sport, location, following, and performance metrics</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Initiate Contact</h4>
                    <p className="text-gray-600">Send partnership proposals with our deal templates</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Compliance Review</h4>
                    <p className="text-gray-600">All deals are reviewed for NCAA/NAIA compliance</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Launch Campaigns</h4>
                    <p className="text-gray-600">Execute successful marketing campaigns with student-athletes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      title: 'Compliance & Safety',
      duration: '30s',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Compliance & Safety First</h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-green-900">100% NCAA/NAIA Compliant</h3>
            </div>
            <p className="text-green-800">
              Every deal on our platform is reviewed by compliance experts to ensure it meets all regulatory requirements.
              We work with universities and governing bodies to maintain the integrity of college athletics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 text-blue-600 mr-2" />
                  Regulatory Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• NCAA Division I, II, III rules</li>
                  <li>• NAIA regulations</li>
                  <li>• State NIL laws</li>
                  <li>• Federal tax requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 text-purple-600 mr-2" />
                  Expert Oversight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Compliance officers review all deals</li>
                  <li>• Legal team validates contracts</li>
                  <li>• University liaisons for coordination</li>
                  <li>• 24/7 compliance support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'success-stories',
      title: 'Success Stories',
      duration: '25s',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Real Success Stories</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">$250K+</div>
                <h3 className="text-xl font-bold mb-2">Basketball Player</h3>
                <p className="text-gray-600 mb-4">University of Alabama • 3 sponsorship deals</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">$180K+</div>
                <h3 className="text-xl font-bold mb-2">Soccer Player</h3>
                <p className="text-gray-600 mb-4">Stanford University • 5 brand partnerships</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">$320K+</div>
                <h3 className="text-xl font-bold mb-2">Football Player</h3>
                <p className="text-gray-600 mb-4">Ohio State University • 7 sponsorships</p>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Average Earnings by Sport</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$85K</div>
                <div className="text-sm text-gray-600">Football</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$65K</div>
                <div className="text-sm text-gray-600">Basketball</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$45K</div>
                <div className="text-sm text-gray-600">Soccer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$35K</div>
                <div className="text-sm text-gray-600">Other Sports</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'get-started',
      title: 'Get Started Today',
      duration: '20s',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Ready to Get Started?</h2>

          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Join thousands of student-athletes who are already building their personal brands and securing sponsorship deals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                onClick={() => navigate('/premium-deals')}
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4"
              >
                <Star className="w-5 h-5 mr-2" />
                Unlock Premium Deals
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">What Happens Next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold mb-2">Sign Up</h4>
                <p className="text-gray-600 text-sm">Create your profile in under 5 minutes</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold mb-2">Get Matched</h4>
                <p className="text-gray-600 text-sm">Receive personalized brand opportunities</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold mb-2">Start Earning</h4>
                <p className="text-gray-600 text-sm">Secure deals and build your portfolio</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && currentSection < sections.length) {
      const duration = parseInt(sections[currentSection].duration) * 1000; // Convert to milliseconds
      const step = 100 / (duration / 100); // Progress per 100ms

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentSection(curr => {
              if (curr >= sections.length - 1) {
                setIsPlaying(false);
                return curr;
              }
              return curr + 1;
            });
            return 0;
          }
          return prev + step;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSection, sections.length]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setProgress(0);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setProgress(0);
    }
  };

  const totalDuration = sections.reduce((acc, section) => acc + parseInt(section.duration), 0);
  const currentTime = sections.slice(0, currentSection).reduce((acc, section) => acc + parseInt(section.duration), 0) + (progress / 100 * parseInt(sections[currentSection]?.duration || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Learn More About NILBx</h1>
              <p className="text-blue-100">Your 2-minute guide to student-athlete monetization</p>
            </div>

            <div className="text-right">
              <div className="flex items-center text-blue-100 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">
                  {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Progress value={(currentTime / totalDuration) * 100} className="w-48 bg-blue-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={prevSection}
            disabled={currentSection === 0}
            variant="outline"
            className="px-6 py-2"
          >
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
            >
              {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <span className="text-gray-600 font-medium">
              {currentSection + 1} of {sections.length}
            </span>
          </div>

          <Button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
          >
            Next
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            {sections.map((section, index) => (
              <span
                key={section.id}
                className={`px-2 py-1 rounded ${
                  index === currentSection
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : index < currentSection
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {section.title}
              </span>
            ))}
          </div>
        </div>

        {/* Current Section Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {sections[currentSection]?.content}
        </div>

        {/* Section Navigation */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">All Sections</h3>
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all ${
                index === currentSection ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentSection(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentSection
                        ? 'bg-blue-600 text-white'
                        : index < currentSection
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.duration}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.id);
                    }}
                  >
                    {expandedSections[section.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {expandedSections[section.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {section.id === 'intro' && 'Introduction to NILBx platform and its purpose'}
                      {section.id === 'how-it-works' && 'Step-by-step explanation of how NIL deals work for athletes and brands'}
                      {section.id === 'compliance' && 'Details about compliance requirements and safety measures'}
                      {section.id === 'success-stories' && 'Real examples of successful student-athlete sponsorships'}
                      {section.id === 'get-started' && 'How to create an account and begin the process'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={() => navigate('/premium-deals')}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4"
            >
              <Star className="w-5 h-5 mr-2" />
              View Premium Options
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="lg"
              className="px-8 py-4"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}