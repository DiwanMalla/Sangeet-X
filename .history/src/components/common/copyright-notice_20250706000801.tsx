'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AlertTriangle, 
  BookOpen, 
  Shield, 
  X,
  ExternalLink,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyrightNoticeProps {
  className?: string
}

export default function CopyrightNotice({ className }: CopyrightNoticeProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isVisible) return null

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:border-amber-800', className)}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Educational Purpose Only
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                This music streaming platform is created for{' '}
                <strong>educational and demonstration purposes only</strong>. All music content is used under fair use for educational purposes.
              </p>
              
              {isExpanded && (
                <div className="mt-3 space-y-2 text-xs text-amber-700 dark:text-amber-300">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Copyright Notice:</strong> All music, images, and content belong to their respective copyright holders. 
                      This platform does not claim ownership of any copyrighted material.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>No Commercial Use:</strong> This application is not intended for commercial distribution or profit. 
                      It serves as a learning project to demonstrate web development skills.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Content Sources:</strong> Sample music tracks are used from royalty-free sources or under fair use. 
                      Cover images are from Unsplash with proper attribution.
                    </p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-md mt-2">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      <strong>Important:</strong> If you are a copyright holder and wish to have your content removed, 
                      please contact us immediately. We respect intellectual property rights and will promptly address any concerns.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-amber-700 dark:text-amber-300 h-auto p-0 text-xs underline-offset-2"
                >
                  {isExpanded ? 'Show Less' : 'Read Full Copyright Notice'}
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/30 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Educational Banner Component for Footer
export function EducationalFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
              Educational Purpose
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This platform is designed for educational and learning purposes to demonstrate 
              modern web development techniques and music streaming interfaces.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-purple-600" />
              Copyright Compliance
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              All content is used under fair use for educational purposes. 
              We respect intellectual property rights and will address any copyright concerns promptly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2 text-purple-600" />
              Non-Commercial Use
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              This application is not intended for commercial use and serves purely as a 
              demonstration of technical skills and educational learning.
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 SangeetX - Educational Project. All rights reserved to respective copyright holders.
          </p>
        </div>
      </div>
    </footer>
  )
}
