
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-white/70">Last updated: June 4, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-8">
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 mr-3 text-blue-400" />
              <h2 className="text-2xl font-bold">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>
                At Brain Burst Arcade, we are committed to protecting your privacy. We collect information to provide you with a better gaming experience:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Game Statistics:</strong> Your scores, completion times, and gameplay patterns to track progress</li>
                <li><strong>Performance Data:</strong> Device information and browser type to optimize game performance</li>
                <li><strong>Usage Analytics:</strong> Anonymous data about which games are most popular to improve our offerings</li>
                <li><strong>Local Storage:</strong> Game preferences and settings stored locally on your device</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 mr-3 text-green-400" />
              <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>We use the collected information for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personalizing your gaming experience and tracking cognitive improvement</li>
                <li>Providing leaderboards and competitive features</li>
                <li>Analyzing game performance and user engagement</li>
                <li>Improving our games and developing new cognitive training exercises</li>
                <li>Ensuring technical functionality and security</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 mr-3 text-purple-400" />
              <h2 className="text-2xl font-bold">Data Protection & Cookies</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>
                We implement appropriate security measures to protect your information. We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your game preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Provide personalized advertising through Google AdSense</li>
                <li>Improve site functionality and user experience</li>
              </ul>
              <p className="mt-4">
                <strong>Third-Party Services:</strong> We use Google AdSense for advertising, which may collect information through cookies. You can manage cookie preferences in your browser settings.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 mr-3 text-yellow-400" />
              <h2 className="text-2xl font-bold">Contact Us</h2>
            </div>
            <div className="text-white/90">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p><strong>Email:</strong> privacy@brainburstart.com</p>
                <p><strong>Website:</strong> www.brainburstart.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
