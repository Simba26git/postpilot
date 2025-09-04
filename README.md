# PostPilot 🚀

A comprehensive social media dashboard for managing multiple platforms with AI-powered content creation capabilities.

## 🎯 Overview

PostPilot is a modern, full-featured social media management dashboard built with Next.js 15, featuring real-time analytics, AI-powered content generation, and multi-platform support. The application provides an intuitive interface for managing social media accounts across Instagram, Facebook, Twitter, and LinkedIn.

## ✨ Features

### 📊 **Analytics Dashboard**
- Real-time performance metrics
- Interactive charts and visualizations
- Multi-platform analytics aggregation
- Custom time range filtering
- Account comparison tools

### 🤖 **AI Studio**
- **OpenAI Integration** - Text generation and content optimization
- **ElevenLabs** - Voice generation and audio content
- **Runway AI** - Video generation and editing
- **Canva API** - Automated design creation
- Custom AI training data management

### 📱 **Content Management**
- Multi-platform post creation
- Content scheduling and calendar
- Media library management
- Template system
- Bulk operations

### 🎨 **User Experience**
- Responsive mobile-first design
- Dark/Light theme switching
- Real-time notifications
- Drag & drop interfaces
- Touch-friendly mobile interactions

### 🔧 **Technical Features**
- Server-side rendering with Next.js 15
- TypeScript for type safety
- Prisma ORM for database management
- TailwindCSS for styling
- Radix UI components
- Real-time data updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: TailwindCSS + Radix UI
- **Database**: Prisma ORM
- **Authentication**: Custom implementation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Simba26git/postpilot.git
   cd postpilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # API Keys
   OPENAI_API_KEY=your_openai_key
   ELEVENLABS_API_KEY=your_elevenlabs_key
   RUNWAY_API_KEY=your_runway_key
   CANVA_API_KEY=your_canva_key
   
   # Database
   DATABASE_URL="your_database_url"
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Dashboard Navigation
- **Dashboard**: Main overview with key metrics
- **Analytics**: Detailed performance analysis
- **Content**: Post creation and management
- **AI Studio**: AI-powered content generation
- **Calendar**: Scheduling and timeline view
- **Statistics**: Advanced reporting

### Testing Features
Navigate to the **App Test** page to:
- Test all UI components
- Verify API integrations
- Check mobile responsiveness
- Validate analytics functionality

## 🔑 API Integration Status

| Service | Status | Purpose |
|---------|--------|---------|
| OpenAI | 🟡 Connected | Text generation, content optimization |
| ElevenLabs | ❌ Setup Required | Voice synthesis, audio content |
| Runway AI | ❌ Setup Required | Video generation, AI video editing |
| Canva | ❌ Setup Required | Automated design creation |

## 📁 Project Structure

```
postpilot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── theme-provider.tsx # Theme management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/               # Static assets
├── prisma/               # Database schema
└── styles/               # Additional styles
```

## 🎨 Customization

### Themes
The application supports both light and dark themes with automatic system preference detection.

### UI Components
Built with Radix UI primitives and customizable through TailwindCSS classes.

### Analytics
Customize dashboard metrics by modifying the analytics data structure in `app/page.tsx`.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Simbarashe Gunundu**
- Email: s.gunundu00@gmail.com
- GitHub: [@Simba26git](https://github.com/Simba26git)
- Project: [PostPilot](https://github.com/Simba26git/postpilot)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible component primitives
- TailwindCSS for utility-first CSS
- All AI service providers for powerful integrations

## 📊 Project Status

**Current Version**: 0.1.0
**Status**: ✅ Active Development
**Last Updated**: September 2025

---

⭐ **Star this repo if you find it helpful!**
