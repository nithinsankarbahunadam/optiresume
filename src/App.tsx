import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import JobDescriptionForm from './components/JobDescriptionForm'
import AnalysisResults from './components/AnalysisResults'
import LoadingSpinner from './components/LoadingSpinner'
import FeaturesPage from './components/FeaturesPage'
import HowItWorksPage from './components/HowItWorksPage'
import { AnalysisResult } from './types'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeFile) {
      return
    }

    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('job_description', jobDescription)
      formData.append('resume_file', resumeFile)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      // For demo purposes, show mock results
      setTimeout(() => {
        setAnalysisResult({
          ats_score: 78,
          keyword_matches: 12,
          total_keywords: 18,
          missing_keywords: ['Python', 'Machine Learning', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
          suggestions: [
            'Add more technical keywords related to the job requirements',
            'Include specific achievements with quantifiable results',
            'Optimize the skills section with relevant technologies',
            'Improve the summary section to better match job description'
          ],
          tailored_resume_url: '/api/download/tailored-resume.pdf',
          original_filename: resumeFile.name
        })
        setIsAnalyzing(false)
      }, 3000)
      return
    }

    setIsAnalyzing(false)
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

        {!isAnalyzing && !analysisResult && (
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