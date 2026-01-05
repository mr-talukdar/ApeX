# Apex System

Apex is a **structured governance system for motorcycle riding groups**.

It helps groups run safer, smoother rides by introducing **level-based access, clear rules, and consistent decision-making**, without turning riding into a competition or social media platform.

---

## What Apex Is

Apex is a governance framework that provides:

- **Structured access to group rides** based on rider readiness and group membership
- **Clear rules and decision-making** to reduce subjective or ego-driven choices
- **Member progression system** that rewards commitment and participation
- **Admin tools** for managing groups, memberships, and rides
- **Transparent processes** that prioritize safety and fairness

---

## Why Apex Exists

Motorcycle riding groups face several challenges:

- **Safety consistency** - Groups struggle with ensuring riders are appropriately matched to ride difficulty
- **Member progression** - No clear path for riders to advance and gain access to more challenging rides
- **Fair access** - Subjective decisions about who can join which rides lead to friction
- **Admin burden** - Managing memberships and ride eligibility without clear frameworks

Apex was built to fill this gap by providing structure that respects both freedom and responsibility, ensuring everyone can participate safely while maintaining clear expectations.

**Core Principles:**

- Safety over speed
- Structure over ego
- Transparency over favoritism
- Progression over punishment
- Community over individuals

---

## Core Features

### Groups Management

- Join riding groups (open or approval-required)
- Admin approval workflow for closed groups
- View and manage group members
- Track membership status (Active, Pending, Rejected)

### Rides Management

- Create and manage upcoming rides
- Join rides based on eligibility
- Track ride participation
- View ride details (date, time, description, status)

### User Dashboard

- Personal profile management
- View your group memberships
- Track upcoming rides
- Admin interface for group management

### Authentication

- Google OAuth integration via NextAuth
- Secure session management
- Role-based access (Admin, Member)

---

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible component primitives
- **NextAuth.js** - Authentication

### Backend

- **Next.js API Routes** - Server-side API
- **Supabase** - PostgreSQL database
- **NextAuth.js** - Authentication provider

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

---

## How to Run Locally

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account and project
- Google OAuth credentials

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd apex
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following:

   ```env
   # Supabase
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SECRET=your_supabase_service_role_key

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up the database**

   You'll need to set up your Supabase database schema. The application uses tables for:

   - Users
   - Groups
   - Memberships
   - Rides
   - Ride Participants

   (Database schema documentation would be helpful here - consider adding a `schema.sql` file)

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Additional Scripts

- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## Current Project Status

**Status:** 🚧 Active Development

Apex is currently under active development and is being piloted within a real riding group. The core features are functional, but the system continues to evolve based on real-world usage and feedback.

### What's Working

- ✅ User authentication (Google OAuth)
- ✅ Group creation and management
- ✅ Membership request and approval workflow
- ✅ Ride creation and management
- ✅ Ride joining system
- ✅ Admin dashboard features
- ✅ Basic UI/UX improvements

### Known Limitations

- Some features may be incomplete or in progress
- Database schema may evolve
- Additional validation and error handling may be needed

### Contributing

This project is currently in active development. For questions or feedback, please reach out to the maintainers.

---

## Additional Resources

- **Live System Design Doc:** [https://apex-doc.vercel.app/](https://apex-doc.vercel.app/)
- **What Apex Is Not:** Apex is not a leaderboard, punishment system, social network, or replacement for rider responsibility. It supports decisions - riders remain responsible for their own safety and judgment.

---
