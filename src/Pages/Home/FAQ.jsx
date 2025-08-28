import React, { useState } from 'react'
import { 
  HiChevronDown, 
  HiChevronUp,
  HiQuestionMarkCircle,
  HiLightBulb,
  HiShieldCheck,
  HiCurrencyDollar,
  HiDeviceMobile,
  HiSupport
} from 'react-icons/hi'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0) // First FAQ open by default

  const faqData = [
    {
      category: 'Getting Started',
      icon: HiLightBulb,
      color: 'from-blue-500 to-cyan-500',
      questions: [
        {
          question: 'How do I get started with Student Life Toolkit?',
          answer: 'Simply sign up with your email address and you\'ll get instant access to all our core features. No credit card required, no complex setup - just create your account and start organizing your student life right away.'
        },
        {
          question: 'Is the platform really free to use?',
          answer: 'Yes! Our core features including budget tracking, class scheduling, study planning, and basic Q&A generation are completely free. We believe every student deserves access to tools that help them succeed academically and financially.'
        }
      ]
    },
    {
      category: 'Features & Tools',
      icon: HiQuestionMarkCircle,
      color: 'from-purple-500 to-violet-500',
      questions: [
        {
          question: 'What tools are included in the Student Life Toolkit?',
          answer: 'Our platform includes four main tools: Budget Tracker for managing finances, Class Schedule for organizing your academic timetable, AI-powered Q&A Generator for exam preparation, and Study Planner for organizing your study sessions and goals.'
        },
        {
          question: 'How does the AI Q&A Generator work?',
          answer: 'Our AI analyzes your study materials and generates relevant questions and answers to help you prepare for exams. Simply upload your notes or textbook content, and our system creates practice questions tailored to your specific subjects and learning needs.'
        },
        {
          question: 'Can I sync my class schedule with my calendar?',
          answer: 'Yes! You can export your class schedule and import it into Google Calendar, Apple Calendar, or any calendar app that supports .ics files. This ensures you never miss a class or important academic deadline.'
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: HiShieldCheck,
      color: 'from-green-500 to-emerald-500',
      questions: [
        {
          question: 'Is my personal and financial data secure?',
          answer: 'Absolutely. We use industry-standard encryption to protect all your data. Your financial information is encrypted and stored securely, and we never share your personal information with third parties. Your privacy and security are our top priorities.'
        },
        {
          question: 'Can I delete my account and data anytime?',
          answer: 'Yes, you have complete control over your data. You can delete your account and all associated data at any time from your account settings. We also provide data export options if you want to backup your information before deletion.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: HiDeviceMobile,
      color: 'from-orange-500 to-red-500',
      questions: [
        {
          question: 'Does the platform work on mobile devices?',
          answer: 'Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can access all features on any device with a web browser - no app download required.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'We support all modern web browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.'
        },
        {
          question: 'How can I get help if I have issues?',
          answer: 'We offer multiple support channels: comprehensive help documentation, video tutorials, email support, and live chat during business hours. Most questions are answered within 24 hours.'
        }
      ]
    }
  ]

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const faqIndex = categoryIndex * 100 + questionIndex
    setOpenFAQ(openFAQ === faqIndex ? null : faqIndex)
  }

  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get quick answers to common questions about our Student Life Toolkit. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
              </div>

              {/* Questions for this category */}
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const faqIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openFAQ === faqIndex

                  return (
                    <div
                      key={questionIndex}
                      className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/30 transition-colors duration-200 rounded-xl"
                      >
                        <span className="text-lg font-semibold text-white pr-4">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <HiChevronUp className="w-6 h-6 text-purple-400 transition-transform duration-200" />
                          ) : (
                            <HiChevronDown className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
                          )}
                        </div>
                      </button>

                      {/* Answer */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 pb-6 border-t border-gray-700/30">
                          <p className="text-gray-300 leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Support Section */}
        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-md">
            <HiSupport className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Still Have Questions?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you get the most out of your Student Life Toolkit
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Contact Support
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default FAQ