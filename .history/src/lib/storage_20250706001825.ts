// Storage service for handling multiple cloud providers

export interface UploadResult {
  url: string
  publicId?: string
  size?: number
  format?: string
}

export interface UploadOptions {
  folder?: string
  format?: string
  quality?: string | number
  transformation?: Record<string, unknown>
}

export class StorageService {
  private provider: string

  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || 'cloudinary'
  }

  async uploadFile(
    file: File | Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    switch (this.provider) {
      case 'cloudinary':
        return this.uploadToCloudinary(file, options)
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`)
    }
  }

  private async uploadToCloudinary(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      // For now, we'll use the frontend upload approach
      // This would be replaced with server-side upload in production
      const formData = new FormData()
      
      if (file instanceof File) {
        formData.append('file', file)
      } else {
        // Convert Buffer to File for FormData
        const blob = new Blob([file], { type: 'audio/mpeg' })
        formData.append('file', blob, 'audio.mp3')
      }
      
      formData.append('upload_preset', 'sangeetx_preset')
      formData.append('folder', options.folder || 'sangeetx')
      
      const resourceType = file instanceof File && file.type.startsWith('image/') ? 'image' : 'video'
      formData.append('resource_type', resourceType)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format,
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload to Cloudinary')
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    switch (this.provider) {
      case 'cloudinary':
        // This would require server-side implementation
        console.log('Delete file:', publicId)
        break
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`)
    }
  }

  getPublicUrl(publicId: string): string {
    switch (this.provider) {
      case 'cloudinary':
        return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
      default:
        return publicId
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService()

// Utility function to validate file uploads
export const validateFile = (file: File, type: 'audio' | 'image'): void => {
  const maxSize = type === 'audio' ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB for audio, 10MB for images
  
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  
  const allowedTypes = type === 'audio' ? allowedAudioTypes : allowedImageTypes
  
  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
  }
}

// Utility function to get file duration (for audio files)
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(Math.floor(audio.duration))
    })
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load audio file'))
    })
    
    audio.src = url
  })
}
