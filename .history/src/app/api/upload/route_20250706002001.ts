import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'audio' or 'image'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !['audio', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type specified' },
        { status: 400 }
      )
    }

    // Validate file size and type
    const maxSize = type === 'audio' ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB for audio, 10MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    const allowedTypes = type === 'audio' 
      ? ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Upload to cloud storage
    const result = await storageService.uploadFile(file, {
      folder: `sangeetx/${type}s`
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      size: result.size,
      format: result.format
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      )
    }

    await storageService.deleteFile(publicId)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    )
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
