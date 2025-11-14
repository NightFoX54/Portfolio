'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, ExternalLink, Image } from 'lucide-react'
import { projectsApi, Project } from '@/lib/api'
import RichTextEditor from './RichTextEditor'

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Project | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  const { register, handleSubmit, reset, setValue, watch } = useForm<Project>()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await projectsApi.getAll()
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: Project) => {
    try {
      setIsUploading(true)
      
      // Update the data with the rich text description
      const projectData = { ...data, projectDescription: description }
      
      if (editingItem) {
        // For editing, if no new file is selected, just update the data
        if (!selectedMediaFile) {
          await projectsApi.update(editingItem.id!, projectData)
          toast.success('Project updated successfully')
        } else {
          // Upload with new file using the update endpoint
          const formData = new FormData()
          formData.append('projectName', projectData.projectName)
          formData.append('projectDescription', projectData.projectDescription)
          formData.append('projectLink', projectData.projectLink)
          formData.append('projectLink2', projectData.projectLink2 || '')
          formData.append('projectLink3', projectData.projectLink3 || '')
          formData.append('projectContentType', projectData.projectContentType)
          formData.append('projectTechnologies', projectData.projectTechnologies)
          formData.append('displayOrder', projectData.displayOrder.toString())
          formData.append('mediaFile', selectedMediaFile)
          
          await projectsApi.updateWithMedia(editingItem.id!, formData)
          toast.success('Project with media updated successfully')
        }
      } else {
        // For creating new, file is optional
        if (selectedMediaFile) {
          const formData = new FormData()
          formData.append('projectName', projectData.projectName)
          formData.append('projectDescription', projectData.projectDescription)
          formData.append('projectLink', projectData.projectLink)
          formData.append('projectLink2', projectData.projectLink2 || '')
          formData.append('projectLink3', projectData.projectLink3 || '')
          formData.append('projectContentType', projectData.projectContentType)
          formData.append('projectTechnologies', projectData.projectTechnologies)
          formData.append('displayOrder', projectData.displayOrder.toString())
          formData.append('mediaFile', selectedMediaFile)
          
          await projectsApi.createWithMedia(formData)
          toast.success('Project with media created successfully')
        } else {
          await projectsApi.create(projectData)
          toast.success('Project created successfully')
        }
      }
      
      fetchProjects()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save project')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (item: Project) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof Project, item[key as keyof Project])
    })
    // Set the description for the rich text editor
    setDescription(item.projectDescription || '')
    // Set preview for existing media
    setMediaPreview(item.projectContent || null)
    setSelectedMediaFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      await projectsApi.delete(id)
      toast.success('Project deleted successfully')
      fetchProjects()
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setSelectedMediaFile(null)
    setMediaPreview(null)
    setDescription('')
    reset()
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    setSelectedMediaFile(file)
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="space-y-3">
                {item.projectContent && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {item.projectContentType === 'IMAGE' ? (
                      <img
                        src={item.projectContent}
                        alt={item.projectName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.projectContent}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold">{item.projectName}</h3>
                  <div 
                    className="text-gray-600 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.projectDescription }}
                  />
                  <p className="text-gray-500 text-xs mt-1">{item.projectTechnologies}</p>
                </div>

                <div className="flex items-center justify-end">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-secondary flex items-center text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="btn btn-danger flex items-center text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
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
              {editingItem ? 'Edit Project' : 'Add Project'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  {...register('projectName', { required: true })}
                  className="input"
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter project description with formatting..."
                  disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link *
                  </label>
                  <input
                    {...register('projectLink', { required: true })}
                    className="input"
                    placeholder="https://github.com/user/project"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link 2
                  </label>
                  <input
                    {...register('projectLink2')}
                    className="input"
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link 3
                  </label>
                  <input
                    {...register('projectLink3')}
                    className="input"
                    placeholder="https://docs.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type *
                  </label>
                  <select
                    {...register('projectContentType', { required: true })}
                    className="input"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies *
                  </label>
                  <input
                    {...register('projectTechnologies', { required: true })}
                    className="input"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media File (Image/Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className="input"
                  disabled={isUploading}
                />
                {mediaPreview && (
                  <div className="mt-2">
                    {watch('projectContentType') === 'IMAGE' ? (
                      <img
                        src={mediaPreview}
                        alt="Media preview"
                        className="w-32 h-20 rounded-lg object-cover border"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        className="w-32 h-20 rounded-lg object-cover border"
                        controls
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedMediaFile ? 'New file selected' : 'Current file'}
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
