'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Image, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react'
import PersonalInfoManager from '@/components/PersonalInfoManager'
import ProjectsManager from '@/components/ProjectsManager'
import JobHistoryManager from '@/components/JobHistoryManager'
import EducationManager from '@/components/EducationManager'
import SkillsManager from '@/components/SkillsManager'
import ProjectDetailManager from '@/components/ProjectDetailManager'
import AdminSettings from '@/components/AdminSettings'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

type TabType = 'personal' | 'projects' | 'jobs' | 'education' | 'skills' | 'project-details' | 'admin-settings'

const tabs = [
  { id: 'personal' as TabType, label: 'Personal Info', icon: User },
  { id: 'projects' as TabType, label: 'Projects', icon: Code },
  { id: 'jobs' as TabType, label: 'Job History', icon: Briefcase },
  { id: 'education' as TabType, label: 'Education', icon: GraduationCap },
  { id: 'skills' as TabType, label: 'Skills', icon: Settings },
  { id: 'project-details' as TabType, label: 'Project Details', icon: Image },
  { id: 'admin-settings' as TabType, label: 'Admin Settings', icon: Shield },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const { logout } = useAuth()

  useEffect(() => {
    // Remove portfolio theme and add admin panel class
    document.body.classList.remove('portfolio-theme')
    document.body.classList.add('admin-panel')
    return () => {
      document.body.classList.remove('admin-panel')
    }
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoManager />
      case 'projects':
        return <ProjectsManager />
      case 'jobs':
        return <JobHistoryManager />
      case 'education':
        return <EducationManager />
      case 'skills':
        return <SkillsManager />
      case 'project-details':
        return <ProjectDetailManager />
      case 'admin-settings':
        return <AdminSettings />
      default:
        return <PersonalInfoManager />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 text-gray-900 admin-panel">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Manage your portfolio</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="card p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
