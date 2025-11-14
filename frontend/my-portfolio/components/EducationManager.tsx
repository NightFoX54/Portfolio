'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react'
import { educationHistoryApi, EducationHistory } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function EducationManager() {
  const [educations, setEducations] = useState<EducationHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EducationHistory | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<EducationHistory>()

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      setIsLoading(true)
      const response = await educationHistoryApi.getAll()
      setEducations(response.data)
    } catch (error) {
      toast.error('Failed to fetch education history')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: EducationHistory) => {
    try {
      if (editingItem) {
        await educationHistoryApi.update(editingItem.id!, data)
        toast.success('Education updated successfully')
      } else {
        await educationHistoryApi.create(data)
        toast.success('Education created successfully')
      }
      fetchEducations()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save education')
    }
  }

  const handleEdit = (item: EducationHistory) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof EducationHistory, item[key as keyof EducationHistory])
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return
    
    try {
      await educationHistoryApi.delete(id)
      toast.success('Education deleted successfully')
      fetchEducations()
    } catch (error) {
      toast.error('Failed to delete education')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    reset()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Education History</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {educations.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.degree}</h3>
                      <span className="text-sm text-gray-500">in {item.fieldOfStudy}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{item.schoolName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(item.startDate)} - {item.isCurrent ? 'Present' : (item.endDate ? formatDate(item.endDate) : 'Present')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <span>GPA: {item.gpa}</span>
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
              {editingItem ? 'Edit Education' : 'Add Education'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name *
                  </label>
                  <input
                    {...register('schoolName', { required: true })}
                    className="input"
                    placeholder="Harvard University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree *
                  </label>
                  <input
                    {...register('degree', { required: true })}
                    className="input"
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study *
                  </label>
                  <input
                    {...register('fieldOfStudy', { required: true })}
                    className="input"
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA *
                  </label>
                  <input
                    {...register('gpa', { required: true })}
                    className="input"
                    placeholder="3.85"
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
                          return 'End date is required for past education'
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
                      Leave empty for current education
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
                    placeholder="Cambridge, MA"
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
                  placeholder="Academic achievements and coursework..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('isCurrent')}
                  type="checkbox"
                  className="rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Currently studying here
                </label>
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
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
