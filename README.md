# Movie & TV Show Manager - Frontend

React + TypeScript + Vite + Material-UI + TailwindCSS frontend application.

## Features

- User authentication (Login/Register)
- Movie and TV show management (CRUD operations)
- Infinite scroll for efficient data loading
- Search and filter functionality
- Image upload for posters
- Responsive design
- Form validation

## Tech Stack

- React 19 with TypeScript
- Vite for fast development
- Material-UI (MUI) for UI components
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- react-infinite-scroll-component for infinite scrolling

## Setup

1. Install dependencies:

```bash
npm install
```

2. The environment variables are configured in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Navbar.tsx
│   ├── MovieShowList.tsx
│   ├── MovieShowForm.tsx
│   └── PrivateRoute.tsx
├── context/          # React context
│   └── AuthContext.tsx
├── services/         # API services
│   ├── api.ts
│   ├── authService.ts
│   └── movieShowService.ts
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Components

### MovieShowList

Main component displaying the collection with:

- Infinite scroll
- Search and filter
- Edit/Delete actions
- Responsive table

### MovieShowForm

Modal form for adding/editing entries with:

- All required and optional fields
- Image upload with preview
- Validation
- Create/Edit modes

### Authentication

- Login and Register pages
- JWT token management
- Protected routes
- Auto-redirect for unauthorized users

## Usage

1. Register or login
2. Add movies/shows using the "Add" button
3. Search by title, director, or genre
4. Filter by type (Movie/TV Show)
5. Sort by various criteria
6. Edit or delete entries
7. Scroll down to load more entries automatically
