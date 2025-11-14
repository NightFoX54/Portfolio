'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Calendar, MapPin, Building } from 'lucide-react'
import { jobHistoryApi, JobHistory } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function JobHistorySection() {
  const [jobs, setJobs] = useState<JobHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobHistoryApi.getAll()
      setJobs(response.data || [])
    } catch (error) {
      console.error('Error fetching job history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id="experience" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (jobs.length === 0) {
    return null
  }

  return (
    <section id="experience" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            &gt; experience.run()
          </h2>
          <div className="h-1 w-24 bg-green-400 mx-auto"></div>
        </div>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-black/70 backdrop-blur-sm border-2 border-green-400/30 rounded-lg p-6 hover:border-green-400 transition-colors shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {job.companyLogo && (
                  <div className="flex-shrink-0">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-green-400/30"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-green-400 mb-1 font-mono">
                        {job.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <Building className="w-4 h-4 text-green-400" />
                        <span className="font-mono text-lg">{job.companyName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm">
                        {formatDate(job.startDate)} - {job.isCurrent ? 'Present' : formatDate(job.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm">{job.location}</span>
                    </div>
                  </div>
                  {job.description && (
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                      {job.description}
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
