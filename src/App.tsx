import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import JobDescriptionForm from './components/JobDescriptionForm'
import AnalysisResults from './components/AnalysisResults'
import LoadingSpinner from './components/LoadingSpinner'
import FeaturesPage from './components/FeaturesPage'
import HowItWorksPage from './components/HowItWorksPage'
import UserInfoForm from './components/UserInfoForm'
import { AnalysisResult } from './types'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeFile) {
      return
    }

    // Show user info form instead of directly analyzing
    setShowUserForm(true)
  }

  const handleBackToUpload = () => {
    setShowUserForm(false)
  }

  const canAnalyze = jobDescription.trim() && resumeFile && !isAnalyzing

  // Render different pages based on current page
  if (currentPage === 'features') {
    return (
      <div className="min-h-screen">
        <Header onNavigate={handleNavigate} />
        <FeaturesPage onNavigate={handleNavigate} />
      </div>
    )
  }

  if (currentPage === 'how-it-works') {
    return (
      <div className="min-h-screen">
        <Header onNavigate={handleNavigate} />
        <HowItWorksPage onNavigate={handleNavigate} />
      </div>
    )
  }

  // Show user info form
  if (showUserForm) {
    return (
      <div className="min-h-screen">
        <Header onNavigate={handleNavigate} />
        <UserInfoForm 
          onBack={handleBackToUpload}
          jobDescription={jobDescription}
          resumeFile={resumeFile}
        />
      </div>
    )
  }

  // Home page
  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            AI Resume Tailor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your resume with AI-powered optimization. Get ATS scores, 
            keyword analysis, and tailored versions that land interviews.
          </p>
        </motion.div>

        {isAnalyzing ? (
          <LoadingSpinner />
        ) : analysisResult ? (
          <AnalysisResults 
            result={analysisResult} 
            onStartOver={() => {
              setAnalysisResult(null)
              setJobDescription('')
              setResumeFile(null)
              setShowUserForm(false)
            }}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <JobDescriptionForm 
                value={jobDescription}
                onChange={setJobDescription}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <UploadSection 
                file={resumeFile}
                onFileSelect={setResumeFile}
              />
            </motion.div>
          </div>
        )}

        {!isAnalyzing && !analysisResult && !showUserForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`px-12 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform ${
                canAnalyze
                  ? 'gradient-bg hover:scale-105 hover:shadow-2xl animate-gradient'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Analyze & Optimize Resume
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default App