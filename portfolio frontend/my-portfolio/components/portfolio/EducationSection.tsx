'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'
import { educationHistoryApi, EducationHistory } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function EducationSection() {
  const [educations, setEducations] = useState<EducationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      const response = await educationHistoryApi.getAll()
      setEducations(response.data || [])
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id="education" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (educations.length === 0) {
    return null
  }

  return (
    <section id="education" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            &gt; education.history()
          </h2>
          <div className="h-1 w-24 bg-green-400 mx-auto"></div>
        </div>

        <div className="space-y-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg p-6 hover:border-green-400 transition-colors shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                    {edu.degree}
                  </h3>
                  <p className="text-xl text-gray-300 mb-2 font-mono">
                    {edu.fieldOfStudy}
                  </p>
                  <p className="text-lg text-gray-400 mb-4 font-mono">
                    {edu.schoolName}
                  </p>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm">
                        {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm">{edu.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm">GPA: {edu.gpa}</span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
