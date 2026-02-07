import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Download, Sparkles } from 'lucide-react';
import { auth } from '@/auth';

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏗️</span>
              <span className="text-xl font-bold text-white">SystemSketch</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Sign up free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm">Built for Tambo Hackathon 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Design Systems with
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Just Your Words
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Say "Design Twitter" and watch the architecture build itself.
            AI-powered system design for interviews, learning, and real projects.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? "Go to Dashboard" : "Start Designing Free"}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/design"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition border border-white/20 text-center"
            >
              Try Without Signup
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            From interview prep to production architecture
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'AI-Powered', description: 'Just describe what you want' },
              { icon: Target, title: 'Interview Mode', description: 'Practice with timer' },
              { icon: Sparkles, title: 'Interactive', description: 'Click, drag, explore' },
              { icon: Download, title: 'Export', description: 'PNG, SVG, Mermaid' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <feature.icon className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            About SystemSketch
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            SystemSketch is an AI-powered system design platform that converts your ideas into
            complete architecture diagrams instantly. Built for interview preparation,
            learning distributed systems, and planning real-world scalable applications.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏗️</span>
            <span className="text-white font-semibold">SystemSketch</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built for Tambo Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
