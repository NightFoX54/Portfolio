'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Building, Calendar } from 'lucide-react'
import { jobHistoryApi, JobHistory } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function JobHistoryManager() {
  const [jobs, setJobs] = useState<JobHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<JobHistory | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCompanyLogo, setSelectedCompanyLogo] = useState<File | null>(null)
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<JobHistory>()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await jobHistoryApi.getAll()
      setJobs(response.data)
    } catch (error) {
      toast.error('Failed to fetch job history')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: JobHistory) => {
    try {
      setIsUploading(true)
      
      if (editingItem) {
        // For editing, if no new file is selected, just update the data
        if (!selectedCompanyLogo) {
          await jobHistoryApi.update(editingItem.id!, data)
          toast.success('Job history updated successfully')
        } else {
          // Upload with new file using the update endpoint
          const formData = new FormData()
          formData.append('companyName', data.companyName)
          formData.append('jobTitle', data.jobTitle)
          formData.append('startDate', data.startDate)
          if (data.endDate) {
            formData.append('endDate', data.endDate)
          }
          formData.append('isCurrent', data.isCurrent.toString())
          formData.append('description', data.description)
          formData.append('location', data.location)
          formData.append('displayOrder', data.displayOrder.toString())
          formData.append('companyLogo', selectedCompanyLogo)
          
          await jobHistoryApi.updateWithMedia(editingItem.id!, formData)
          toast.success('Job history with media updated successfully')
        }
      } else {
        // For creating new, file is optional
        if (selectedCompanyLogo) {
          const formData = new FormData()
          formData.append('companyName', data.companyName)
          formData.append('jobTitle', data.jobTitle)
          formData.append('startDate', data.startDate)
          if (data.endDate) {
            formData.append('endDate', data.endDate)
          }
          formData.append('isCurrent', data.isCurrent.toString())
          formData.append('description', data.description)
          formData.append('location', data.location)
          formData.append('displayOrder', data.displayOrder.toString())
          formData.append('companyLogo', selectedCompanyLogo)
          
          await jobHistoryApi.createWithMedia(formData)
          toast.success('Job history with media created successfully')
        } else {
          await jobHistoryApi.create(data)
          toast.success('Job history created successfully')
        }
      }
      
      fetchJobs()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save job history')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (item: JobHistory) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof JobHistory, item[key as keyof JobHistory])
    })
    // Set preview for existing logo
    setCompanyLogoPreview(item.companyLogo || null)
    setSelectedCompanyLogo(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job history?')) return
    
    try {
      await jobHistoryApi.delete(id)
      toast.success('Job history deleted successfully')
      fetchJobs()
    } catch (error) {
      toast.error('Failed to delete job history')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setSelectedCompanyLogo(null)
    setCompanyLogoPreview(null)
    reset()
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    setSelectedCompanyLogo(file)
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setCompanyLogoPreview(previewUrl)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Job History</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job History
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {item.companyLogo && (
                    <img
                      src={item.companyLogo}
                      alt={item.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold">{item.jobTitle}</h3>
                    </div>
                    <p className="text-gray-600 font-medium">{item.companyName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(item.startDate)} - {item.isCurrent ? 'Present' : formatDate(item.endDate)}
                        </span>
                      </div>
                      <span>{item.location}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-secondary flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="btn btn-danger flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Job History' : 'Add Job History'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    {...register('companyName', { required: true })}
                    className="input"
                    placeholder="Google Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    {...register('jobTitle', { required: true })}
                    className="input"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    {...register('startDate', { required: true })}
                    type="date"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date {!watch('isCurrent') && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    {...register('endDate', { 
                      required: !watch('isCurrent'),
                      validate: (value) => {
                        if (!watch('isCurrent') && !value) {
                          return 'End date is required for past jobs'
                        }
                        return true
                      }
                    })}
                    type="date"
                    className="input"
                    disabled={watch('isCurrent')}
                  />
                  {watch('isCurrent') && (
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty for current job
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    {...register('location', { required: true })}
                    className="input"
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order *
                  </label>
                  <input
                    {...register('displayOrder', { required: true, valueAsNumber: true })}
                    type="number"
                    className="input"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: true })}
                  className="input"
                  rows={3}
                  placeholder="Job responsibilities and achievements..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('isCurrent')}
                  type="checkbox"
                  className="rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Currently working here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className="input"
                  disabled={isUploading}
                />
                {companyLogoPreview && (
                  <div className="mt-2">
                    <img
                      src={companyLogoPreview}
                      alt="Company logo preview"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCompanyLogo ? 'New file selected' : 'Current file'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
