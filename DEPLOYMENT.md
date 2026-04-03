# SURGIFLOW Deployment Guide

Complete step-by-step guide to deploy SURGIFLOW to GitHub and Vercel.

## 📋 Prerequisites

- GitHub account (free at [github.com](https://github.com))
- Vercel account (free at [vercel.com](https://vercel.com) - sign up with GitHub)
- Git installed on your machine
- Code is ready in `/Users/maahir/MyWorkspace/doctor-app`

---

## Step 1: Create GitHub Repository

### 1a. Go to GitHub
1. Visit https://github.com
2. Sign in to your account
3. Click **"+"** icon (top right) → **"New repository"**

### 1b. Create Repository
Fill in the form:
- **Repository name**: `surgiflow` (or your preferred name)
- **Description**: Doctor Patient Management System
- **Visibility**: Public (or Private)
- **Initialize with**: Leave unchecked (we already have code)

Click **"Create repository"**

### 1c. You'll see instructions for "...or push an existing repository from command line"

---

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
# Navigate to project
cd /Users/maahir/MyWorkspace/doctor-app

# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/surgiflow.git

# Rename branch to main (if not already)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/surgiflow.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Step 3: Deploy Frontend to Vercel

### 3a. Visit Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** 
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 3b. Create New Project
1. Click **"Add New"** → **"Project"**
2. Search for and select **"surgiflow"** repository
3. Click **"Import"**

### 3c. Configure Project
Fill in the settings:

**Project Name**: `surgiflow-frontend` (or your choice)

**Framework Preset**: `Next.js`

**Root Directory**: `frontend/` (⚠️ Important!)

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Environment Variables**: Add the following:
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-backend-url.com/api`

(Keep as localhost for now if backend isn't deployed yet)

### 3d. Deploy
Click **"Deploy"**

⏳ Vercel will build and deploy your app in ~2-3 minutes

✅ You'll get a URL like: `https://surgiflow-frontend.vercel.app`

---

## Step 4: Deploy Backend (Optional for Production)

### Option A: Deploy to Railway (Recommended)

1. **Go to Railway**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Choose "surgiflow"

3. **Configure**
   - Root Directory: `backend`
   - Set environment variables:
     ```
     PORT=5000
     JWT_SECRET=your-random-secret-key
     DB_NAME=doctor_app.db
     ```

4. **Deploy**
   - Click "Deploy"
   - Get your backend URL (e.g., `https://surgiflow-backend.railway.app`)

### Option B: Deploy to Render

1. **Go to Render**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Select your "surgiflow" repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm run dev`

3. **Set Environment Variables**
   - Same as Railway

4. **Deploy**

### Option C: Self-hosted (DigitalOcean, AWS, etc.)
- Choose your hosting provider
- Install Node.js
- Clone repository
- Set environment variables
- Run `npm install && npm run dev`
- Use PM2 or similar for process management

---

## Step 5: Update Frontend with Backend URL

Once backend is deployed:

1. **Go to Vercel Dashboard**
2. Select your "surgiflow-frontend" project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL` to your backend URL:
   ```
   https://your-backend-url.com/api
   ```
5. Click **"Save"**
6. Redeploy:
   - Go to **Deployments**
   - Click the three dots on the latest deployment
   - Select **"Redeploy"**

---

## Step 6: Test Your Deployment

### Test Frontend
1. Visit your Vercel URL (e.g., `https://surgiflow-frontend.vercel.app`)
2. Try to register a new account
3. Try to login
4. Add and manage patients

### Test Backend (if deployed)
Test the health endpoint:
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{"status":"Server is running"}
```

---

## 🎉 Congratulations!

Your SURGIFLOW app is now live! 

**Your URLs:**
- 🌐 **Frontend**: https://surgiflow-frontend.vercel.app
- 📡 **Backend** (if deployed): https://your-backend-url.com

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- Monitor build logs
- Check deployment history
- View analytics
- Manage environment variables

### Your Repository
- Keep code updated on GitHub
- Each push to `main` triggers automatic Vercel deployment
- Monitor deployment status in Vercel dashboard

---

## 🔄 Continuous Deployment

After initial setup, every time you:
1. Make changes locally
2. Commit and push to GitHub (`git push`)
3. Vercel automatically rebuilds and deploys

It's that simple! ✨

---

## 🆘 Troubleshooting

### Deployment Failed?
- Check Vercel build logs
- Ensure Root Directory is set to `frontend/`
- Verify `.env` variables are set correctly
- Check for build errors in the output

### Frontend can't reach Backend?
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend is running and accessible
- Ensure CORS is enabled on backend
- Check firewall/security rules

### Pages not loading CSS?
- Clear Vercel cache: Go to Settings → Git → Redeploy
- Hard refresh browser (Cmd+Shift+R)
- Check Tailwind config in deployed code

### Authentication not working?
- Verify `JWT_SECRET` is set on backend
- Check tokens are being stored in localStorage
- Verify API endpoint is correct in Vercel environment variables

---

## 📚 Next Steps

1. **Monitor your deployment**
   - Check Vercel analytics
   - Monitor backend performance

2. **Collect feedback**
   - Test with real users
   - Gather improvements

3. **Add features**
   - Follow the architecture guide
   - Deploy changes with `git push`

4. **Scale up**
   - Move from SQLite to PostgreSQL
   - Set up database backups
   - Add monitoring and logging

---

## 💡 Pro Tips

1. **Use environment variables** properly - never commit `.env` files
2. **Set up GitHub Actions** for automated testing before deployment
3. **Monitor your deployments** regularly
4. **Keep dependencies updated** - run `npm audit` periodically
5. **Use meaningful commit messages** for easier tracking

---

## 📞 Support

Need help?
- Check Vercel documentation: https://vercel.com/docs
- Check Railway docs: https://docs.railway.app
- Review your deployment logs for error messages

---

**Happy deploying! 🚀**
