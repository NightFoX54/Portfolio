'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { User, Lock, Settings, Save } from 'lucide-react'
import { authApi, tokenManager } from '@/lib/auth'

interface ChangePasswordForm {
  newPassword: string
  confirmPassword: string
}

interface ChangeUsernameForm {
  newUsername: string
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'password' | 'username'>('password')
  const [isLoading, setIsLoading] = useState(false)
  
  const passwordForm = useForm<ChangePasswordForm>()
  const usernameForm = useForm<ChangeUsernameForm>()

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const currentUsername = tokenManager.getUsername()
    if (!currentUsername) {
      toast.error('Unable to get current username')
      return
    }

    try {
      setIsLoading(true)
      await authApi.changePassword({
        username: currentUsername,
        newPassword: data.newPassword
      })
      toast.success('Password changed successfully!')
      passwordForm.reset()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const onUsernameSubmit = async (data: ChangeUsernameForm) => {
    const currentUsername = tokenManager.getUsername()
    if (!currentUsername) {
      toast.error('Unable to get current username')
      return
    }

    try {
      setIsLoading(true)
      await authApi.changeUsername({
        oldUsername: currentUsername,
        newUsername: data.newUsername
      })
      // Update stored username
      tokenManager.setUsername(data.newUsername)
      toast.success('Username changed successfully!')
      usernameForm.reset()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change username')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('username')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'username'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Change Username
          </button>
        </nav>
      </div>

      {/* Password Change Form */}
      {activeTab === 'password' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                {...passwordForm.register('newPassword', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                type="password"
                className="input"
                placeholder="Enter new password"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                {...passwordForm.register('confirmPassword', { 
                  required: 'Please confirm your password'
                })}
                type="password"
                className="input"
                placeholder="Confirm new password"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Username Change Form */}
      {activeTab === 'username' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Username</h3>
          <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Username *
              </label>
              <input
                {...usernameForm.register('newUsername', { 
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
                type="text"
                className="input"
                placeholder="Enter new username"
              />
              {usernameForm.formState.errors.newUsername && (
                <p className="mt-1 text-sm text-red-600">
                  {usernameForm.formState.errors.newUsername.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Username'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
