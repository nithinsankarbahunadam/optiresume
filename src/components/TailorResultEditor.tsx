import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { CheckCircle, Edit3 } from 'lucide-react'
import ExportButtons from './ExportButtons'

interface TailorResultEditorProps {
  content: string
  onChange: (content: string) => void
  originalFilename: string
}

const TailorResultEditor: React.FC<TailorResultEditorProps> = ({
  content,
  onChange,
  originalFilename
}) => {
  const [isEditing, setIsEditing] = useState(false)

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link'
  ]

  return (
    <div className="space-y-8">
      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-3xl p-8 card-shadow text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h2 className="text-3xl font-bold gradient-text">
            Tailored Resume Generated! 🎉
          </h2>
        </div>
        <p className="text-gray-600 text-lg">
          Your resume has been optimized for the job description. You can edit it below and export when ready.
        </p>
      </motion.div>

      {/* Resume Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-effect rounded-3xl p-8 card-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Your Tailored Resume</h3>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
              isEditing 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {isEditing ? 'Done Editing' : 'Edit Mode'}
          </button>
        </div>

        {/* Rich text editor */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onChange}
            modules={modules}
            formats={formats}
            readOnly={!isEditing}
            className={`${!isEditing ? 'read-only-quill' : ''}`}
            style={{ 
              minHeight: '500px',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Editor tips */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">Editing Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use headers to organize sections (Professional Summary, Experience, etc.)</li>
              <li>• Bold important keywords and achievements</li>
              <li>• Use bullet points for easy scanning</li>
              <li>• Keep formatting consistent throughout</li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ExportButtons 
          content={content}
          originalFilename={originalFilename}
        />
      </motion.div>
    </div>
  )
}

export default TailorResultEditor