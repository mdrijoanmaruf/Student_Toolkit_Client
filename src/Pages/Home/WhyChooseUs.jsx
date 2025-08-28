import React from 'react'
import { 
  HiShieldCheck, 
  HiLightningBolt, 
  HiHeart, 
  HiGlobe,
  HiSparkles,
  HiTrendingUp,
  HiUserGroup,
  HiAcademicCap,
  HiCheckCircle,
  HiStar
} from 'react-icons/hi'

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: HiLightningBolt,
      title: 'All-in-One Platform',
      description: 'Everything you need as a student in one beautiful, integrated platform. No more switching between multiple apps.',
      color: 'from-yellow-500 to-orange-500',
      stats: '4 Essential Tools'
    },
    {
      icon: HiSparkles,
      title: 'AI-Powered Intelligence',
      description: 'Smart Q&A generation, predictive insights, and personalized recommendations to boost your academic performance.',
      color: 'from-purple-500 to-violet-500',
      stats: 'Smart Learning'
    },
    {
      icon: HiShieldCheck,
      title: '100% Free to Start',
      description: 'Get full access to core features without any payment. No hidden fees, no credit card required, just pure value.',
      color: 'from-green-500 to-emerald-500',
      stats: '$0 Cost'
    },
    {
      icon: HiTrendingUp,
      title: 'Proven Results',
      description: 'Students using our platform report 40% better budget management and 60% improved study organization.',
      color: 'from-blue-500 to-cyan-500',
      stats: '40% Better Results'
    },
    {
      icon: HiHeart,
      title: 'Student-First Design',
      description: 'Built by students, for students. Every feature is designed with real student needs and challenges in mind.',
      color: 'from-pink-500 to-rose-500',
      stats: 'Student Focused'
    },
    {
      icon: HiGlobe,
      title: 'Access Anywhere',
      description: 'Works seamlessly across all devices. Study at home, track expenses on campus, schedule classes on the go.',
      color: 'from-indigo-500 to-purple-500',
      stats: 'Cross Platform'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      text: 'This toolkit completely transformed how I manage my student life. The budget tracker alone saved me $200 last month!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Business Major',
      text: 'The AI Q&A feature is incredible for exam prep. I went from B grades to A\'s consistently.',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Pre-Med Student',
      text: 'Finally, all my student tools in one place. The study planner keeps me organized during intense semester schedules.',
      rating: 5
    }
  ]

  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Our Platform?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who have transformed their academic life with our comprehensive toolkit. 
            Here's what makes us different.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 flex flex-col"
            >
              {/* Icon and Stats */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-700/50 px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-gray-300">{benefit.stats}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-1">
                  {benefit.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/5 group-hover:to-violet-600/5 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-md">
            <HiUserGroup className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Join 10,000+ Successful Students</h3>
            <p className="text-gray-300 mb-6">Start your journey to better student life management today</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No Setup Required
              </div>
              <div className="flex items-center">
                <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Instant Access
              </div>
              <div className="flex items-center">
                <HiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs