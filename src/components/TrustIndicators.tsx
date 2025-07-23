import React from 'react';
import { Shield, Award, Users, Clock, CheckCircle, Star } from 'lucide-react';

export function TrustIndicators() {
  const trustMetrics = [
    {
      icon: <Users className="h-8 w-8" />,
      value: '50,000+',
      label: 'Satisfied Customers',
      description: 'Join thousands of happy traders'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      value: '99.9%',
      label: 'Security Rating',
      description: 'Bank-level security measures'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      value: '190+',
      label: 'Countries Served',
      description: 'Global cryptocurrency trading'
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: '4.9/5',
      label: 'Customer Rating',
      description: 'Excellent customer satisfaction'
    }
  ];

  const certifications = [
    'SSL Encrypted',
    'PCI Compliant',
    'SOC 2 Certified',
    'GDPR Compliant'
  ];

  const recentActivity = [
    'John D. bought 0.5 BTC - 2 minutes ago',
    'Sarah M. sold 10 ETH - 5 minutes ago',
    'Mike R. bought $5,000 USDT - 8 minutes ago',
    'Lisa K. sold 2 BNB - 12 minutes ago'
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Metrics */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-gray-600">Join our community of satisfied crypto traders</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {trustMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {metric.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{metric.label}</div>
              <div className="text-sm text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Security Certifications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 text-green-600 mr-3" />
              Security & Compliance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Your funds are safe:</strong> We use military-grade encryption and store 95% of funds in cold storage.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-3" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                Live updates
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}