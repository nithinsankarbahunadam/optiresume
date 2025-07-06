import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, Calendar, FileText } from 'lucide-react'
import { UserInfo } from './UserInfoForm'

interface FormSectionProps {
  userInfo: UserInfo
  onInputChange: (field: keyof UserInfo, value: string) => void
}

const FormSection: React.FC<FormSectionProps> = ({ userInfo, onInputChange }) => {
  const experienceOptions = [
    { value: '', label: 'Select experience level' },
    { value: '0-2', label: '0–2 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '6-10', label: '6–10 years' },
    { value: '10+', label: '10+ years' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect rounded-3xl p-8 card-shadow"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            value={userInfo.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4" />
            <span>Job Title</span>
          </label>
          <input
            type="text"
            value={userInfo.jobTitle}
            onChange={(e) => onInputChange('jobTitle', e.target.value)}
            placeholder="Enter your desired job title"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>Years of Experience</span>
          </label>
          <select
            value={userInfo.yearsOfExperience}
            onChange={(e) => onInputChange('yearsOfExperience', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
          >
            {experienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <FileText className="w-4 h-4" />
          <span>Professional Summary</span>
        </label>
        <textarea
          value={userInfo.summary}
          onChange={(e) => onInputChange('summary', e.target.value)}
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none"
        />
        <div className="text-sm text-gray-500">
          {userInfo.summary.length} characters
        </div>
      </div>
    </motion.div>
  )
}

export default FormSection