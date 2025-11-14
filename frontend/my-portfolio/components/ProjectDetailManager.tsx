'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Image, FileText, Video, Filter } from 'lucide-react'
import { projectDetailContentApi, projectsApi, ProjectDetailContent, Project } from '@/lib/api'
import RichTextEditor from './RichTextEditor'

export default function ProjectDetailManager() {
  const [projectDetails, setProjectDetails] = useState<ProjectDetailContent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProjectDetailContent | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [textContent, setTextContent] = useState('')

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProjectDetailContent>()

  useEffect(() => {
    fetchProjectDetails()
    fetchProjects()
  }, [])

  // Set default content type when modal opens
  useEffect(() => {
    if (isModalOpen && !editingItem) {
      setValue('projectDetailContentType', 'TEXT')
    }
  }, [isModalOpen, editingItem, setValue])

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true)
      const response = await projectDetailContentApi.getAll()
      setProjectDetails(response.data)
    } catch (error) {
      toast.error('Failed to fetch project details')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll()
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const onSubmit = async (data: ProjectDetailContent) => {
    try {
      setIsUploading(true)
      
      // Update the data with the rich text content for TEXT type
      const projectDetailData = { 
        ...data, 
        projectDetailContent: data.projectDetailContentType === 'TEXT' ? textContent : data.projectDetailContent 
      }
      
      if (editingItem) {
        // For editing, if no new file is selected, just update the data
        if (!selectedMediaFile) {
          await projectDetailContentApi.update(editingItem.id!, projectDetailData)
          toast.success('Project detail updated successfully')
        } else {
          // Upload with new file using the update endpoint
          const formData = new FormData()
          formData.append('projectId', projectDetailData.projectId)
          formData.append('projectDetailContentType', projectDetailData.projectDetailContentType)
          formData.append('displayOrder', projectDetailData.displayOrder.toString())
          
          if (projectDetailData.projectDetailContentType === 'TEXT') {
            formData.append('textContent', projectDetailData.projectDetailContent)
          } else {
            formData.append('mediaFile', selectedMediaFile)
          }
          
          await projectDetailContentApi.updateWithMedia(editingItem.id!, formData)
          toast.success('Project detail with media updated successfully')
        }
      } else {
        // For creating new
        if (projectDetailData.projectDetailContentType === 'TEXT') {
          await projectDetailContentApi.create(projectDetailData)
          toast.success('Project detail created successfully')
        } else {
          // Upload with new file using the create endpoint
          const formData = new FormData()
          formData.append('projectId', projectDetailData.projectId)
          formData.append('projectDetailContentType', projectDetailData.projectDetailContentType)
          formData.append('displayOrder', projectDetailData.displayOrder.toString())
          formData.append('mediaFile', selectedMediaFile!)
          
          await projectDetailContentApi.createWithMedia(formData)
          toast.success('Project detail with media created successfully')
        }
      }
      
      fetchProjectDetails()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save project detail')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (item: ProjectDetailContent) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof ProjectDetailContent, item[key as keyof ProjectDetailContent])
    })
    // Set the text content for the rich text editor
    setTextContent(item.projectDetailContentType === 'TEXT' ? item.projectDetailContent : '')
    // Set preview for existing media
    if (item.projectDetailContentType !== 'TEXT') {
      setMediaPreview(item.projectDetailContent)
    }
    setSelectedMediaFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project detail?')) return
    
    try {
      await projectDetailContentApi.delete(id)
      toast.success('Project detail deleted successfully')
      fetchProjectDetails()
    } catch (error) {
      toast.error('Failed to delete project detail')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setSelectedMediaFile(null)
    setMediaPreview(null)
    setTextContent('')
    reset()
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    setSelectedMediaFile(file)
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.projectName : 'Unknown Project'
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'TEXT':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'IMAGE':
        return <Image className="w-5 h-5 text-green-500" />
      case 'VIDEO':
        return <Video className="w-5 h-5 text-purple-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const renderContent = (item: ProjectDetailContent) => {
    if (item.projectDetailContentType === 'TEXT') {
      return (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div 
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.projectDetailContent }}
          />
        </div>
      )
    } else if (item.projectDetailContentType === 'IMAGE') {
      return (
        <img
          src={item.projectDetailContent}
          alt="Project detail"
          className="w-full h-48 object-cover rounded-lg"
        />
      )
    } else if (item.projectDetailContentType === 'VIDEO') {
      return (
        <video
          src={item.projectDetailContent}
          className="w-full h-48 object-cover rounded-lg"
          controls
        />
      )
    }
    return null
  }

  // Filter and sort project details
  const filteredAndSortedDetails = projectDetails
    .filter(item => !selectedProject || item.projectId === selectedProject)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project Detail
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Filter by Project:</label>
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input w-64"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedDetails.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getContentIcon(item.projectDetailContentType)}
                    <span className="font-medium">{getProjectName(item.projectId)}</span>
                    <span className="text-sm text-gray-500">
                      ({item.projectDetailContentType})
                    </span>
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
                
                {renderContent(item)}
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
              {editingItem ? 'Edit Project Detail' : 'Add Project Detail'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project *
                  </label>
                  <select
                    {...register('projectId', { required: true })}
                    className="input"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type *
                  </label>
                  <select
                    {...register('projectDetailContentType', { required: true })}
                    className="input"
                  >
                    <option value="TEXT">Text</option>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
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
                  Content *
                </label>
                {watch('projectDetailContentType') === 'TEXT' ? (
                  <RichTextEditor
                    value={textContent}
                    onChange={setTextContent}
                    placeholder="Enter text content with formatting..."
                    disabled={isUploading}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept={watch('projectDetailContentType') === 'IMAGE' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                      }}
                      className="input"
                      disabled={isUploading}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload {watch('projectDetailContentType')?.toLowerCase()} file
                    </p>
                    {mediaPreview && (
                      <div className="mt-2">
                        {watch('projectDetailContentType') === 'IMAGE' ? (
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
