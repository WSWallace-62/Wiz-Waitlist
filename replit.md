# The Wiz - Replit.md

## Overview

The Wiz is a full-stack web application for a plant-based recipe conversion service. The app features a landing page with waitlist functionality and an admin dashboard for managing waitlist entries. Built with React, Express.js, and PostgreSQL, it's designed as a modern, responsive web application with email notification capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: Radix UI components with shadcn/ui styling
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions and loading states

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Password Security**: Node.js crypto module with scrypt hashing
- **Session Storage**: In-memory store for development
- **API Design**: RESTful endpoints with proper error handling

### Database Architecture
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Data Models
- **Users**: Admin authentication with username/password
- **Waitlist**: User registration with full name and email

### API Endpoints
- `GET /api/waitlist` - Retrieve all waitlist entries (protected)
- `POST /api/waitlist` - Add new waitlist entry (public)
- `DELETE /api/waitlist/:id` - Remove waitlist entry (protected)
- `GET /api/user` - Get current user session
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout

### Frontend Pages
- **Home**: Landing page with hero section, feature showcase, and waitlist form
- **Admin**: Protected dashboard for managing waitlist entries and user credentials
- **404**: Custom not found page

### UI Components
- Responsive design with mobile-first approach
- Custom loading spinner with avocado theme
- Feature cards with image zoom and carousel functionality
- Toast notifications for user feedback
- Form validation with real-time error messages

## Data Flow

1. **User Registration**: Visitors fill out waitlist form → validates data → stores in database → sends confirmation email
2. **Admin Authentication**: Admin login → session creation → access to protected routes
3. **Waitlist Management**: Admin views entries → can delete entries → real-time updates via React Query
4. **Email Notifications**: Uses SendGrid for sending waitlist confirmation emails with customizable templates

## External Dependencies

### Email Service
- **SendGrid**: Primary email service for notifications
- **Fallback**: Graceful degradation when email service unavailable
- **Templates**: HTML email templates with customizable branding

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Production bundling for server code
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first styling

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling
- **Zod**: Runtime validation

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code with external dependencies
- Database: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Local PostgreSQL with hot reloading
- **Production**: Cloud Run deployment with environment variables
- **Database**: Requires `DATABASE_URL` environment variable
- **Email**: Optional `SENDGRID_API_KEY` and `SENDGRID_VERIFIED_EMAIL`

### Security Considerations
- Password hashing with salt using scrypt
- Session-based authentication with secure cookies
- Input validation on both client and server
- CORS headers configured for development

## Changelog

Changelog:
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.