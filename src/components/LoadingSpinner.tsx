import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Target, FileText } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  const steps = [
    { icon: FileText, text: 'Parsing your resume...', delay: 0 },
    { icon: Brain, text: 'AI analyzing content...', delay: 0.5 },
    { icon: Target, text: 'Matching keywords...', delay: 1 },
    { icon: Zap, text: 'Generating optimizations...', delay: 1.5 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="glass-effect rounded-3xl p-12 text-center max-w-md mx-auto">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-full border-4 border-purple-200 border-t-purple-600"></div>
        </motion.div>

        <h2 className="text-2xl font-bold gradient-text mb-8">
          Analyzing Your Resume
        </h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay, duration: 0.5 }}
              className="flex items-center space-x-3 text-left"
            >
              <step.icon className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700">{step.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gray-500 mt-6"
        >
          This usually takes 30-60 seconds...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner