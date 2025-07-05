import React from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Brain, 
  Target, 
  Download,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react'

interface HowItWorksPageProps {
  onNavigate?: (page: string) => void
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Simply drag and drop your resume in PDF, DOC, or DOCX format. Our system supports all major file types.',
      details: [
        'Supports PDF, DOC, and DOCX formats',
        'Secure file processing',
        'Instant text extraction',
        'No file size limits up to 10MB'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Paste Job Description',
      description: 'Copy and paste the complete job description from the position you\'re applying for.',
      details: [
        'Include full job requirements',
        'Add preferred qualifications',
        'Copy responsibilities section',
        'Include company culture info'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes your resume against the job description to identify optimization opportunities.',
      details: [
        'Keyword extraction and matching',
        'ATS compatibility scoring',
        'Content gap analysis',
        'Industry-specific optimization'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Get Your Score',
      description: 'Receive a detailed ATS compatibility score with specific suggestions for improvement.',
      details: [
        'Overall ATS compatibility score',
        'Keyword match percentage',
        'Missing keywords identification',
        'Actionable improvement tips'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Download,
      title: 'Download Optimized Resume',
      description: 'Get your tailored resume optimized specifically for the job you\'re applying to.',
      details: [
        'AI-optimized content',
        'Improved keyword density',
        'Enhanced formatting',
        'Ready-to-submit version'
      ],
      color: 'from-red-500 to-pink-500'
    }
  ]

  const processFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get results in under 60 seconds'
    },
    {
      icon: CheckCircle,
      title: 'Highly Accurate',
      description: '95% ATS compatibility rate'
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Advanced machine learning algorithms'
    }
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
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your resume in 5 simple steps with our AI-powered optimization process
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-purple-600 mb-1">
                      STEP {index + 1}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{step.title}</h3>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 flex justify-center">
                <div className={`w-80 h-80 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center glass-effect card-shadow`}>
                  <step.icon className="w-32 h-32 text-white opacity-80" />
                </div>
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-96">
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Process Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="glass-effect rounded-3xl p-12 card-shadow"
        >
          <h2 className="text-3xl font-bold text-center gradient-text mb-12">
            Why Our Process Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {processFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of job seekers who have improved their interview success rate
          </p>
          <button 
            onClick={() => onNavigate?.('home')}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl hover:scale-105 transition-transform duration-200"
          >
            Get Started Now
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default HowItWorksPage