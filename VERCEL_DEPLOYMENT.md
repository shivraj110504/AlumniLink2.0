# AlumniLink - Quick Vercel Deployment Guide

## 🚀 Deploy Everything on Vercel (Single Project)

This guide will help you deploy both frontend and backend on Vercel in a single project.

---

## Step 1: Prepare Your Code

All code changes are already done! ✅ Just make sure you've committed all changes to Git.

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the settings. **Do NOT change** the build settings
5. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts (accept defaults)
```

---

## Step 3: Configure Environment Variables

After your first deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables:

| Variable | Value | Note |
|----------|-------|------|
| `VITE_API_URL` | `/api` | Use relative path for same-domain |
| `MONGODB_URI` | Your MongoDB connection string | From MongoDB Atlas |
| `JWT_SECRET` | Random secure string | Generate with: `openssl rand -base64 32` |
| `JWT_EXPIRE` | `30d` | Token expiration time |

4. **Important**: Set these for all environments (Production, Preview, Development)

---

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋮** (three dots) → **Redeploy**
4. Check "Use existing Build Cache" → Click **Redeploy**

---

## Step 5: Test Your Deployment

1. Open your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Try to sign up with a test account
3. Try to log in
4. Check browser console (F12) - should see no errors

---

## 🔧 Troubleshooting

### "API endpoint not found" or 404 errors

**Solution**: Make sure `vercel.json` exists in your project root with the correct configuration.

### CORS errors

**Solution**: Since frontend and backend are on the same domain, CORS shouldn't be an issue. If you see CORS errors, check that your backend's CORS configuration allows the Vercel domain.

### MongoDB connection fails

**Solution**: 
1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. This is required for Vercel serverless functions

### Environment variables not working

**Solution**:
1. Make sure variables are saved in Vercel settings
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

---

## 📁 Project Structure on Vercel

```
your-domain.vercel.app/          → Frontend (Vite React app)
your-domain.vercel.app/api/*     → Backend API (Serverless functions)
```

Both frontend and backend are served from the same domain!

---

## 🎯 Quick Checklist

- [ ] Code committed and pushed to GitHub
- [ ] Deployed project on Vercel
- [ ] Added all environment variables in Vercel
- [ ] Enabled MongoDB Network Access (0.0.0.0/0)
- [ ] Redeployed after adding variables
- [ ] Tested signup/login on live site

---

## 📝 Important Notes

1. **Development vs Production**:
   - Local: Uses `VITE_API_URL=http://localhost:5000/api` from `.env`
   - Production: Uses `VITE_API_URL=/api` from Vercel environment variables

2. **MongoDB Connection**:
   - Make sure your MongoDB connection string is URL-encoded
   - Special characters in passwords need to be encoded

3. **Deployment Time**:
   - First deployment: ~2-5 minutes
   - Subsequent deployments: ~1-2 minutes

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://cloud.mongodb.com)

---

## Need Help?

If something doesn't work:
1. Check Vercel deployment logs (Deployments → Click on deployment → View Build Logs)
2. Check browser console for frontend errors
3. Check that all environment variables are set correctly
