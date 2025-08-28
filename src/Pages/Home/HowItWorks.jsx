import React from 'react'
import { 
  HiUserAdd, 
  HiCog, 
  HiChartBar, 
  HiAcademicCap,
  HiArrowRight,
  HiCheckCircle
} from 'react-icons/hi'

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: HiUserAdd,
      title: 'Sign Up & Get Started',
      description: 'Create your free account in seconds. No credit card required, just your email and you\'re ready to go.',
      color: 'from-blue-500 to-cyan-500',
      features: ['Quick registration', 'Email verification', 'Instant access']
    },
    {
      step: '02',
      icon: HiCog,
      title: 'Set Up Your Tools',
      description: 'Configure your budget limits, add class schedules, and customize your study preferences to match your lifestyle.',
      color: 'from-purple-500 to-violet-500',
      features: ['Budget categories', 'Class timetable', 'Study goals']
    },
    {
      step: '03',
      icon: HiChartBar,
      title: 'Track Your Progress',
      description: 'Monitor your spending, attendance, and study habits with beautiful charts and insights that help you stay on track.',
      color: 'from-green-500 to-emerald-500',
      features: ['Real-time analytics', 'Progress reports', 'Smart insights']
    },
    {
      step: '04',
      icon: HiAcademicCap,
      title: 'Achieve Your Goals',
      description: 'Use AI-generated Q&A for exam prep, stick to your budget, and maintain perfect attendance with smart reminders.',
      color: 'from-orange-500 to-red-500',
      features: ['Exam preparation', 'Financial control', 'Academic success']
    }
  ]

  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get started with your complete student toolkit in just 4 simple steps. 
            Transform your academic life with our intuitive platform designed for students, by students.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-violet-500/40 to-purple-500/20"></div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-stretch">
            {steps.map((step, index) => (
              <div key={index} className="relative group flex">
                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-purple-500/40 to-transparent mt-4"></div>
                )}
                
                {/* Step Card */}
                <div className="relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex flex-col w-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 bg-gray-900 border-2 border-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-400">{step.step}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-1">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                          <HiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <HiArrowRight className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/10 group-hover:to-violet-600/10 rounded-2xl transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-full px-6 py-3 backdrop-blur-md">
            <HiCheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-300 font-medium">Ready to transform your student life?</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks