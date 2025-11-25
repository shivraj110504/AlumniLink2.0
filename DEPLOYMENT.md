# AlumniLink Deployment Guide

## Overview

AlumniLink consists of two separate applications that need to be deployed:
1. **Frontend** (React + Vite) - Currently deployed on Vercel
2. **Backend** (Node.js + Express) - Needs separate deployment

## Current Issue

Your frontend is trying to connect to `localhost:5000`, which doesn't work when deployed. You need to deploy your backend and configure the frontend to use the backend's URL.

---

## Backend Deployment Options

### Option 1: Deploy Backend to Vercel (Recommended)

1. **Create a new Vercel project for the backend:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your AlumniLink repository (or create a separate repo for just the backend)

2. **Configure the backend deployment:**
   - Root Directory: `server`
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Add environment variables in Vercel:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRE` - Token expiration (e.g., `30d`)

4. **Create `vercel.json` in your project root:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/server.js"
       }
     ]
   }
   ```

5. **Update `server/server.js`** to export the Express app for Vercel:
   ```javascript
   // At the end of server.js, add:
   export default app;
   ```

### Option 2: Deploy Backend to Railway

1. Go to [Railway](https://railway.app/)
2. Create a new project from your GitHub repository
3. Set the root directory to `server`
4. Add environment variables (MONGODB_URI, JWT_SECRET, JWT_EXPIRE)
5. Railway will automatically deploy and give you a URL

### Option 3: Deploy Backend to Render

1. Go to [Render](https://render.com/)
2. Create a new "Web Service"
3. Connect your repository
4. Set root directory to `server`
5. Set build command: `npm install`
6. Set start command: `node server.js`
7. Add environment variables
8. Deploy and get your backend URL

---

## Frontend Configuration

Once your backend is deployed, you need to update the frontend to use the backend URL.

### 1. Update Vercel Environment Variables

1. Go to your Vercel project (frontend) → Settings → Environment Variables
2. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api` (replace with your actual backend URL)
3. Redeploy the frontend

### 2. For Local Development

Your `.env` file is already configured for local development:
```bash
VITE_API_URL=http://localhost:5000/api
```

This will work when you run the backend locally on port 5000.

---

## Verification Steps

### 1. Test Backend Deployment

After deploying the backend, test it with:
```bash
curl https://your-backend-url/api/ping
```

You should get a `pong` response.

### 2. Test Frontend Connection

1. Deploy the frontend with the updated `VITE_API_URL`
2. Open your Vercel frontend URL
3. Try to sign up or log in
4. Check browser console - there should be no `localhost:5000` references

### 3. Check for Errors

In the browser console, you should see successful API calls to your backend URL instead of `ERR_BLOCKED_BY_CLIENT` errors.

---

## Common Issues

### CORS Errors

If you get CORS errors after deployment, update `server/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### Environment Variables Not Loading

- Make sure to use `VITE_` prefix for frontend variables
- Redeploy after adding environment variables in Vercel
- Check that backend has all required variables (MONGODB_URI, JWT_SECRET, JWT_EXPIRE)

### MongoDB Connection Fails

- Ensure your MongoDB Atlas allows connections from all IPs (0.0.0.0/0) for serverless deployment
- Verify the connection string is correct and URL-encoded

---

## Next Steps

1. ✅ **Code changes are complete** - Environment variables updated
2. ⏳ **Deploy your backend** - Choose an option above and deploy
3. ⏳ **Update Vercel frontend variables** - Add `VITE_API_URL` with your backend URL
4. ⏳ **Redeploy frontend** - Trigger a new deployment on Vercel
5. ⏳ **Test the deployment** - Try logging in on your live site

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs for both frontend and backend
2. Check browser console for error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB connection string is correct and accessible
