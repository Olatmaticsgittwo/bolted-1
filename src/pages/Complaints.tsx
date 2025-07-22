import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, CheckCircle, User } from 'lucide-react';

interface ComplaintsProps {
  onNavigate: (page: string) => void;
}

export function Complaints({ onNavigate }: ComplaintsProps) {
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    complaint: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const assistants = [
    {
      id: 'fatima',
      name: 'Fatima',
      title: 'Senior Assistant',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      specialty: 'General inquiries and account issues'
    },
    {
      id: 'james',
      name: 'James',
      title: 'Dispute Resolver',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      specialty: 'Transaction disputes and refunds'
    },
    {
      id: 'clara',
      name: 'Clara',
      title: 'Customer Happiness Lead',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      specialty: 'Service quality and satisfaction'
    },
    {
      id: 'ibrahim',
      name: 'Ibrahim',
      title: 'Transaction Analyst',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      specialty: 'Technical transaction issues'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitComplaint = async () => {
    if (!selectedAssistant) {
      alert('Please select a customer care assistant');
      return;
    }

    setIsSubmitting(true);

    try {
      const assistant = assistants.find(a => a.id === selectedAssistant);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-complaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...formData,
          assistantName: assistant?.name,
          assistantTitle: assistant?.title
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', complaint: '' });
        setSelectedAssistant(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAssistantData = assistants.find(a => a.id === selectedAssistant);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              File a Complaint
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We take your concerns seriously. Select a customer care assistant and describe your issue.
            </p>
          </div>
        </div>
      </div>

      {/* Assistant Selection */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose Your Customer Care Assistant
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {assistants.map((assistant) => (
              <div
                key={assistant.id}
                onClick={() => setSelectedAssistant(assistant.id)}
                className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedAssistant === assistant.id
                    ? 'ring-4 ring-blue-500 shadow-2xl'
                    : 'hover:shadow-xl'
                }`}
              >
                <div className="bg-white rounded-2xl p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={assistant.image}
                      alt={assistant.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                    />
                    {selectedAssistant === assistant.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assistant.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{assistant.title}</p>
                  <p className="text-sm text-gray-600">{assistant.specialty}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Complaint Form */}
          {selectedAssistant && (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Submit Complaint to {selectedAssistantData?.name}
                </h3>
                <p className="text-gray-600">{selectedAssistantData?.title}</p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Complaint Sent Successfully!</h3>
                  <p className="text-lg text-gray-600 mb-2">
                    Your complaint has been sent to <strong>{selectedAssistantData?.name}</strong>
                  </p>
                  <p className="text-gray-500">
                    You will receive a response within 24 hours at your email address.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Complaint *
                    </label>
                    <textarea
                      name="complaint"
                      value={formData.complaint}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Please provide detailed information about your complaint..."
                    />
                  </div>

                  <button
                    onClick={handleSubmitComplaint}
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.complaint}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Submitting Complaint...
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        Submit Complaint to {selectedAssistantData?.name}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us directly for urgent matters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:bianotrades@hotmail.com"
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Email Support
            </a>
            <a
              href="https://instagram.com/bianotrades"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              Instagram @bianotrades
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}