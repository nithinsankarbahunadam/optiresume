import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, Loader2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadedFiles {
  resume: File | null
  jobDescription: File | string | null
}

interface UploadSectionProps {
  uploadedFiles: UploadedFiles
  onFileUpload: (type: 'resume' | 'jobDescription', file: File | string) => void
  onAnalyze: () => void
  canAnalyze: boolean
  isAnalyzing: boolean
}

const UploadSection: React.FC<UploadSectionProps> = ({
  uploadedFiles,
  onFileUpload,
  onAnalyze,
  canAnalyze,
  isAnalyzing
}) => {
  // Handle resume file upload
  const onResumeDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      onFileUpload('resume', file)
      toast.success('Resume uploaded successfully!')
    }
  }, [onFileUpload])

  // Handle job description file upload
  const onJobDescriptionDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      onFileUpload('jobDescription', file)
      toast.success('Job description uploaded successfully!')
    }
  }, [onFileUpload])

  // Resume dropzone configuration
  const {
    getRootProps: getResumeRootProps,
    getInputProps: getResumeInputProps,
    isDragActive: isResumeDragActive
  } = useDropzone({
    onDropAccepted: onResumeDropAccepted,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  })

  // Job description dropzone configuration
  const {
    getRootProps: getJobDescriptionRootProps,
    getInputProps: getJobDescriptionInputProps,
    isDragActive: isJobDescriptionDragActive
  } = useDropzone({
    onDropAccepted: onJobDescriptionDropAccepted,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  // Handle text input for job description
  const handleJobDescriptionTextChange = (text: string) => {
    onFileUpload('jobDescription', text)
  }

  // Remove uploaded files
  const removeFile = (type: 'resume' | 'jobDescription') => {
    onFileUpload(type, type === 'resume' ? null : '')
    toast.success(`${type === 'resume' ? 'Resume' : 'Job description'} removed`)
  }

  return (
    <div className="space-y-8">
      {/* Upload sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Resume Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 card-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>
          </div>

          {uploadedFiles.resume ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-800">{uploadedFiles.resume.name}</p>
                    <p className="text-sm text-green-600">
                      {(uploadedFiles.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('resume')}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div
              {...getResumeRootProps()}
              className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isResumeDragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
              }`}
            >
              <input {...getResumeInputProps()} />
              <motion.div
                animate={{ y: isResumeDragActive ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {isResumeDragActive ? 'Drop your resume here!' : 'Upload Resume'}
                </p>
                <p className="text-gray-500 mb-2">
                  Drag & drop or click to select
                </p>
                <p className="text-sm text-gray-400">
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Job Description Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-3xl p-8 card-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
          </div>

          {/* Toggle between file upload and text input */}
          <div className="space-y-4">
            {uploadedFiles.jobDescription && typeof uploadedFiles.jobDescription === 'object' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-800">{uploadedFiles.jobDescription.name}</p>
                      <p className="text-sm text-green-600">
                        {(uploadedFiles.jobDescription.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('jobDescription')}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* File upload option */}
                <div
                  {...getJobDescriptionRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isJobDescriptionDragActive
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <input {...getJobDescriptionInputProps()} />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {isJobDescriptionDragActive ? 'Drop file here!' : 'Upload file'}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT</p>
                </div>

                <div className="text-center text-gray-500 font-medium">OR</div>

                {/* Text input option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste job description text
                  </label>
                  <textarea
                    value={typeof uploadedFiles.jobDescription === 'string' ? uploadedFiles.jobDescription : ''}
                    onChange={(e) => handleJobDescriptionTextChange(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {typeof uploadedFiles.jobDescription === 'string' ? uploadedFiles.jobDescription.length : 0} characters
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`px-12 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform flex items-center space-x-3 mx-auto ${
            canAnalyze
              ? 'gradient-bg hover:scale-105 hover:shadow-2xl animate-gradient'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing & Optimizing...</span>
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              <span>Analyze & Optimize</span>
            </>
          )}
        </button>

        {isAnalyzing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mt-4"
          >
            This usually takes 30-60 seconds...
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

export default UploadSection