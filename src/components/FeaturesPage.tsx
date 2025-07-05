import React from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Brain, 
  Zap, 
  FileText, 
  TrendingUp, 
  Shield,
  Clock,
  Award,
  CheckCircle
} from 'lucide-react'

interface FeaturesPageProps {
  onNavigate?: (page: string) => void
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your resume against job descriptions to identify optimization opportunities.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'ATS Compatibility Score',
      description: 'Get a detailed score showing how well your resume will perform with Applicant Tracking Systems.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'Receive tailored resume versions optimized for specific job descriptions in seconds.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: FileText,
      title: 'Multiple Format Support',
      description: 'Upload resumes in PDF, DOC, or DOCX formats with seamless text extraction.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Keyword Matching',
      description: 'Identify missing keywords and get suggestions to improve your resume\'s relevance.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your resume data is processed securely and never stored permanently on our servers.',
      color: 'from-red-500 to-pink-500'
    }
  ]

  const benefits = [
    'Increase interview callbacks by up to 40%',
    'Save hours of manual resume customization',
    'Beat ATS filters with optimized formatting',
    'Get actionable improvement suggestions',
    'Stand out from other candidates'
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI-powered platform transforms your resume into a job-winning document
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect rounded-3xl p-8 card-shadow hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-effect rounded-3xl p-12 card-shadow text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Award className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold gradient-text">Why Choose AI Resume Tailor?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="flex items-center space-x-3 bg-green-50 rounded-2xl p-4"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: '50K+', label: 'Resumes Optimized' },
            { number: '40%', label: 'More Interviews' },
            { number: '95%', label: 'ATS Compatibility' },
            { number: '30s', label: 'Average Processing Time' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Transform your resume today and increase your chances of landing your dream job
          </p>
          <button 
            onClick={() => onNavigate?.('home')}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl hover:scale-105 transition-transform duration-200"
          >
            Start Optimizing Now
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default FeaturesPage