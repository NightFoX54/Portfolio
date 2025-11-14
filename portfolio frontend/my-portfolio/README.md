# Portfolio Admin Panel

A modern admin panel built with Next.js 14 for managing portfolio data.

## Features

- **Personal Information Management**: Add/edit personal details, profile pictures, and resumes
- **Project Management**: Create and manage projects with media uploads
- **Job History**: Track work experience with company logos
- **Education History**: Manage educational background
- **Professional Skills**: Add and categorize skills by level
- **Project Details**: Add detailed content (text, images, videos) to projects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update the API URL in `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── PersonalInfoManager.tsx
│   ├── ProjectsManager.tsx
│   ├── JobHistoryManager.tsx
│   ├── EducationManager.tsx
│   ├── SkillsManager.tsx
│   └── ProjectDetailManager.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
└── package.json
```

## API Integration

The admin panel integrates with the Spring Boot backend through REST APIs:

- **Personal Info**: `/api/personal-info`
- **Projects**: `/api/projects`
- **Job History**: `/api/job-history`
- **Education**: `/api/education-history`
- **Skills**: `/api/professional-skills`
- **Project Details**: `/api/project-detail-content`

## File Upload

The admin panel supports file uploads for:
- Profile pictures (images)
- Resumes (PDFs)
- Project media (images/videos)
- Company logos (images)
- Project detail content (images/videos)

Files are uploaded to AWS S3 through the backend API.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm run start
```

## Deployment

The admin panel can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to your backend API URL.