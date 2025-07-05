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
      case 'firebase':
        return this.uploadToFirebase(file, options)
      case 'aws':
        return this.uploadToAWS(file, options)
      case 'supabase':
        return this.uploadToSupabase(file, options)
      case 'vercel':
        return this.uploadToVercel(file, options)
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`)
    }
  }

  private async uploadToCloudinary(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      let uploadData: any

      if (file instanceof File) {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        uploadData = buffer
      } else {
        uploadData = file
      }

      const result = await cloudinary.uploader.upload(
        `data:${file instanceof File ? file.type : 'audio/mpeg'};base64,${uploadData.toString('base64')}`,
        {
          resource_type: 'auto',
          folder: options.folder || 'sangeetx',
          format: options.format,
          quality: options.quality,
          transformation: options.transformation,
        }
      )

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

  private async uploadToFirebase(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    // Firebase implementation
    try {
      const { initializeApp, getApps } = await import('firebase/app')
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')

      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      }

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      const storage = getStorage(app)

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const folder = options.folder || 'sangeetx'
      const storageRef = ref(storage, `${folder}/${fileName}`)

      let uploadData: ArrayBuffer
      if (file instanceof File) {
        uploadData = await file.arrayBuffer()
      } else {
        uploadData = file.buffer
      }

      const snapshot = await uploadBytes(storageRef, uploadData)
      const url = await getDownloadURL(snapshot.ref)

      return {
        url,
        publicId: snapshot.ref.fullPath,
        size: snapshot.metadata.size,
      }
    } catch (error) {
      console.error('Firebase upload error:', error)
      throw new Error('Failed to upload to Firebase')
    }
  }

  private async uploadToAWS(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      const AWS = await import('aws-sdk')
      
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      })

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const folder = options.folder || 'sangeetx'
      const key = `${folder}/${fileName}`

      let uploadData: Buffer
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer()
        uploadData = Buffer.from(arrayBuffer)
      } else {
        uploadData = file
      }

      const result = await s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: uploadData,
        ContentType: file instanceof File ? file.type : 'audio/mpeg',
        ACL: 'public-read',
      }).promise()

      return {
        url: result.Location,
        publicId: result.Key,
        size: uploadData.length,
      }
    } catch (error) {
      console.error('AWS upload error:', error)
      throw new Error('Failed to upload to AWS S3')
    }
  }

  private async uploadToSupabase(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const folder = options.folder || 'sangeetx'
      const filePath = `${folder}/${fileName}`

      let uploadData: ArrayBuffer
      if (file instanceof File) {
        uploadData = await file.arrayBuffer()
      } else {
        uploadData = file.buffer
      }

      const { data, error } = await supabase.storage
        .from('audio')
        .upload(filePath, uploadData, {
          contentType: file instanceof File ? file.type : 'audio/mpeg',
          upsert: false,
        })

      if (error) throw error

      const { data: publicData } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath)

      return {
        url: publicData.publicUrl,
        publicId: filePath,
        size: uploadData.byteLength,
      }
    } catch (error) {
      console.error('Supabase upload error:', error)
      throw new Error('Failed to upload to Supabase')
    }
  }

  private async uploadToVercel(
    file: File | Buffer,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      const { put } = await import('@vercel/blob')
      
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const folder = options.folder || 'sangeetx'
      const pathname = `${folder}/${fileName}`

      let uploadData: File | Buffer
      if (file instanceof File) {
        uploadData = file
      } else {
        // Convert Buffer to File-like object
        uploadData = new File([file], fileName, { type: 'audio/mpeg' })
      }

      const blob = await put(pathname, uploadData, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      return {
        url: blob.url,
        publicId: blob.pathname,
        size: blob.size,
      }
    } catch (error) {
      console.error('Vercel Blob upload error:', error)
      throw new Error('Failed to upload to Vercel Blob')
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    switch (this.provider) {
      case 'cloudinary':
        await cloudinary.uploader.destroy(publicId)
        break
      case 'firebase':
        // Firebase deletion logic
        break
      case 'aws':
        // AWS S3 deletion logic
        break
      case 'supabase':
        // Supabase deletion logic
        break
      case 'vercel':
        // Vercel Blob deletion logic
        break
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`)
    }
  }

  getPublicUrl(publicId: string): string {
    switch (this.provider) {
      case 'cloudinary':
        return cloudinary.url(publicId, { secure: true })
      default:
        return publicId // For other providers, publicId might already be the URL
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService()
