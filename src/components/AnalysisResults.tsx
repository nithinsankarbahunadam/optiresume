import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  RefreshCw, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Star,
  FileText,
  Edit3
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AnalysisResult } from '../types'

interface AnalysisResultsProps {
  result: AnalysisResult
  onStartOver: () => void
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onStartOver }) => {
  const [customFilename, setCustomFilename] = useState(
    result.original_filename.replace(/\.[^/.]+$/, '') + '_optimized'
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(result.tailored_resume_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${customFilename}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      toast.error('Download failed. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Analysis Complete! 🎉
        </h2>
        <p className="text-gray-600">
          Here's your comprehensive resume analysis and optimization
        </p>
      </div>

      {/* ATS Score Card */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-3xl p-8 text-center card-shadow"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Target className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold">ATS Compatibility Score</h3>
        </div>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(result.ats_score / 100) * 314} 314`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="stop-purple-500" />
                <stop offset="100%" className="stop-pink-500" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(result.ats_score)}`}>
              {result.ats_score}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-blue-600">{result.keyword_matches}</p>
            <p className="text-sm text-blue-800">Keywords Matched</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-purple-600">{result.total_keywords}</p>
            <p className="text-sm text-purple-800">Total Keywords</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Missing Keywords */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-3xl p-8 card-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold">Missing Keywords</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((keyword, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-3xl p-8 card-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-bold">Optimization Suggestions</h3>
          </div>
          
          <div className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-effect rounded-3xl p-8 card-shadow"
      >
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold">Download Optimized Resume</h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom filename (optional)
            </label>
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter filename"
              />
              <span className="text-gray-500">.pdf</span>
            </div>
          </div>
          
          <button
            onClick={handleDownload}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl hover:scale-105 transition-transform duration-200 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Resume</span>
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Analyze Another Resume</span>
        </button>
      </div>
    </motion.div>
  )
}

export default AnalysisResults