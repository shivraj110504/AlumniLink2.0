# Deployment Troubleshooting Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Changes Committed
- [ ] All files committed to Git
- [ ] Pushed to GitHub repository

### 2. Vercel Project Created
- [ ] Project imported from GitHub
- [ ] Initial deployment completed

---

## ✅ Environment Variables Setup

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

### Required Variables:

- [ ] **VITE_API_URL** 
  - Value: `/api`
  - Environments: Production ✓, Preview ✓, Development ✓

- [ ] **MONGODB_URI**
  - Value: Your MongoDB connection string
  - Environments: Production ✓, Preview ✓, Development ✓

- [ ] **JWT_SECRET**
  - Value: Generate with `openssl rand -base64 32`
  - Environments: Production ✓, Preview ✓, Development ✓

- [ ] **JWT_EXPIRE**
  - Value: `30d`
  - Environments: Production ✓, Preview ✓, Development ✓

---

## ✅ MongoDB Configuration

Go to MongoDB Atlas → Network Access

- [ ] Click "Add IP Address"
- [ ] Select "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Click Confirm

---

## ✅ Redeployment

After adding environment variables:

- [ ] Go to Deployments tab
- [ ] Click latest deployment → ⋮ (three dots) → Redeploy
- [ ] Wait for deployment to complete

---

## ✅ Testing

### Check Build Logs
- [ ] Go to Deployments → Click deployment → View Function Logs
- [ ] Look for any errors in the logs
- [ ] Verify both frontend and backend built successfully

### Test the Site
- [ ] Visit your production URL (not preview URL)
- [ ] Open DevTools (F12) → Console tab
- [ ] Try to sign up
- [ ] Check console for errors

### Common Issues

**Issue**: Still seeing localhost errors
- **Fix**: Make sure `VITE_API_URL=/api` is set in Vercel
- **Fix**: Redeploy after adding environment variable

**Issue**: API 404 errors
- **Fix**: Check `vercel.json` exists in project root
- **Fix**: Verify `server/server.js` exports the app

**Issue**: MongoDB connection errors
- **Fix**: Verify `MONGODB_URI` is correct and URL-encoded
- **Fix**: Check MongoDB Network Access allows 0.0.0.0/0

**Issue**: Authentication fails
- **Fix**: Verify `JWT_SECRET` is set
- **Fix**: Check backend logs for specific errors

---

## 🔍 Debugging Tips

### View Deployment Logs
1. Vercel Dashboard → Deployments
2. Click your deployment
3. Check "Build Logs" and "Function Logs"

### Check Console Errors
1. Open your site
2. Press F12 → Console tab
3. Try signup/login
4. Share any red error messages

### Test API Directly
Try accessing: `https://your-domain.vercel.app/api/ping`
- Should return: `pong`
- If 404: Check vercel.json configuration

---

## 📝 Current Status

**Deployment URL**: _________________

**Environment Variables Added**: 
- [ ] VITE_API_URL
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRE

**MongoDB Access**: [ ] Configured

**Last Redeployment**: _________________

**Current Issues**: _________________
