# VehicleVault

A modern vehicle management system for auto repair shops and service centers.

## Features

- Customer Management
- Vehicle Tracking
- Service Records
- Maintenance Reminders
- Reports and Analytics
- Dark Mode Support

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Express.js
- PostgreSQL
- Drizzle ORM

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd VehicleVault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

4. Set up the database:
```bash
npm run db:push
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Running in Production

```bash
npm start
```

## License

MIT 