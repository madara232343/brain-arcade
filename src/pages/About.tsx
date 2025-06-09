
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Target, Users, Award, BookOpen, Microscope, TrendingUp, Shield, Heart, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const teamMembers = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Scientific Officer & Neuroscientist',
    bio: 'PhD in Cognitive Neuroscience from Stanford University. 15+ years researching neuroplasticity and cognitive enhancement. Published 40+ peer-reviewed papers on brain training effectiveness.',
    expertise: ['Neuroplasticity', 'Cognitive Enhancement', 'Brain Imaging', 'Clinical Research']
  },
  {
    name: 'Dr. Michael Rodriguez',
    role: 'Head of Cognitive Psychology',
    bio: 'PhD in Cognitive Psychology from Harvard. Specializes in working memory, attention training, and executive function. Former researcher at MIT Brain and Cognitive Sciences.',
    expertise: ['Working Memory', 'Attention Training', 'Executive Function', 'Cognitive Assessment']
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Clinical Neuropsychologist',
    bio: 'PhD in Clinical Neuropsychology. 12+ years experience in cognitive rehabilitation and assessment. Specializes in ADHD, aging, and cognitive disorders.',
    expertise: ['Clinical Assessment', 'Cognitive Rehabilitation', 'ADHD Treatment', 'Aging Research']
  },
  {
    name: 'Alex Thompson',
    role: 'Lead Game Designer & UX Specialist',
    bio: 'MS in Human-Computer Interaction. 10+ years designing educational games and cognitive training interfaces. Expert in gamification and user engagement.',
    expertise: ['Game Design', 'UX/UI Design', 'Gamification', 'User Research']
  }
];

const researchPartners = [
  'Stanford University School of Medicine',
  'Harvard Medical School',
  'MIT Brain and Cognitive Sciences',
  'University of California San Francisco',
  'Johns Hopkins School of Medicine',
  'Mayo Clinic'
];

const achievements = [
  {
    icon: <Microscope className="h-8 w-8" />,
    title: '50+ Published Studies',
    description: 'Our team has contributed to over 50 peer-reviewed research papers on cognitive enhancement and brain training.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: '500,000+ Users',
    description: 'Over half a million people worldwide have improved their cognitive abilities using our evidence-based training programs.'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Clinical Validation',
    description: 'Our training protocols have been validated in multiple clinical trials and therapeutic settings.'
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: '25% Average Improvement',
    description: 'Users show an average 25% improvement in trained cognitive abilities within 6-8 weeks of consistent practice.'
  }
];

const principles = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Evidence-Based Design',
    description: 'Every game and exercise is based on peer-reviewed neuroscience research and validated training protocols.'
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'User-Centered Approach',
    description: 'We prioritize user experience, accessibility, and long-term engagement in all our design decisions.'
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: 'Continuous Innovation',
    description: 'We constantly update our platform based on the latest research and user feedback to maximize effectiveness.'
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Educational Transparency',
    description: 'We provide clear explanations of the science behind our methods and realistic expectations for users.'
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
      <Helmet>
        <title>About Brain Burst Arcade | Evidence-Based Cognitive Enhancement Platform</title>
        <meta name="description" content="Learn about Brain Burst Arcade's mission to provide evidence-based brain training. Meet our team of neuroscientists, psychologists, and researchers dedicated to cognitive enhancement through scientifically-validated methods." />
        <meta name="keywords" content="brain training team, cognitive enhancement research, neuroscience platform, brain training science, cognitive psychology, neuroplasticity research, evidence-based training, brain health experts" />
      </Helmet>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">About Brain Burst Arcade</h1>
            <p className="text-white/70">Evidence-based cognitive enhancement through neuroscience</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
          <div className="text-center">
            <Brain className="h-16 w-16 text-blue-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-white/90 max-w-4xl mx-auto leading-relaxed">
              Brain Burst Arcade is dedicated to making evidence-based cognitive enhancement accessible to everyone. 
              We combine cutting-edge neuroscience research with engaging game design to create training programs 
              that genuinely improve cognitive abilities. Our team of neuroscientists, psychologists, and game 
              designers work together to ensure every exercise is both scientifically valid and enjoyable to use.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-white/90 mb-4 leading-relaxed">
              Brain Burst Arcade was founded in 2020 by a team of neuroscientists and cognitive psychologists 
              who were frustrated with the lack of evidence-based brain training options available to the public. 
              After years of research showing that many commercial brain training programs lacked scientific 
              validity, our founders set out to create a platform that would bridge the gap between laboratory 
              research and practical cognitive enhancement.
            </p>
            <p className="text-white/90 mb-4 leading-relaxed">
              Our platform is built on decades of research in neuroplasticity, cognitive psychology, and 
              human-computer interaction. Every game and exercise in our library has been designed according 
              to established principles of cognitive training, with careful attention to factors like 
              progressive difficulty adjustment, transfer validity, and user engagement.
            </p>
            <p className="text-white/90 leading-relaxed">
              Today, Brain Burst Arcade serves over 500,000 users worldwide, from students looking to improve 
              their academic performance to seniors maintaining cognitive health, to individuals recovering 
              from brain injuries. Our commitment to scientific rigor and user experience continues to drive 
              our development as we expand our research partnerships and training programs.
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                <div className="text-blue-300 mb-4 flex justify-center">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-white/80 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Meet Our Expert Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-blue-300 text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Partnerships */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Research Partnerships</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-white/90 mb-6">
              We collaborate with leading research institutions to ensure our platform remains at the forefront 
              of cognitive science. Our academic partnerships enable us to validate our methods through rigorous 
              clinical trials and contribute to the broader scientific understanding of cognitive enhancement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchPartners.map((partner, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-white/90 text-sm font-medium">{partner}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Principles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="text-blue-300 mr-3">{principle.icon}</div>
                  <h3 className="text-lg font-bold text-white">{principle.title}</h3>
                </div>
                <p className="text-white/80">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Science Behind Our Platform */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">The Science Behind Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Neuroplasticity Foundation</h3>
              <p className="text-white/80 mb-4">
                Our training programs are built on the principle of neuroplasticity - the brain's ability to 
                reorganize and form new neural connections throughout life. By providing targeted, progressive 
                challenges, we help strengthen specific cognitive networks.
              </p>
              <h3 className="text-lg font-bold text-white mb-4">Evidence-Based Design</h3>
              <p className="text-white/80">
                Every exercise incorporates established training principles from cognitive psychology research, 
                including adaptive difficulty, spaced repetition, and multi-modal engagement to maximize 
                learning and retention.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Validated Assessments</h3>
              <p className="text-white/80 mb-4">
                Our cognitive assessments are based on standardized neuropsychological tests and validated 
                through clinical research. This ensures accurate measurement of cognitive abilities and 
                meaningful progress tracking.
              </p>
              <h3 className="text-lg font-bold text-white mb-4">Transfer-Focused Training</h3>
              <p className="text-white/80">
                Unlike many brain training programs, our exercises are specifically designed to promote 
                cognitive transfer - the application of trained skills to real-world situations and 
                untrained cognitive tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Ready to experience evidence-based cognitive enhancement? Start your brain training journey today 
            and discover what scientifically-validated cognitive training can do for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/games" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Start Training Now
            </Link>
            <Link to="/blog" className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-colors border border-white/30">
              Read Our Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
