'use client'

import { useEffect, useState } from 'react'
import MatrixBackground from '@/components/MatrixBackground'
import Navigation from '@/components/portfolio/Navigation'
import PersonalInfoSection from '@/components/portfolio/PersonalInfoSection'
import SkillsSection from '@/components/portfolio/SkillsSection'
import EducationSection from '@/components/portfolio/EducationSection'
import JobHistorySection from '@/components/portfolio/JobHistorySection'
import ProjectsSection from '@/components/portfolio/ProjectsSection'
import { personalInfoApi, PersonalInfo } from '@/lib/api'

export default function Portfolio() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    fetchPersonalInfo()
    
    // Handle hash navigation when coming from project detail page
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        // Use a longer timeout to ensure page is fully rendered
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 300)
      }
    }
    
    // Check hash on mount (with delay to ensure page is loaded)
    setTimeout(() => {
      handleHashNavigation()
    }, 100)
    
    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation)
    return () => window.removeEventListener('hashchange', handleHashNavigation)
  }, [])

  const fetchPersonalInfo = async () => {
    try {
      const response = await personalInfoApi.getAll()
      if (response.data && response.data.length > 0) {
        setPersonalInfo(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching personal info:', error)
    }
  }


  useEffect(() => {
    // Add portfolio theme class to body
    document.body.classList.add('portfolio-theme')
    return () => {
      document.body.classList.remove('portfolio-theme')
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden portfolio-theme">
      <MatrixBackground />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-4 font-mono animate-pulse">
                &gt; Hello World
              </h1>
              <div className="h-1 w-32 bg-green-400 mx-auto mb-6"></div>
              {personalInfo ? (
                <>
                  <p className="text-xl md:text-2xl text-gray-300 font-mono">
                    // {personalInfo.name}
                  </p>
                  {personalInfo.workTitle && (
                    <p className="text-lg md:text-xl text-green-400 font-mono mt-2">
                      {'<'} {personalInfo.workTitle} {'/>'}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xl md:text-2xl text-gray-300 font-mono">
                  // Full Stack Developer
                </p>
              )}
              <p className="text-lg text-gray-400 font-mono mt-4">
                {'{'} Welcome to my digital space {'}'}
              </p>
            </div>
            <div className="mt-12">
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-block px-8 py-4 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors font-mono text-lg"
              >
                &gt; Explore Portfolio
              </a>
            </div>
          </div>
        </section>

        {/* Portfolio Sections */}
        <PersonalInfoSection />
        <SkillsSection />
        <EducationSection />
        <JobHistorySection />
        <ProjectsSection />

        {/* Footer */}
        <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-green-400/30">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 font-mono text-sm">
              {'//'} Built By Berkay Mustafa Arıkan
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
        </div>
        </footer>
      </main>
    </div>
  )
}