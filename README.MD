# K_AI Job Tracker

AI-powered job application tracker with resume matching, built with React, Node.js, PostgreSQL, and Groq AI.

## 🚀 Live Demo

- **Frontend:** https://k-ai-job-tracker.vercel.app
- **Backend API:** https://k-ai-job-tracker.onrender.com

## ✨ Features

- 🤖 **AI-Powered Matching** - Analyze resume-job fit with LLaMA 3.3 (0-100% match scores)
- 📄 **PDF Resume Upload** - Automatic text extraction from PDF resumes
- 📊 **Real-time Statistics** - Track applications, interviews, and offers
- 🎯 **Smart Insights** - Get strengths, gaps, and actionable suggestions
- 💾 **Persistent Data** - All data saved to PostgreSQL database
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- React Hot Toast
- Axios

**Backend:**
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Groq AI (LLaMA 3.3)
- PDF-Parse
- Multer

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Supabase

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Groq API key

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

See deployment guides in `/docs` folder.

## 📝 License

MIT

## 👤 Author

Kaushal - [LinkedIn](https://www.linkedin.com/in/kaushalbhattarai10/) | [GitHub](https://github.com/imkaushal10)

``` bash 

---

## 1.4 - Create .gitignore

Make sure you have `.gitignore` in the root:

# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production.local

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

```
