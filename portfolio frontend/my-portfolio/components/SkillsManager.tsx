'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { professionalSkillsApi, ProfessionalSkill } from '@/lib/api'

export default function SkillsManager() {
  const [skills, setSkills] = useState<ProfessionalSkill[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProfessionalSkill | null>(null)

  const { register, handleSubmit, reset, setValue } = useForm<ProfessionalSkill>()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await professionalSkillsApi.getAll()
      setSkills(response.data)
    } catch (error) {
      toast.error('Failed to fetch skills')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfessionalSkill) => {
    try {
      if (editingItem) {
        await professionalSkillsApi.update(editingItem.id!, data)
        toast.success('Skill updated successfully')
      } else {
        await professionalSkillsApi.create(data)
        toast.success('Skill created successfully')
      }
      fetchSkills()
      handleCloseModal()
    } catch (error) {
      toast.error('Failed to save skill')
    }
  }

  const handleEdit = (item: ProfessionalSkill) => {
    setEditingItem(item)
    Object.keys(item).forEach(key => {
      setValue(key as keyof ProfessionalSkill, item[key as keyof ProfessionalSkill])
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    try {
      await professionalSkillsApi.delete(id)
      toast.success('Skill deleted successfully')
      fetchSkills()
    } catch (error) {
      toast.error('Failed to delete skill')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    reset()
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-yellow-100 text-yellow-800'
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800'
      case 'ADVANCED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Professional Skills</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.skillName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(item.skillLevel)}`}>
                    {item.skillLevel}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < getSkillLevelStars(item.skillLevel)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
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
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Skill' : 'Add Skill'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name *
                </label>
                <input
                  {...register('skillName', { required: true })}
                  className="input"
                  placeholder="JavaScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level *
                </label>
                <select
                  {...register('skillLevel', { required: true })}
                  className="input"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
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
