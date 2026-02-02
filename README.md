<div align="center">
  <h1>🏗️ SystemSketch</h1>
  <p><strong>Speak System Design. See Architecture.</strong></p>
  
  <p>Build system architecture through natural language using Tambo Generative UI</p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/hackathon-The%20UI%20Strikes%20Back-blue" alt="Hackathon" />
    <img src="https://img.shields.io/badge/powered%20by-Tambo-orange" alt="Tambo" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
</div>

---

## 🎯 What is SystemSketch?

SystemSketch is an AI-powered tool that generates interactive system architecture diagrams through natural language conversation. Simply describe what you want to build, and watch the architecture appear in real-time.

**Built for [The UI Strikes Back](https://wemakedevs.org/events/hackathons/the-ui-strikes-back) Hackathon**

## ✨ Features

- 💬 **Natural Language Input** - Describe architecture in plain English
- 🏗️ **Live Diagram Generation** - Watch components appear in real-time
- 🖱️ **Interactive Components** - Click nodes for details
- 📤 **Export Options** - PNG, PDF, SVG, Mermaid
- 💾 **Save & History** - Keep all your designs
- 🔐 **User Accounts** - Google/GitHub login

## 🧠 Why Tambo?

SystemSketch uses Tambo’s Generative UI to dynamically decide **which UI components to render**
based on user intent — whether that’s drawing a load balancer, adding a database,
or exporting architecture diagrams — without hardcoded UI flows.


## 🎬 Demo

> Coming soon...

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 |
| Generative UI | Tambo SDK |
| Styling | Tailwind CSS |
| Auth | NextAuth.js |
| Database | PostgreSQL (Supabase) |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Tambo API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/systemsketch.git
cd systemsketch

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
pnpm dev

Open http://localhost:3000 to see the app.

👥 Team

Thanka Bharathi T M	|  Team Lead  |  @ThankaBharathi
Sindhu S  |  Developer  |  @Sindhu-Srinivasan
Muthu Ram V  |  Developer  |  @muthuram06

📄 License
MIT License - see LICENSE for details.


