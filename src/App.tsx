import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import TailorResultEditor from './components/TailorResultEditor'
import { ArrowLeft } from 'lucide-react'

// Types for our application state
interface UploadedFiles {
  resume: File | null
  jobDescription: File | string | null
}

function App() {
  // State management for the multi-step flow
  const [currentStep, setCurrentStep] = useState<'upload' | 'result'>('upload')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    resume: null,
    jobDescription: null
  })
  const [tailoredResume, setTailoredResume] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Handle file uploads from UploadSection
  const handleFileUpload = (type: 'resume' | 'jobDescription', file: File | string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }

  // Simulate the analyze and optimize process
  const handleAnalyzeAndOptimize = async () => {
    if (!uploadedFiles.resume || !uploadedFiles.jobDescription) {
      return
    }

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate dummy tailored resume content
    const dummyTailoredResume = `
      <h2>John Doe</h2>
      <p><strong>Email:</strong> john.doe@email.com | <strong>Phone:</strong> (555) 123-4567</p>
      <p><strong>LinkedIn:</strong> linkedin.com/in/johndoe</p>
      
      <h3>Professional Summary</h3>
      <p>Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.</p>
      
      <h3>Technical Skills</h3>
      <ul>
        <li><strong>Frontend:</strong> React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS</li>
        <li><strong>Backend:</strong> Node.js, Express.js, Python, RESTful APIs</li>
        <li><strong>Database:</strong> PostgreSQL, MongoDB, Redis</li>
        <li><strong>Cloud & DevOps:</strong> AWS, Docker, Kubernetes, CI/CD</li>
        <li><strong>Tools:</strong> Git, Jest, Webpack, Vite</li>
      </ul>
      
      <h3>Professional Experience</h3>
      
      <h4>Senior Software Engineer | TechCorp Inc. | 2021 - Present</h4>
      <ul>
        <li>Led development of a React-based dashboard that increased user engagement by 40%</li>
        <li>Architected and implemented microservices using Node.js and Docker, reducing system latency by 25%</li>
        <li>Mentored 3 junior developers and established code review processes</li>
        <li>Collaborated with product managers to define technical requirements and project timelines</li>
      </ul>
      
      <h4>Software Engineer | StartupXYZ | 2019 - 2021</h4>
      <ul>
        <li>Built responsive web applications using React and TypeScript</li>
        <li>Developed RESTful APIs with Express.js and PostgreSQL</li>
        <li>Implemented automated testing strategies, achieving 90% code coverage</li>
        <li>Optimized application performance, reducing load times by 30%</li>
      </ul>
      
      <h3>Education</h3>
      <p><strong>Bachelor of Science in Computer Science</strong><br>
      University of Technology | 2015 - 2019</p>
      
      <h3>Certifications</h3>
      <ul>
        <li>AWS Certified Solutions Architect</li>
        <li>React Developer Certification</li>
      </ul>
    `

    setTailoredResume(dummyTailoredResume)
    setIsAnalyzing(false)
    setCurrentStep('result')
  }

  // Handle going back to upload step
  const handleBackToUpload = () => {
    setCurrentStep('upload')
    setTailoredResume('')
  }

  // Check if analyze button should be enabled
  const canAnalyze = uploadedFiles.resume && uploadedFiles.jobDescription && !isAnalyzing

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            AI Resume Tailor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your resume with AI-powered optimization in 3 simple steps
          </p>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-purple-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                currentStep === 'upload' ? 'bg-purple-600' : 'bg-green-600'
              }`}>
                1
              </div>
              <span className="font-medium">Upload</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep === 'result' ? 'bg-green-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'result' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                currentStep === 'result' ? 'bg-purple-600' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className="font-medium">Edit & Export</span>
            </div>
          </div>
        </motion.div>

        {/* Step content with animations */}
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <UploadSection
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onAnalyze={handleAnalyzeAndOptimize}
                canAnalyze={canAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back button */}
              <div className="mb-6">
                <button
                  onClick={handleBackToUpload}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Upload</span>
                </button>
              </div>

              <TailorResultEditor
                content={tailoredResume}
                onChange={setTailoredResume}
                originalFilename={uploadedFiles.resume?.name || 'resume'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App