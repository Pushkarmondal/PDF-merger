import { type Metadata } from 'next'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { FileText } from 'lucide-react';
import Link from 'next/link';

interface WaveIconProps {
  className?: string;
}

const WaveIcon: React.FC<WaveIconProps> = ({ className = '' }) => (
  <svg 
    className={className}
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 2C13.2 2 10.4 3.2 8 5.4C5.6 7.6 4 10.8 4 14.4C4 18 5.6 21.2 8 23.4C10.4 25.6 13.2 26.8 16 26.8C18.8 26.8 21.6 25.6 24 23.4C26.4 21.2 28 18 28 14.4C28 10.8 26.4 7.6 24 5.4C21.6 3.2 18.8 2 16 2Z" fill="currentColor"/>
    <path d="M16 6.40002C17.8 6.40002 19.4 7.20002 20.6 8.60002C21.8 10 22.2 11.6 22 13.2C21.8 14.8 20.8 16.2 19.4 17C18 17.8 16.4 18 14.8 17.8C13.2 17.6 11.8 16.8 10.8 15.6C9.8 14.4 9.19999 12.8 9.39999 11.2C9.59999 9.60002 10.6 8.20002 12 7.40002C13.4 6.60002 14.8 6.40002 16 6.40002Z" fill="white"/>
  </svg>
);
import './globals.css'
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PDF Merger | Combine PDFs Online for Free',
  description: 'Merge multiple PDF files into a single document quickly and easily. No installation or registration required. 100% free and secure.',
  keywords: 'PDF merger, combine PDF, merge PDF files, PDF joiner, PDF combiner, online PDF tools',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#2563eb',
  openGraph: {
    title: 'PDF Merger | Combine PDFs Online for Free',
    description: 'Merge multiple PDF files into a single document quickly and easily. No installation or registration required.',
    type: 'website',
    locale: 'en_US',
    url: 'https://pdf-merger.app',
    siteName: 'PDF Merger',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Merger | Combine PDFs Online for Free',
    description: 'Merge multiple PDF files into a single document quickly and easily.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} font-sans`}>
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </Head>
        <body className="min-h-screen bg-white text-black">
          <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="flex items-center">
                    <div className="h-8 w-8 text-blue-500">
                      <WaveIcon className="h-full w-full" />
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">MergeWave</span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Merge PDFs
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      My Merged PDFs
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity">
                        Sign in
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-grow py-8">
            {children}
          </main>
          <footer className="bg-white/90 backdrop-blur-sm border-t border-slate-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
              <p>Built with ☀️ and 🌊 by <a href="https://github.com/Pushkarmondal" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">@Pushkarmondal</a></p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}