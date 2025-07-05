import { NextRequest, NextResponse } from 'next/server'

// Simple admin authentication middleware
// In production, use a proper authentication system like NextAuth.js

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Check for basic auth header
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse basic auth
    const auth = authHeader.split(' ')[1]
    const [email, password] = Buffer.from(auth, 'base64').toString().split(':')

    // Simple admin check (replace with proper auth in production)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sangeetx.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return handler(req)
  }
}

// Rate limiting middleware
const requests = new Map<string, number[]>()

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    
    // Get or create request history for this IP
    const requestHistory = requests.get(ip) || []
    
    // Filter out requests older than the window
    const recentRequests = requestHistory.filter(time => now - time < windowMs)
    
    // Check if limit exceeded
    if (recentRequests.length >= limit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Add current request and update history
    recentRequests.push(now)
    requests.set(ip, recentRequests)

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [key, history] of requests.entries()) {
        const recent = history.filter(time => now - time < windowMs)
        if (recent.length === 0) {
          requests.delete(key)
        } else {
          requests.set(key, recent)
        }
      }
    }

    return handler(req)
  }
}

// CORS middleware
export function withCors(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req)
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }
}

// Combine multiple middlewares
type MiddlewareHandler = (req: NextRequest) => Promise<NextResponse>
type Middleware = (handler: MiddlewareHandler) => MiddlewareHandler

export function compose(...middlewares: Middleware[]) {
  return (handler: MiddlewareHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
