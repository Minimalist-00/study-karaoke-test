import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'karaoke Recommendation app',
  description: '研究用アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="jp">
      <body>
        <div className="max-w-[375px] mx-auto px-1 py-10">
          {children}
        </div>
      </body>
    </html>
  )
}