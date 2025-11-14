'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Code, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { projectsApi, projectDetailContentApi, Project, ProjectDetailContent } from '@/lib/api'
import MatrixBackground from '@/components/MatrixBackground'
import Navigation from '@/components/portfolio/Navigation'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [projectDetails, setProjectDetails] = useState<ProjectDetailContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add portfolio theme class to body
    document.body.classList.add('portfolio-theme')
    return () => {
      document.body.classList.remove('portfolio-theme')
    }
  }, [])

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchProjectDetails()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await projectsApi.getById(projectId)
      setProject(response.data)
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }

  const fetchProjectDetails = async () => {
    try {
      const response = await projectDetailContentApi.getByProjectId(projectId)
      const sortedDetails = (response.data || []).sort((a, b) => a.displayOrder - b.displayOrder)
      setProjectDetails(sortedDetails)
    } catch (error) {
      console.error('Error fetching project details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = (detail: ProjectDetailContent) => {
    if (detail.projectDetailContentType === 'TEXT') {
      return (
        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <div 
            className="text-gray-300 font-mono leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: detail.projectDetailContent }}
          />
        </div>
      )
    } else if (detail.projectDetailContentType === 'IMAGE') {
      return (
        <div className="bg-black/50 border border-green-400/20 rounded-lg overflow-hidden">
          <img
            src={detail.projectDetailContent}
            alt="Project detail"
            className="w-full h-auto object-contain"
          />
        </div>
      )
    } else if (detail.projectDetailContentType === 'VIDEO') {
      return (
        <div className="bg-black/50 border border-green-400/20 rounded-lg overflow-hidden">
          <video
            src={detail.projectDetailContent}
            className="w-full h-auto"
            controls
            playsInline
          />
        </div>
      )
    }
    return null
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'TEXT':
        return <FileText className="w-5 h-5 text-blue-400" />
      case 'IMAGE':
        return <ImageIcon className="w-5 h-5 text-green-400" />
      case 'VIDEO':
        return <Video className="w-5 h-5 text-purple-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-black text-white portfolio-theme">
        <MatrixBackground />
        <Navigation />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="relative min-h-screen bg-black text-white portfolio-theme">
        <MatrixBackground />
        <Navigation />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
              &gt; Project not found
            </h2>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors font-mono"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white portfolio-theme">
      <MatrixBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        {/* Project Header */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.push('/#projects')}
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-8 font-mono"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Projects
            </button>

            <div className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg p-8 shadow-2xl mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {project.projectContent && (
                  <div className="flex-shrink-0 lg:w-1/2">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-green-400/30">
                      {project.projectContentType === 'IMAGE' ? (
                        <img
                          src={project.projectContent}
                          alt={project.projectName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={project.projectContent}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-6 h-6 text-green-400" />
                    <h1 className="text-4xl font-bold text-green-400 font-mono">
                      {project.projectName}
                    </h1>
                  </div>
                  <div 
                    className="text-gray-300 mb-6 font-mono leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.projectDescription }}
                  />
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.projectTechnologies.split(',').map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-400/20 text-green-400 text-sm rounded font-mono border border-green-400/30"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {project.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors font-mono"
                      >
                        <ExternalLink className="w-5 h-5" />
                        View Project
                      </a>
                    )}
                    {project.projectLink2 && (
                      <a
                        href={project.projectLink2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-black/50 border-2 border-green-400/50 text-green-400 font-bold rounded hover:border-green-400 transition-colors font-mono"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Demo
                      </a>
                    )}
                    {project.projectLink3 && (
                      <a
                        href={project.projectLink3}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-black/50 border-2 border-green-400/50 text-green-400 font-bold rounded hover:border-green-400 transition-colors font-mono"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Docs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
                &gt; project.details()
              </h2>
              <div className="h-1 w-24 bg-green-400 mx-auto"></div>
            </div>

            {projectDetails.length > 0 ? (
              <div className="space-y-8">
                {projectDetails.map((detail, index) => (
                  <div key={detail.id} className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      {getContentIcon(detail.projectDetailContentType)}
                      <span className="text-green-400 font-mono text-sm">
                        Detail #{index + 1} ({detail.projectDetailContentType})
                      </span>
                    </div>
                    {renderContent(detail)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/50 border border-green-400/20 rounded-lg">
                <p className="text-gray-400 font-mono">
                  {'//'} No project details available yet
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-green-400/30 mt-20">
          <div className="max-w-6xl mx-auto text-center">
            <button
              onClick={() => router.push('/#projects')}
              className="px-6 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors font-mono mb-4"
            >
              View All Projects
            </button>
            <p className="text-gray-400 font-mono text-sm">
              {'//'} Back to portfolio
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
