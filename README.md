# Flexi Task Mind

A modern task management application built with React, TypeScript, and Redux Toolkit.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun

### Installation & Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Default Login Credentials

```
Username: test
Password: test123
```

## 🎭 How Mocking Works

This project uses **MSW (Mock Service Worker)** to intercept API requests and return mock data. No backend is required!

### Mock Architecture

```
src/mocks/
├── browser.ts      # MSW worker setup
├── handlers.ts     # API endpoint handlers
└── middleware.ts   # Auth middleware for protected routes
```

### How It Works

1. **Initialization**: MSW worker starts before React renders (`src/main.tsx`)
2. **Request Interception**: All API calls to `/api/*` are intercepted by MSW
3. **Local Storage**: Mock data persists in browser's localStorage
4. **Auth Simulation**: JWT tokens are mocked for authentication flows

### Available Mock Endpoints

- `POST /api/login` - User authentication
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

All endpoints except `/login` require authentication (mock JWT token in headers).

## 📁 Project Structure

```
flexi-task-mind/
├── src/
│   ├── app/                    # Redux store setup
│   │   ├── features/          # Redux slices (auth, tasks)
│   │   ├── services/          # API service layer
│   │   └── store.ts           # Store configuration
│   ├── components/            # React components
│   │   ├── __tests__/         # Component tests
│   │   └── ui/                # Shadcn UI components
│   ├── contexts/              # React contexts (Theme)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── mocks/                 # MSW mock handlers
│   ├── pages/                 # Page components
│   ├── test/                  # Test setup & utilities
│   └── types/                 # TypeScript type definitions
├── public/
│   └── mockServiceWorker.js   # MSW service worker (auto-generated)
└── vite.config.ts             # Vite configuration
```

## 🛠️ Tech Stack

### Core

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### State Management

- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux

### UI & Styling

- **Tailwind CSS** - Utility-first CSS
- **Shadcn UI** - Component library (Radix UI + Tailwind)
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### Forms & Validation

- **React Hook Form** - Form handling
- **Zod** / **Yup** - Schema validation

### Testing

- **Vitest** - Test runner
- **Testing Library** - Component testing
- **MSW** - API mocking

### Routing

- **React Router v6** - Client-side routing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

Tests use MSW to mock API calls, ensuring consistent and fast test execution without network dependencies.

## 🔨 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:dev        # Build with development mode
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm test                 # Run tests
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Run tests with coverage report
```

## 💡 Key Features

- ✅ Full CRUD operations for tasks
- ✅ Priority levels (Low, Medium, High)
- ✅ Task status tracking (Todo, In Progress, Completed)
- ✅ Due date management
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Form validation
- ✅ Authentication flow
- ✅ Persistent mock data (localStorage)
- ✅ Comprehensive test coverage

## 🚧 Future Enhancements

- Connect to a real backend API
- Add task categories/tags
- Implement search and filtering
- Add task attachments
- User profile management

