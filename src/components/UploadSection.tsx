import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { FileUploadProps } from '../types'

const UploadSection: React.FC<FileUploadProps> = ({ file, onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      onFileSelect(selectedFile)
      toast.success('Resume uploaded successfully!')
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  })

  const removeFile = () => {
    onFileSelect(null)
    toast.success('File removed')
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-3xl p-8 card-shadow h-full flex flex-col"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>
      </div>

      <div className="flex-1 flex flex-col">
        {file ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex-1 flex items-center justify-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex-1 flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
            }`}
            style={{ minHeight: '280px' }}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: isDragActive ? -10 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {isDragActive ? 'Drop your resume here!' : 'Upload your resume'}
              </p>
              <p className="text-gray-500 mb-4">
                Drag & drop or click to select your resume file
              </p>
              <p className="text-sm text-gray-400">
                Supports PDF, DOC, and DOCX files (max 10MB)
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default UploadSection