'use client'

import { useEffect, useState } from 'react'
import { Code2, Star } from 'lucide-react'
import { professionalSkillsApi, ProfessionalSkill } from '@/lib/api'

export default function SkillsSection() {
  const [skills, setSkills] = useState<ProfessionalSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await professionalSkillsApi.getAll()
      setSkills(response.data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillLevelStars = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 1
      case 'INTERMEDIATE':
        return 2
      case 'ADVANCED':
        return 3
      default:
        return 0
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'text-yellow-400'
      case 'INTERMEDIATE':
        return 'text-blue-400'
      case 'ADVANCED':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (skills.length === 0) {
    return null
  }

  return (
    <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            &gt; skills.load()
          </h2>
          <div className="h-1 w-24 bg-green-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg p-6 hover:border-green-400 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400 font-mono">
                    {skill.skillName}
                  </h3>
                </div>
                <span className={`text-sm font-mono ${getSkillLevelColor(skill.skillLevel)}`}>
                  {skill.skillLevel}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < getSkillLevelStars(skill.skillLevel)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
