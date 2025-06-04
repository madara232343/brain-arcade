
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, AlertTriangle, Scale } from 'lucide-react';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-white/70">Last updated: June 4, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-8">
          <section>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 mr-3 text-blue-400" />
              <h2 className="text-2xl font-bold">Agreement to Terms</h2>
            </div>
            <div className="text-white/90">
              <p>
                By accessing and using Brain Burst Arcade, you accept and agree to be bound by these Terms of Service. 
                Our platform provides scientifically-designed brain training games to improve cognitive abilities including 
                memory, attention, and processing speed.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 mr-3 text-green-400" />
              <h2 className="text-2xl font-bold">User Responsibilities</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>As a user of our cognitive training platform, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the games for legitimate brain training and educational purposes</li>
                <li>Not attempt to manipulate scores or leaderboards through unauthorized means</li>
                <li>Respect other users in competitive features and leaderboards</li>
                <li>Not reverse engineer or copy our proprietary game algorithms</li>
                <li>Provide accurate information when submitting reviews or feedback</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 mr-3 text-purple-400" />
              <h2 className="text-2xl font-bold">Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>
                All game content, algorithms, and cognitive training methodologies are proprietary to Brain Burst Arcade. 
                Our games are designed based on peer-reviewed neuroscience research and represent significant intellectual property.
              </p>
              <p>
                Users retain ownership of their game statistics and progress data but grant us license to use anonymized 
                data for research and platform improvement purposes.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 mr-3 text-yellow-400" />
              <h2 className="text-2xl font-bold">Disclaimer & Limitations</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>
                <strong>Educational Purpose:</strong> Our games are designed for cognitive training and entertainment. 
                While based on scientific research, they are not medical devices or treatments.
              </p>
              <p>
                <strong>No Warranties:</strong> We provide the service "as is" without warranties of any kind. 
                We do not guarantee specific cognitive improvements or outcomes.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> Our liability is limited to the fullest extent permitted by law. 
                We are not responsible for any indirect, incidental, or consequential damages.
              </p>
            </div>
          </section>

          <section>
            <div className="text-white/90">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p><strong>Email:</strong> legal@brainburstart.com</p>
                <p><strong>Website:</strong> www.brainburstart.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
