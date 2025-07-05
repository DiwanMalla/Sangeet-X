'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Settings,
  Save,
  Database,
  Cloud,
  Shield,
  Mail,
  Globe,
  Palette,
  Bell,
  Key,
  Users,
  Music
} from 'lucide-react'

interface SettingsData {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    timezone: string
    language: string
  }
  storage: {
    provider: string
    cloudinaryCloudName: string
    cloudinaryUploadPreset: string
    awsBucket: string
    awsRegion: string
  }
  features: {
    allowUserUploads: boolean
    enableComments: boolean
    enableRatings: boolean
    enablePlaylists: boolean
    enableSocialSharing: boolean
    enableDownloads: boolean
  }
  security: {
    requireEmailVerification: boolean
    enableTwoFactor: boolean
    passwordMinLength: number
    sessionTimeout: number
    maxLoginAttempts: number
  }
  notifications: {
    emailNotifications: boolean
    newUserNotifications: boolean
    uploadNotifications: boolean
    securityAlerts: boolean
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: 'SangeetX',
      siteDescription: 'Modern Music Streaming Platform',
      siteUrl: 'https://sangeetx.com',
      adminEmail: 'admin@sangeetx.com',
      timezone: 'UTC',
      language: 'en'
    },
    storage: {
      provider: 'cloudinary',
      cloudinaryCloudName: '',
      cloudinaryUploadPreset: '',
      awsBucket: '',
      awsRegion: 'us-east-1'
    },
    features: {
      allowUserUploads: false,
      enableComments: true,
      enableRatings: true,
      enablePlaylists: true,
      enableSocialSharing: true,
      enableDownloads: false
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5
    },
    notifications: {
      emailNotifications: true,
      newUserNotifications: true,
      uploadNotifications: true,
      securityAlerts: true
    }
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleInputChange = (
    section: keyof SettingsData,
    field: string,
    value: string | boolean | number
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your platform settings</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saving ? (
            'Saving...'
          ) : saved ? (
            'Saved!'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <Input
                value={settings.general.siteName}
                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <Input
                value={settings.general.siteDescription}
                onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                placeholder="Enter site description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site URL
              </label>
              <Input
                value={settings.general.siteUrl}
                onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="h-5 w-5 mr-2" />
              Storage Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Storage Provider
              </label>
              <select
                value={settings.storage.provider}
                onChange={(e) => handleInputChange('storage', 'provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="cloudinary">Cloudinary</option>
                <option value="aws">AWS S3</option>
                <option value="firebase">Firebase Storage</option>
                <option value="supabase">Supabase Storage</option>
              </select>
            </div>

            {settings.storage.provider === 'cloudinary' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cloudinary Cloud Name
                  </label>
                  <Input
                    value={settings.storage.cloudinaryCloudName}
                    onChange={(e) => handleInputChange('storage', 'cloudinaryCloudName', e.target.value)}
                    placeholder="your-cloud-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Preset
                  </label>
                  <Input
                    value={settings.storage.cloudinaryUploadPreset}
                    onChange={(e) => handleInputChange('storage', 'cloudinaryUploadPreset', e.target.value)}
                    placeholder="your-upload-preset"
                  />
                </div>
              </>
            )}

            {settings.storage.provider === 'aws' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AWS Bucket Name
                  </label>
                  <Input
                    value={settings.storage.awsBucket}
                    onChange={(e) => handleInputChange('storage', 'awsBucket', e.target.value)}
                    placeholder="your-bucket-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AWS Region
                  </label>
                  <select
                    value={settings.storage.awsRegion}
                    onChange={(e) => handleInputChange('storage', 'awsRegion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="h-5 w-5 mr-2" />
              Feature Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleInputChange('features', key, e.target.checked)}
                  className="rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Require Email Verification
              </label>
              <input
                type="checkbox"
                checked={settings.security.requireEmailVerification}
                onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Two-Factor Authentication
              </label>
              <input
                type="checkbox"
                checked={settings.security.enableTwoFactor}
                onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
                className="rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Password Length
              </label>
              <Input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                min="6"
                max="32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (hours)
              </label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                min="1"
                max="168"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Login Attempts
              </label>
              <Input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                min="3"
                max="10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                  className="rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Environment</span>
              <span className="text-sm font-medium">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <span className="text-sm font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
              <span className="text-sm font-medium">Cloudinary</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
