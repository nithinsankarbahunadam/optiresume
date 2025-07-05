import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { JobDescriptionProps } from '../types'

const JobDescriptionForm: React.FC<JobDescriptionProps> = ({ value, onChange }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-3xl p-8 card-shadow h-full flex flex-col"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>
      
      <div className="space-y-4 flex-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          Paste the job description you're applying for
        </label>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here... Include requirements, responsibilities, and preferred qualifications for best results."
          className="w-full flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none"
          style={{ minHeight: '280px' }}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
          <span>{value.length} characters</span>
          <div className="flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${value.length > 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Minimum 100 characters recommended</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default JobDescriptionForm