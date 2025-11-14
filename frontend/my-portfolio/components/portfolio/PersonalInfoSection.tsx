'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Download, Code } from 'lucide-react'
import { personalInfoApi, PersonalInfo } from '@/lib/api'

export default function PersonalInfoSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPersonalInfo()
  }, [])

  const fetchPersonalInfo = async () => {
    try {
      const response = await personalInfoApi.getAll()
      if (response.data && response.data.length > 0) {
        setPersonalInfo(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching personal info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!personalInfo) {
    return null
  }

  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            &gt; about_me.init()
          </h2>
          <div className="h-1 w-24 bg-green-400 mx-auto"></div>
        </div>

        <div className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {personalInfo.profilePicture && (
              <div className="flex-shrink-0">
                <img
                  src={personalInfo.profilePicture}
                  alt={personalInfo.name}
                  className="w-48 h-48 rounded-full border-4 border-green-400 object-cover shadow-lg"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-bold text-green-400 font-mono">
                {personalInfo.name}
              </h3>
              {personalInfo.workTitle && (
                <p className="text-xl text-gray-300 font-mono">
                  {'// ' + personalInfo.workTitle}
                </p>
              )}
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="font-mono">{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="font-mono">{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="font-mono">
                    {personalInfo.address}, {personalInfo.city}, {personalInfo.state} {personalInfo.zip}, {personalInfo.country}
                  </span>
                </div>
              </div>
              {personalInfo.resume && (
                <a
                  href={personalInfo.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-300 transition-colors font-mono"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
