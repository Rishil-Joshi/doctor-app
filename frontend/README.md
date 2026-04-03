# Doctor App

A Progressive Web App (PWA) for doctors to manage patient records, including photos, videos, and details.

## Features

- Patient record management
- PWA support for offline functionality
- Responsive design for web, Android, and iOS

## Tech Stack

- Frontend: React/Next.js with TypeScript and Tailwind CSS
- Backend: Next.js API routes (Node.js)
- Database: PostgreSQL (to be integrated)
- Deployment: Vercel

## Setup

1. Install Node.js (version 18 or later)
2. Clone the repository
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API

- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add a new patient

## Deployment

Deploy to Vercel by connecting your GitHub repository.

## Future Enhancements

- Integrate PostgreSQL database
- Add authentication
- Upload photos and videos
- Advanced patient search and filtering