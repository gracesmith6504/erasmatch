# ErasMatch — Erasmus Student Matching Platform

ErasMatch connects Erasmus exchange students heading to the same destination universities and cities. Students can discover peers, join group chats, exchange tips, and build community before and during their exchange semester.

## ✨ Features

- **Authentication** — Google OAuth & email/password login via Supabase Auth
- **Onboarding Flow** — Multi-step profile setup (name, home/destination university, course, interests)
- **Student Discovery** — Browse and filter students by university, city, and interests
- **Real-time Messaging** — Direct messages, city-based group chats, and university group chats with live updates via Supabase Realtime
- **Profile System** — Editable profiles with personality tags, bio, and avatar
- **University Hub** — Browse universities with details, tips, and popular courses
- **City Forums** — City-specific discussion boards for Erasmus students
- **Referral System** — Shareable referral codes for inviting friends
- **GDPR Compliance** — Privacy consent tracking, data export, and account deletion
- **Responsive Design** — Mobile-first with dedicated mobile navigation

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui component library |
| **State** | React Context (Auth, Data), TanStack React Query |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Edge Functions, Storage) |
| **Routing** | React Router v6 with protected routes |
| **Notifications** | Resend (email via Supabase Edge Functions) |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Google OAuth handler
│   ├── forum/          # City forum posts & comments
│   ├── home/           # Landing page sections (hero, features, etc.)
│   ├── layout/         # Layout wrapper & responsive navbar
│   ├── messages/       # DM, city chat, group chat components & hooks
│   ├── onboarding/     # Multi-step onboarding flow
│   ├── profile/        # Profile form, context, view components
│   ├── routing/        # App routes & protected route wrapper
│   ├── share/          # Share modal & referral components
│   ├── student/        # Student cards, filters, city views
│   ├── ui/             # shadcn/ui primitives (button, dialog, etc.)
│   └── university/     # University cards, search, filters
├── contexts/
│   ├── auth/           # Authentication context, provider & utilities
│   └── DataContext.tsx  # Global data provider (profiles, messages)
├── hooks/              # Custom hooks (forums, messages, students, etc.)
├── integrations/
│   └── supabase/       # Supabase client & auto-generated types
├── pages/              # Route-level page components
├── types/              # TypeScript interfaces (Profile, Message, etc.)
└── utils/              # Referral code generator
supabase/
└── functions/          # Edge Functions (email notifications, data export)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/erasmatch.git
cd erasmatch

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Supabase credentials in .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Database Setup

The app expects the following Supabase tables (managed via Supabase dashboard):

- `profiles` — User profiles with university, city, interests, etc.
- `messages` — Direct messages between users
- `city_messages` — Messages in city-based group chats
- `group_messages` — Messages in university group chats
- `universities` — University directory with details and tips

Row Level Security (RLS) policies should be configured for all tables.

### Edge Functions

Two Supabase Edge Functions are used:

- **`send-message-notification`** — Sends email notifications via Resend when a user receives a message
- **`export-user-data`** — GDPR data export endpoint returning user's profile and message history

## 📜 Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 📄 License

This project is private and not licensed for redistribution.
