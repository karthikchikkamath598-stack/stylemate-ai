# 🚀 STYLEMATE AI — Deployment Guide
### Deploying Backend on Render & Frontend on Vercel (100% Free)

This guide walks you through deploying **STYLEMATE AI** to production in under 5 minutes.

---

## ✦ Phase 1: Push Project to GitHub

1. Open PowerShell or Terminal in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of StyleMate AI with RAG and ChromaDB"
   ```
2. Create a new repository on [GitHub](https://github.com/new) called `stylemate-ai`.
3. Push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/stylemate-ai.git
   git push -u origin main
   ```

---

## ✦ Phase 2: Deploy Backend to Render (Free)

1. Go to **[render.com](https://render.com/)** and sign in (using GitHub).
2. Click **New +** → **Web Service**.
3. Select your `stylemate-ai` repository.
4. Configure the Web Service settings:
   - **Name**: `stylemate-ai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
5. (Optional) Add Environment Variables under **Advanced**:
   - `GEMINI_API_KEY`: *(Optional - leave blank for Local Demo Mode)*
   - `OPENAI_API_KEY`: *(Optional)*
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a public URL like:
   `https://stylemate-ai-backend.onrender.com`
8. Verify it by visiting:
   `https://stylemate-ai-backend.onrender.com/api/health`
   *(It will return `{"status":"healthy", "rag_ready":true, "total_chunks":112}`)*.

---

## ✦ Phase 3: Deploy Frontend to Vercel (Free)

1. Go to **[vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New…** → **Project**.
3. Import your `stylemate-ai` repository.
4. In the configuration window:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables**:
   - Add: `VITE_API_URL`
   - Value: `https://stylemate-ai-backend.onrender.com/api` *(Your Render backend URL from Phase 2)*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend in ~30 seconds, giving you a live URL such as:
   `https://stylemate-ai.vercel.app`

---

## ✦ Verification Checklist

- [ ] Open your live Vercel URL.
- [ ] Check the navbar badge: it should show `🟢 Backend Connected (112 chunks)`.
- [ ] Open **Style Studio**, choose **College** or a preset, and click **✨ CREATE MY LOOK**.
- [ ] Verify that the 4-step loading animation runs and the personalized look is generated.
- [ ] Open **RAG Explorer** to show your professor the 7 live pipeline stages!
