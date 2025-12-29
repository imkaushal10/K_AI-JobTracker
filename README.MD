# 🎯 K_AI Job Tracker

> An AI-powered job application management system that analyzes resume-job fit and provides actionable insights to help job seekers land their dream roles.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://k-ai-job-tracker.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

[**🚀 Live Demo**](https://k-ai-job-tracker.vercel.app) | [**💼 Portfolio**](https://kaushalbhattarai.vercel.app/)

---

## 📸 Screenshots

### Dashboard - Track All Applications

![Dashboard](screenshots/dashboard.png)

### AI Match Analysis Without Resume - Resume required Modal

![AI Analysis](screenshots/analysis-withoutresume.png)

### AI Match Analysis With Resume - Instant Insights Modal

![AI Analysis](screenshots/analysis-withresume.png)

### User Profile - Without Resume

![AI Analysis](screenshots/profile-withresume.png)

### User Profile - With Resume

![AI Analysis](screenshots/profile-withresume.png)

### Mobile Responsive Design

![Mobile View](screenshots/mobile1.png)
![Mobile View](screenshots/mobile2.png)

---

## 💡 The Problem

Job seekers often struggle to:

- Track multiple applications across different platforms
- Understand how well their resume matches specific job requirements
- Identify which skills to emphasize for each position
- Organize their job search efficiently

## ✨ The Solution

K_AI Job Tracker solves these challenges by providing:

### 🤖 **AI-Powered Resume Matching**

- Analyzes resume against job descriptions using LLaMA 3.3 (70B parameters)
- Generates 0-100% match scores with detailed breakdowns
- Identifies key strengths and skill gaps
- Provides actionable suggestions for interviews

### 📊 **Centralized Application Tracking**

- Manage all job applications in one place
- Real-time statistics: Applied, Interview, Offer, Rejected
- Filter and sort by status, date, or match score
- Never lose track of an opportunity

### 📄 **Smart Resume Management**

- Upload PDF resumes with automatic text extraction
- One resume, analyzed against unlimited jobs
- Secure storage and instant retrieval

### 🎯 **Actionable Insights**

- See exactly what employers are looking for
- Understand which experiences to highlight
- Get personalized interview preparation tips
- Increase your chances of landing interviews

---

## 🎥 Demo

**Try it yourself:** [k-ai-job-tracker.vercel.app](https://k-ai-job-tracker.vercel.app)

**Quick walkthrough:**

1. Create account (30 seconds)
2. Upload your resume (PDF supported)
3. Add job applications you're tracking
4. Click "Analyze Match" to get AI-powered insights
5. See your strengths, gaps, and suggestions

---

## 🛠️ Technical Implementation

### **Architecture**

``` bash
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Node.js    │─────▶│ PostgreSQL  │
│  Frontend   │◀─────│   Backend    │◀─────│  (Supabase) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Groq AI    │
                     │  (LLaMA 3.3) │
                     └──────────────┘
```

### **Tech Stack**

#### Frontend

- **React 18** - Modern UI with hooks and context
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful notifications

#### Backend

- **Node.js + Express** - RESTful API server
- **PostgreSQL** - Relational database (via Supabase)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Groq AI SDK** - LLaMA 3.3 integration
- **pdf-parse** - PDF text extraction
- **Multer** - File upload handling

#### DevOps & Deployment

- **Vercel** - Frontend hosting with auto-deploy
- **Render** - Backend hosting with zero-downtime
- **Supabase** - Managed PostgreSQL database
- **GitHub Actions** - CI/CD pipeline (planned)

### **Key Features Implementation**

#### 1. AI Matching Algorithm

```javascript
// Analyzes resume against job description
// Returns match score (0-100%), strengths, gaps, and suggestions
const matchResult = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{
    role: "system",
    content: "Analyze resume-job fit and provide actionable insights..."
  }]
});
```

#### 2. PDF Text Extraction

```javascript
// Extracts text from uploaded PDF resumes
const pdfData = await pdfParse(fileBuffer);
const resumeText = pdfData.text;
```

#### 3. Secure Authentication

```javascript
// JWT-based auth with bcrypt password hashing
const token = jwt.sign({ userId }, process.env.JWT_SECRET);
const hashedPassword = await bcrypt.hash(password, 10);
```

#### 4. Real-time Statistics

```javascript
// Dashboard aggregates application data
const stats = {
  total: applications.length,
  applied: applications.filter(a => a.status === 'Applied').length,
  interview: applications.filter(a => a.status === 'Interview').length,
  offer: applications.filter(a => a.status === 'Offer').length
};
```

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| **Development Time** | 10 days |
| **Lines of Code** | 5,500+ |
| **API Endpoints** | 22 |
| **React Components** | 18 |
| **Features** | 25+ |
| **Test Coverage** | Planned |
| **Monthly Cost** | $0 (Free tier) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Groq API key ([Get free key](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/imkaushal10/k-ai-job-tracker.git
cd k-ai-job-tracker
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

4. **Access the app**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

### Environment Variables

**Backend (.env)**

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-api-key
PORT=8080
NODE_ENV=development
```

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:5173
```

---

## 📁 Project Structure

``` bash
k-ai-job-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── contexts/       # React context providers
│   │   ├── services/       # API services
│   │   └── utils/          # Helper functions
│   └── public/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration files
│   └── uploads/            # Temporary file storage
└── README.md
```

---

## 🎯 Use Cases

### For Job Seekers

- Track 10-50 applications simultaneously
- Understand strengths for each position
- Prepare for interviews with AI insights
- Never miss a follow-up or deadline

### For Career Coaches

- Help clients understand their market fit
- Identify skill development opportunities
- Track client progress across applications

### For Recruiters (Future)

- Review candidate-job fit at scale
- Identify top matches quickly
- Streamline candidate screening

---

## 🔮 Roadmap

### v1.1 (Planned)
- [ ] Email notifications for application updates
- [ ] Calendar integration for interview scheduling
- [ ] Export applications to CSV/Excel

### v1.2 (Future)
- [ ] Kanban board view for visual pipeline
- [ ] Company research integration
- [ ] Interview prep notes and questions

### v2.0 (Vision)
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] LinkedIn integration

---

## 🧪 Testing
```bash
# Run backend tests (planned)
cd backend
npm test

# Run frontend tests (planned)
cd frontend
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kaushal Bhattarai**

- 🎓 Master's in Computer Science (Information Technology) @ Loyola University Chicago (May 2026)
- 💼 Full-Stack Developer | AI Enthusiast
- 📧 Email: <bhattaraikaushal123@gmail.com>
- 💼 LinkedIn: [kaushalbhattarai10](https://www.linkedin.com/in/kaushalbhattarai10/)
- 🐙 GitHub: [@imkaushal10](https://github.com/imkaushal10)
- 🌐 Portfolio: [kaushalbhattarai.com](https://kaushalbhattarai.vercel.app/)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) - For providing free access to LLaMA 3.3 AI model
- [Vercel](https://vercel.com) - For seamless frontend hosting
- [Render](https://render.com) - For reliable backend hosting
- [Supabase](https://supabase.com) - For managed PostgreSQL database

---

## 📧 Contact & Support

Have questions or suggestions? Feel free to:

- 📧 Email me: <bhattaraikaushal123@gmail.com>
- 💬 Open an issue on GitHub
- 🤝 Connect on [LinkedIn](https://www.linkedin.com/in/kaushalbhattarai10/)

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

**Built with ❤️ by [Kaushal Bhattarai](https://github.com/imkaushal10)**

[Live Demo](https://k-ai-job-tracker.vercel.app) • [Report Bug](https://github.com/imkaushal10/k-ai-job-tracker/issues) • [Request Feature](https://github.com/imkaushal10/k-ai-job-tracker/issues)

</div>
