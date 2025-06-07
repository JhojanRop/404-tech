import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
  const userCookie = request.cookies.get('user')?.value

  // Rutas protegidas
  const protectedRoutes = ['/profile', '/admin']
  const adminRoutes = ['/admin']
  const userRoutes = ['/profile']

  const pathname = request.nextUrl.pathname

  // Verificar si la ruta actual necesita protección
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Si no hay token, redirigir a login
    if (!token || !userCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const user = JSON.parse(userCookie)

      // Verificar acceso a rutas de admin
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (user.role === 'user') {
          return NextResponse.redirect(new URL('/profile', request.url))
        }
      }

      // Verificar acceso a rutas de usuario
      if (userRoutes.some(route => pathname.startsWith(route))) {
        if (user.role !== 'user') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
    } catch (error) {
      // Si hay error parseando el usuario, redirigir a login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*'
  ]
}