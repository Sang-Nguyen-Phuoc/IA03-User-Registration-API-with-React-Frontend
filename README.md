# User Registration API + React Frontend

Short instructions to install and run the project locally (frontend + server).

## Prerequisites

- Node.js (v16+ recommended) and npm
- A MongoDB Atlas cluster (or local MongoDB) and a connection string

## Quick setup

1. Clone the repo and open it:

```bash
git clone <repo-url>
cd IA03-User-Registration-API-with-React-Frontend
```

2. Install dependencies for both projects.

Server:

```bash
cd server
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

## Environment variables

Create a `.env` file in the `server/` folder with at least:

```properties
# server/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_at_least_32_chars
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `frontend/` folder with the API base URL (must include `/api`):

```properties
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

Note: When deploying, set these env vars in Render (backend) and Vercel (frontend). For production the backend URL should be something like `https://your-backend.onrender.com/api`.

## Run locally

Start the server (development):

```bash
cd server
npm run dev    # uses nodemon, watches files
```

Start the frontend (Vite dev server):

```bash
cd frontend
npm run dev
```

Open the frontend URL (usually http://localhost:5173) in your browser.

## Common troubleshooting

- 404 / Route not found when logging in/registering: verify your frontend `VITE_API_URL` includes the `/api` suffix. Example: `https://<backend>.onrender.com/api`.
- `ENOTFOUND _mongodb._tcp...` when connecting to Atlas: check your `MONGODB_URI` cluster host is correct, ensure the cluster is active, and add an IP access entry (or 0.0.0.0/0) in Atlas Network Access.
- CORS errors: ensure `FRONTEND_URL` (or your deployed frontend domain) is listed in the backend's allowed origins.
- JWT / auth errors: confirm `JWT_SECRET` is set and the same across deploys.

## Deploy notes

- Backend (Render): add environment variables in the Render service settings. Ensure `MONGODB_URI` is correct and the database user has access. Set `PORT` to the port Render expects (Render provides a port via environment variable; the app uses `process.env.PORT` already).
- Frontend (Vercel): set `VITE_API_URL` to the backend's `/api` URL in Vercel environment variables and redeploy.

## Where to look for logs

- Backend logs: Render service logs (shows server startup, DB connection errors)
- Frontend logs: Vercel build / runtime logs

If something still fails after following the steps, include the exact failing request URL and backend logs (the 404 response body from the backend is helpful).

---

Created to quickly get the project running locally and to help with common deploy issues (MongoDB SRV, CORS, API URL).  
If you want, I can add a small health-check script or a Postman collection next.
