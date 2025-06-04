
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do brain training games actually work?",
      answer: "Brain training games work by repeatedly challenging specific cognitive functions, leading to neuroplasticity - the brain's ability to reorganize and form new neural connections. Our games target working memory, attention, processing speed, and executive function through carefully designed exercises based on cognitive science research."
    },
    {
      question: "How often should I train for optimal results?",
      answer: "Research suggests that 15-20 minutes of daily cognitive training, 4-5 times per week, provides optimal benefits. Consistency is more important than duration - shorter, regular sessions are more effective than longer, infrequent ones."
    },
    {
      question: "Will improvements transfer to real-world tasks?",
      answer: "Yes, studies show that cognitive training can improve real-world performance. Our games are designed to enhance core cognitive abilities that underlie many daily tasks including academic work, professional performance, and everyday problem-solving."
    },
    {
      question: "How long before I see improvements?",
      answer: "Most users report noticeable improvements within 2-4 weeks of regular training. Measurable cognitive gains typically appear after 4-6 weeks, with continued improvement over 3-6 months of consistent training."
    },
    {
      question: "Are the games suitable for all ages?",
      answer: "Our games are designed for ages 13 and up. The adaptive difficulty system ensures appropriate challenge levels for different skill levels, from beginners to advanced users. Older adults often see particularly significant benefits from cognitive training."
    },
    {
      question: "Is Brain Burst Arcade free to use?",
      answer: "Yes, Brain Burst Arcade is completely free to use. We're supported by advertising revenue, allowing us to provide high-quality cognitive training to everyone regardless of economic circumstances."
    },
    {
      question: "How is my data protected?",
      answer: "We take data protection seriously. All personal information is encrypted and stored securely. We only collect necessary gameplay data to improve your experience and never share personal information with third parties. See our Privacy Policy for full details."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Absolutely! Our platform provides detailed progress tracking including performance trends, accuracy improvements, speed gains, and cognitive ability scores. You can view your improvement over days, weeks, and months."
    },
    {
      question: "What makes your games different from other brain trainers?",
      answer: "Our games are based on peer-reviewed research and use adaptive algorithms that adjust difficulty in real-time. We focus on scientifically validated cognitive domains rather than generic puzzles, ensuring maximum training effectiveness."
    },
    {
      question: "Do I need special equipment or software?",
      answer: "No special equipment is needed. Brain Burst Arcade runs in any modern web browser on computers, tablets, and smartphones. We recommend using headphones for games with audio components for the best experience."
    }
  ];

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
            <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-white/70">Everything you need to know about Brain Burst Arcade</p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <HelpCircle className="h-6 w-6 mr-4 text-blue-400" />
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                </div>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-white/70" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/70" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="pl-10 text-white/90 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-white/80 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> support@brainburstart.com</p>
            <p><strong>Response Time:</strong> Usually within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
