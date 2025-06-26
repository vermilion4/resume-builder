import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServerStatus from '@/components/ServerStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume Editor',
  description: 'A web-based Resume Editor with AI enhancement capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServerStatus />
        <div className="pt-12">
          {children}
        </div>
      </body>
    </html>
  )
} 