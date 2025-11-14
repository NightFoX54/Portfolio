'use client'

import { useEffect, useState } from 'react'
import { Code, ExternalLink, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { projectsApi, Project } from '@/lib/api'

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll()
      setProjects(response.data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            &gt; projects.list()
          </h2>
          <div className="h-1 w-24 bg-green-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg overflow-hidden hover:border-green-400 transition-all shadow-lg hover:shadow-green-400/20 cursor-pointer group"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              {project.projectContent && (
                <div className="aspect-video bg-gray-900 overflow-hidden">
                  {project.projectContentType === 'IMAGE' ? (
                    <img
                      src={project.projectContent}
                      alt={project.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={project.projectContent}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400 font-mono">
                    {project.projectName}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-4 font-mono line-clamp-3">
                  {(() => {
                    const plainText = project.projectDescription.replace(/<[^>]*>/g, '')
                    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
                  })()}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.projectTechnologies.split(',').map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded font-mono"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {project.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/projects/${project.id}`)
                    }}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 font-mono text-sm transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
