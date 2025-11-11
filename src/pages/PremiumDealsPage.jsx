import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Crown, ArrowRight, Lock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PremiumDealsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);

  const premiumTiers = [
    {
      id: 'starter',
      name: 'Starter Premium',
      price: '$9.99/month',
      description: 'Perfect for student-athletes getting started',
      features: [
        'Access to 100+ verified brands',
        'Basic deal templates',
        'Email support',
        'Compliance guidance',
        'Basic analytics dashboard'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro Premium',
      price: '$24.99/month',
      description: 'For serious athletes building their brand',
      features: [
        'Access to 500+ premium brands',
        'Advanced deal templates',
        'Priority brand matching',
        '24/7 chat support',
        'Advanced analytics & insights',
        'Custom deal negotiation tools',
        'Brand partnership tracking'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'elite',
      name: 'Elite Premium',
      price: '$49.99/month',
      description: 'For elite athletes maximizing earnings',
      features: [
        'Access to 1000+ premium brands',
        'VIP brand introductions',
        'Dedicated account manager',
        'Custom marketing campaigns',
        'Revenue optimization tools',
        'Exclusive networking events',
        'White-glove service'
      ],
      popular: false,
      color: 'gold'
    }
  ];

  const handleUpgrade = (tierId) => {
    // In a real app, this would integrate with payment processing
    alert(`Upgrading to ${tierId} tier! Payment integration coming soon.`);
    setSelectedTier(tierId);
  };

  const handleBackToDashboard = () => {
    if (user?.role === 'athlete' || user?.role === 'student_athlete') {
      navigate('/dashboard/athlete');
    } else if (user?.role === 'influencer') {
      navigate('/dashboard/influencer');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-4xl lg:text-6xl font-black">Unlock Premium Deals</h1>
          </div>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
            Access exclusive sponsorship opportunities, premium brand partnerships, and maximize your earning potential
          </p>
        </div>
      </div>

      {/* Current Status */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Status: Free Tier</h3>
                    <p className="text-gray-600">Limited access to brands and features</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  Upgrade to Unlock More
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Premium Tiers */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Premium Tier
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your goals and unlock premium features designed for student-athletes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {premiumTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                tier.popular
                  ? 'ring-2 ring-purple-500 shadow-purple-200 scale-105'
                  : 'hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  tier.color === 'blue' ? 'bg-blue-100' :
                  tier.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  {tier.color === 'gold' ? (
                    <Crown className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <Star className={`w-8 h-8 ${
                      tier.color === 'blue' ? 'text-blue-600' :
                      tier.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'
                    }`} />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="text-3xl font-black text-gray-900 mb-2">{tier.price}</div>
                <CardDescription className="text-gray-600">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(tier.id)}
                  className={`w-full py-3 font-bold text-lg ${
                    tier.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : tier.color === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                  disabled={selectedTier === tier.id}
                >
                  {selectedTier === tier.id ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Selected
                    </>
                  ) : (
                    <>
                      Upgrade Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Go Premium?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of your athletic brand with premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Brand Access</h3>
              <p className="text-gray-600">Connect with top-tier brands actively seeking student-athlete partnerships</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Priority Matching</h3>
              <p className="text-gray-600">Get matched with brands based on your sport, following, and performance metrics</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance Assurance</h3>
              <p className="text-gray-600">All deals are pre-vetted for NCAA/NAIA compliance and legal requirements</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Unlock Premium Deals?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of student-athletes who are already maximizing their earning potential with premium features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleUpgrade('pro')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4"
            >
              Start Premium Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}