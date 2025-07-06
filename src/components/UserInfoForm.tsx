import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, Calendar, FileText } from 'lucide-react'
import FormSection from './FormSection'
import ResumePreview from './ResumePreview'
import ExportButtons from './ExportButtons'

export interface UserInfo {
  fullName: string
  email: string
  jobTitle: string
  yearsOfExperience: string
  summary: string
}

interface UserInfoFormProps {
  onBack: () => void
  jobDescription: string
  resumeFile: File | null
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onBack, jobDescription, resumeFile }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    jobTitle: '',
    yearsOfExperience: '',
    summary: ''
  })
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleAnalyze = () => {
    if (!userInfo.fullName || !userInfo.email || !userInfo.jobTitle || !userInfo.yearsOfExperience || !userInfo.summary) {
      return
    }
    setShowPreview(true)
  }

  const isFormValid = userInfo.fullName && userInfo.email && userInfo.jobTitle && userInfo.yearsOfExperience && userInfo.summary

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Fill in your details to generate an optimized resume
          </p>
        </motion.div>

        <div className="space-y-8">
          <FormSection 
            userInfo={userInfo}
            onInputChange={handleInputChange}
          />

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className={`px-12 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform ${
                isFormValid
                  ? 'gradient-bg hover:scale-105 hover:shadow-2xl animate-gradient'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Analyze
            </button>
          </div>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <ResumePreview userInfo={userInfo} />
              <ExportButtons userInfo={userInfo} />
            </motion.div>
          )}

          <div className="text-center">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors duration-200"
            >
              Back to Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoForm