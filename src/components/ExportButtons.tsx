import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { UserInfo } from './UserInfoForm'

interface ExportButtonsProps {
  userInfo: UserInfo
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ userInfo }) => {
  const exportAsPDF = async () => {
    try {
      const element = document.getElementById('resume-content')
      if (!element) {
        toast.error('Resume content not found')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${userInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
      toast.success('PDF exported successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    }
  }

  const exportAsWord = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              // Header
              new Paragraph({
                children: [
                  new TextRun({
                    text: userInfo.fullName,
                    bold: true,
                    size: 32,
                  }),
                ],
                heading: HeadingLevel.TITLE,
                alignment: 'center',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: userInfo.jobTitle,
                    bold: true,
                    size: 24,
                    color: '6366f1',
                  }),
                ],
                alignment: 'center',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${userInfo.email} | ${userInfo.yearsOfExperience} years experience`,
                    size: 20,
                  }),
                ],
                alignment: 'center',
              }),
              new Paragraph({ text: '' }), // Empty line
              
              // Professional Summary
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Professional Summary',
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: userInfo.summary,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({ text: '' }), // Empty line
              
              // Experience Level
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Experience Level',
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${userInfo.yearsOfExperience} years of professional experience specialized in ${userInfo.jobTitle}`,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({ text: '' }), // Empty line
              
              // Key Skills
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Key Skills',
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Leadership • Communication • Problem Solving • Team Collaboration • Project Management • Strategic Planning',
                    size: 22,
                  }),
                ],
              }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${userInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`)
      toast.success('Word document exported successfully!')
    } catch (error) {
      console.error('Word export error:', error)
      toast.error('Failed to export Word document')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect rounded-3xl p-8 card-shadow"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
          <Download className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Export Resume</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={exportAsPDF}
          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:scale-105 transition-transform duration-200"
        >
          <FileText className="w-5 h-5" />
          <span>Export as PDF</span>
        </button>

        <button
          onClick={exportAsWord}
          className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:scale-105 transition-transform duration-200"
        >
          <FileText className="w-5 h-5" />
          <span>Export as Word</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ExportButtons