# Admin Panel README

This is a separate admin dashboard for managing the portfolio.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_API_URL=http://localhost:8080/api/admin
```

For production, use:

```env
VITE_API_URL=https://your-backend-domain/api
VITE_ADMIN_API_URL=https://your-backend-domain/api/admin
```

## Deployment

This admin panel is deployed separately to Vercel.

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for full deployment instructions.

## Features

- Admin Authentication (JWT)
- Project Management
- Service Management
- Contact Submissions View
