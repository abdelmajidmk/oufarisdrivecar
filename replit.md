# Ou Faris - Car Rental Application

## Overview
"Ou Faris" is a car rental website built with React, TypeScript, Vite, and Tailwind CSS. It uses shadcn/ui components for the UI and integrates with Supabase for backend services.

## Project Architecture
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (database and authentication)
- **State Management**: React Query (TanStack Query)

## Directory Structure
```
src/
├── assets/        # Static images (car photos, logos)
├── components/    # React components
│   └── ui/        # shadcn/ui components
├── data/          # Static data (cars.ts)
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations (Supabase)
├── lib/           # Utility functions
└── pages/         # Page components (Index, Dashboard, NotFound)
```

## Running the Project
- Development: `npm run dev` (runs on port 5000)
- Build: `npm run build:dev` (creates production build in dist/)
- Preview: `npm run preview`

## Key Features
- Car fleet display with filtering
- Reservation system
- Dashboard for viewing reservations
- Responsive design

## Recent Changes
- 2026-01-08: Initial Replit environment setup
  - Renamed index.html.html to index.html
  - Configured Vite to use port 5000 with allowedHosts for Replit proxy
  - Set up deployment configuration for static hosting
