import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

interface HeaderProps {
  onNavigate?: (page: string) => void
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate?.('home')}
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <Zap className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              AI Resume Tailor
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate?.('features')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => onNavigate?.('how-it-works')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              How it Works
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default Header