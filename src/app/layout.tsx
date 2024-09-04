import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-[375px] mx-auto px-4 py-5">
          {children}
        </div>
      </body>
    </html>
  )
}