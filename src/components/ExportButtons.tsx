import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

interface ExportButtonsProps {
  content: string
  originalFilename: string
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ content, originalFilename }) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingWord, setIsExportingWord] = useState(false)

  // Generate filename without extension
  const getBaseFilename = () => {
    return originalFilename.replace(/\.[^/.]+$/, '') + '_tailored'
  }

  // Convert HTML content to plain text for Word export
  const htmlToPlainText = (html: string): string => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  // Parse HTML content for structured Word document
  const parseHTMLForWord = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const elements: any[] = []

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (text) {
          elements.push(new Paragraph({
            children: [new TextRun(text)]
          }))
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        const tagName = element.tagName.toLowerCase()
        const text = element.textContent?.trim()

        if (!text) return

        switch (tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
            elements.push(new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 }
            }))
            break
          case 'p':
            elements.push(new Paragraph({
              children: [new TextRun(text)],
              spacing: { after: 120 }
            }))
            break
          case 'li':
            elements.push(new Paragraph({
              children: [new TextRun(`• ${text}`)],
              spacing: { after: 80 }
            }))
            break
          case 'strong':
          case 'b':
            elements.push(new Paragraph({
              children: [new TextRun({ text: text, bold: true })],
              spacing: { after: 120 }
            }))
            break
          default:
            if (text && !['ul', 'ol', 'div'].includes(tagName)) {
              elements.push(new Paragraph({
                children: [new TextRun(text)],
                spacing: { after: 120 }
              }))
            }
        }
      }

      // Process child nodes
      node.childNodes.forEach(processNode)
    }

    doc.body.childNodes.forEach(processNode)
    return elements
  }

  // Export as PDF using html2canvas and jsPDF
  const exportAsPDF = async () => {
    setIsExportingPDF(true)
    
    try {
      // Create a temporary div with the content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      tempDiv.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 800px;
        padding: 40px;
        background: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      `
      
      // Style the content for better PDF appearance
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach(heading => {
        ;(heading as HTMLElement).style.cssText = `
          color: #2563eb;
          margin: 20px 0 10px 0;
          font-weight: bold;
        `
      })

      const paragraphs = tempDiv.querySelectorAll('p')
      paragraphs.forEach(p => {
        ;(p as HTMLElement).style.cssText = `
          margin: 10px 0;
        `
      })

      const lists = tempDiv.querySelectorAll('ul, ol')
      lists.forEach(list => {
        ;(list as HTMLElement).style.cssText = `
          margin: 10px 0;
          padding-left: 20px;
        `
      })

      document.body.appendChild(tempDiv)

      // Generate canvas from the content
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Remove temporary div
      document.body.removeChild(tempDiv)

      // Create PDF
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

      // Save the PDF
      pdf.save(`${getBaseFilename()}.pdf`)
      toast.success('PDF exported successfully!')
      
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF. Please try again.')
    } finally {
      setIsExportingPDF(false)
    }
  }

  // Export as Word document
  const exportAsWord = async () => {
    setIsExportingWord(true)
    
    try {
      // Parse HTML content into Word document structure
      const paragraphs = parseHTMLForWord(content)
      
      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.length > 0 ? paragraphs : [
            new Paragraph({
              children: [new TextRun(htmlToPlainText(content))]
            })
          ]
        }]
      })

      // Generate and save the document
      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${getBaseFilename()}.docx`)
      toast.success('Word document exported successfully!')
      
    } catch (error) {
      console.error('Word export error:', error)
      toast.error('Failed to export Word document. Please try again.')
    } finally {
      setIsExportingWord(false)
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
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
          <Download className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Export Your Resume</h3>
      </div>

      <p className="text-gray-600 mb-8">
        Download your tailored resume in your preferred format. Both formats maintain professional formatting.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportAsPDF}
          disabled={isExportingPDF}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
            isExportingPDF
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            {isExportingPDF ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <FileText className="w-8 h-8 text-red-600" />
            )}
            <h4 className={`text-xl font-bold ${isExportingPDF ? 'text-gray-400' : 'text-red-700'}`}>
              Download as PDF
            </h4>
          </div>
          <p className={`text-sm ${isExportingPDF ? 'text-gray-400' : 'text-red-600'}`}>
            {isExportingPDF ? 'Generating PDF...' : 'Perfect for online applications and ATS systems'}
          </p>
        </motion.button>

        {/* Word Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportAsWord}
          disabled={isExportingWord}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
            isExportingWord
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            {isExportingWord ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <FileText className="w-8 h-8 text-blue-600" />
            )}
            <h4 className={`text-xl font-bold ${isExportingWord ? 'text-gray-400' : 'text-blue-700'}`}>
              Download as Word
            </h4>
          </div>
          <p className={`text-sm ${isExportingWord ? 'text-gray-400' : 'text-blue-600'}`}>
            {isExportingWord ? 'Generating Word document...' : 'Easy to edit and customize further'}
          </p>
        </motion.button>
      </div>

      {/* Export tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200"
      >
        <h5 className="font-semibold text-yellow-800 mb-2">💡 Export Tips:</h5>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• PDF format is recommended for most job applications</li>
          <li>• Word format allows for easy customization and editing</li>
          <li>• Both formats maintain professional formatting</li>
          <li>• Always review the exported file before submitting</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default ExportButtons