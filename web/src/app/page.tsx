import Link from 'next/link';

import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold">SystemSketch</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm text-blue-600">
            <span className="mr-2">🎉</span>
            Built for The UI Strikes Back Hackathon
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Speak System Design.
            <br />
            <span className="text-blue-600">See Architecture.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Build system architecture through natural language. Simply describe
            what you want to build, and watch interactive diagrams appear in
            real-time. Powered by Tambo Generative UI.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">Start Building Free</Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg">Watch Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-gray-500">
            Built with ❤️ for The UI Strikes Back Hackathon | Powered by Tambo
          </p>
        </div>
      </footer>
    </main>
  );
}