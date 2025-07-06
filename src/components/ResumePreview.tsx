import React from 'react'
import { motion } from 'framer-motion'
import { FileText, User, Mail, Briefcase, Calendar } from 'lucide-react'
import { UserInfo } from './UserInfoForm'

interface ResumePreviewProps {
  userInfo: UserInfo
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ userInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect rounded-3xl p-8 card-shadow"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
      </div>

      <div id="resume-content" className="bg-white p-8 rounded-2xl border-2 border-gray-100 space-y-6">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{userInfo.fullName}</h1>
          <h2 className="text-xl text-purple-600 font-semibold mb-4">{userInfo.jobTitle}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{userInfo.yearsOfExperience} years experience</span>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Professional Summary</span>
          </h3>
          <p className="text-gray-700 leading-relaxed">{userInfo.summary}</p>
        </div>

        {/* Experience Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Experience Level</span>
          </h3>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-purple-800 font-medium">{userInfo.yearsOfExperience} years of professional experience</p>
            <p className="text-purple-600 text-sm mt-1">Specialized in {userInfo.jobTitle}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Key Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Strategic Planning'].map((skill, index) => (
              <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumePreview