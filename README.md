# School Website Frontend

Modern, responsive school website built with Next.js 14 (App Router), React, and Tailwind CSS.

## Features

- **Modern UI/UX** - Clean, professional design with smooth animations
- **Fully Responsive** - Mobile-first approach, works on all devices
- **Dynamic Content** - All content fetched from backend API
- **Admin Panel** - Secure dashboard to manage all website content
- **Server & Client Components** - Optimized performance with Next.js
- **Tailwind CSS** - Utility-first styling with custom theme

## Pages

### Public Pages
- **Home** - Hero, About, Admissions, Gallery, Contact sections
- All content is dynamic and managed from admin panel

### Admin Pages
- **Login** - Secure authentication
- **Dashboard** - Overview with quick actions
- **Hero Editor** - Manage hero section
- **About Editor** - Update about school info
- **Admissions Editor** - Manage admission process
- **Gallery Manager** - CRUD operations for gallery
- **Contact Editor** - Update contact information

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.js                 # Home page
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   └── admin/
│       ├── page.js             # Admin login
│       └── dashboard/
│           ├── page.js         # Dashboard
│           ├── hero/page.js    # Hero editor
│           ├── about/page.js   # About editor
│           ├── admissions/page.js
│           ├── gallery/page.js
│           └── contact/page.js
├── components/
│   ├── Navbar.js               # Navigation bar
│   ├── Hero.js                 # Hero section
│   ├── About.js                # About section
│   ├── Admission.js            # Admission section
│   ├── Gallery.js              # Gallery section
│   └── Footer.js               # Footer/Contact
├── lib/
│   └── api.js                  # API calls
└── utils/
    └── auth.js                 # Auth helpers
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **js-cookie** - Cookie management

## Admin Access

After setting up the backend, create an admin account:

1. Use the backend API endpoint: `POST /api/auth/register`
2. Login at: `http://localhost:3000/admin`
3. Manage content from the dashboard

## Features Overview

### Homepage Sections
- **Hero** - Dynamic banner with title, subtitle, and CTA
- **About** - School info, mission, vision, and stats
- **Admissions** - Step-by-step admission process
- **Gallery** - Filterable image gallery by category
- **Footer** - Contact info and social links

### Admin Features
- Secure JWT-based authentication
- Protected routes
- Real-time content updates
- Image URL support
- Category-based gallery management
- Intuitive CRUD operations

## Styling

The project uses Tailwind CSS with:
- Custom color palette (primary blue/indigo theme)
- Reusable utility classes
- Smooth animations and transitions
- Professional shadow and gradient effects
- Compact, modern spacing

## API Integration

All data is fetched from the backend API:
- Hero section: `GET /api/hero`
- About: `GET /api/about`
- Admissions: `GET /api/admissions`
- Gallery: `GET /api/gallery`
- Contact: `GET /api/contact`

Admin operations use protected routes with JWT tokens.
# dynamic-school
