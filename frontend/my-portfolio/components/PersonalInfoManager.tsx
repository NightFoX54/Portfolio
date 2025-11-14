'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Upload, User } from 'lucide-react'
import { personalInfoApi, PersonalInfo } from '@/lib/api'

export default function PersonalInfoManager() {
  // Version 2.0 - Fixed file upload handling
  const [personalInfos, setPersonalInfos] = useState<PersonalInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PersonalInfo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null)
  const [selectedResume, setSelectedResume] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [resumePreview, setResumePreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PersonalInfo>()

  useEffect(() => {
    fetchPersonalInfos()
  }, [])

  const fetchPersonalInfos = async () => {
    try {
      setIsLoading(true)
      const response = await personalInfoApi.getAll()
      setPersonalInfos(response.data)
    } catch (error) {
      toast.error('Failed to fetch personal info')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: PersonalInfo) => {
    try {
      setIsUploading(true)
      
      if (editingItem) {
        // For editing, if no new files are selected, just update the data
        if (!selectedProfilePicture && !selectedResume) {
          await personalInfoApi.update(editingItem.id!, data)
          toast.success('Personal info updated successfully')
        } else {
          // Upload with new files using the update endpoint
          const formData = new FormData()
          formData.append('name', data.name)
          formData.append('email', data.email)
          formData.append('phone', data.phone)
          formData.append('address', data.address)
          formData.append('city', data.city)
          formData.append('state', data.state)
          formData.append('zip', data.zip)
          formData.append('country', data.country)
          formData.append('workTitle', data.workTitle || '')
          
          if (selectedProfilePicture) {
            formData.append('profilePicture', selectedProfilePicture)
          }
          if (selectedResume) {
            formData.append('resume', selectedResume)
          }
          
          await personalInfoApi.updateWithMedia(editingItem.id!, formData)
          toast.success('Personal info with media updated successfully')
        }
      } else {
        // For creating new, both files are required
        if (!selectedProfilePicture || !selectedResume) {
          toast.error('Please select both profile picture and resume')
          return
        }
        
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('phone', data.phone)
        formData.append('address', data.address)
        formData.append('city', data.city)
        formData.append('state', data.state)
        formData.append('zip', data.zip)
        formData.append('country', data.country)
        formData.append('workTitle', data.workTitle || '')
        formData.append('profilePicture', selectedProfilePicture)
        formData.append('resume', selectedResume)
        
        await personalInfoApi.createWithMedia(formData)
        toast.success('Personal info with media created successfully')
      }
      
      fetchPersonalInfos()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save personal info')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (item: PersonalInfo) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof PersonalInfo, item[key as keyof PersonalInfo])
    })
    // Set previews for existing files
    setProfilePicturePreview(item.profilePicture || null)
    setResumePreview(item.resume || null)
    setSelectedProfilePicture(null)
    setSelectedResume(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this personal info?')) return
    
    try {
      await personalInfoApi.delete(id)
      toast.success('Personal info deleted successfully')
      fetchPersonalInfos()
    } catch (error) {
      toast.error('Failed to delete personal info')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setSelectedProfilePicture(null)
    setSelectedResume(null)
    setProfilePicturePreview(null)
    setResumePreview(null)
    reset()
  }

  const handleFileSelect = (file: File, field: 'profilePicture' | 'resume') => {
    console.log('handleFileSelect called with:', file.name, field)
    if (!file) return

    if (field === 'profilePicture') {
      setSelectedProfilePicture(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setProfilePicturePreview(previewUrl)
      console.log('Profile picture selected:', file.name)
    } else {
      setSelectedResume(file)
      setResumePreview(file.name) // For resume, just show filename
      console.log('Resume selected:', file.name)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Personal Info
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {personalInfos.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {item.profilePicture && (
                    <img
                      src={item.profilePicture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.email}</p>
                    <p className="text-gray-600">{item.phone}</p>
                    <p className="text-gray-600">{item.address}, {item.city}, {item.state} {item.zip}</p>
                    {item.workTitle && <p className="text-gray-600">{item.workTitle}</p>}
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
              {editingItem ? 'Edit Personal Info' : 'Add Personal Info'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    {...register('name', { required: true })}
                    className="input"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="input"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    {...register('phone', { required: true })}
                    className="input"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Title
                  </label>
                  <input
                    {...register('workTitle')}
                    className="input"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    {...register('address', { required: true })}
                    className="input"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    {...register('city', { required: true })}
                    className="input"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    {...register('state', { required: true })}
                    className="input"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP *
                  </label>
                  <input
                    {...register('zip', { required: true })}
                    className="input"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    {...register('country', { required: true })}
                    className="input"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture {!editingItem && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file, 'profilePicture')
                    }}
                    className="input"
                    disabled={isUploading}
                  />
                  {profilePicturePreview && (
                    <div className="mt-2">
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedProfilePicture ? 'New file selected' : 'Current file'}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume (PDF) {!editingItem && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file, 'resume')
                    }}
                    className="input"
                    disabled={isUploading}
                  />
                  {resumePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {selectedResume ? `New file: ${resumePreview}` : `Current file: ${resumePreview}`}
                      </p>
                    </div>
                  )}
                </div>
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
                  disabled={isUploading || (!editingItem && (!selectedProfilePicture || !selectedResume))}
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
