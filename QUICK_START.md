# ✅ Quick Start - Deploy to Vercel

## You're Ready to Deploy! 🚀

Everything is configured. Just follow these 5 steps:

---

## Step 1: Push Your Code
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

---

## Step 2: Deploy on Vercel
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Project"**
3. Select your GitHub repository
4. Click **"Deploy"** (don't change any settings)

---

## Step 3: Add Environment Variables

After deployment, go to your Vercel project:
1. Click **Settings** → **Environment Variables**
2. Add these 4 variables:

```
VITE_API_URL = /api
MONGODB_URI = mongodb+srv://shivarajtaware7192:AlumniLink%40123@cluster0.laz9ond.mongodb.net/alumnilink?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = your-secret-key-here
JWT_EXPIRE = 30d
```

> **Important**: Generate a secure JWT_SECRET:
> ```bash
> openssl rand -base64 32
> ```
> Or use any random 32+ character string

3. Set for **All Environments** (Production, Preview, Development)

---

## Step 4: Enable MongoDB Access

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com/)**
2. Click **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

This is required for Vercel serverless functions.

---

## Step 5: Redeploy

1. Go back to Vercel → **Deployments** tab
2. Click your latest deployment
3. Click **⋮** (three dots) → **Redeploy**
4. Click **Redeploy**

---

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Try to **Sign Up** with a test account
3. Try to **Log In**
4. Check browser console (F12) - should see no errors!

---

## 🎉 Done!

Your AlumniLink is now live on Vercel with both frontend and backend working together!

---

## 📚 Need More Help?

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting and more information.
