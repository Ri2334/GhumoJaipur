# 🚀 Ghumo Jaipur Production Deployment Guide

Follow these steps to deploy your MERN project to **Vercel** (Frontend) and **Render** (Backend).

---

## 📦 1. Backend Deployment (Render)

1.  **Create a New Web Service** on [Render](https://render.com/).
2.  **Connect your GitHub Repository**.
3.  **Configure Settings**:
    *   **Name**: `ghumo-jaipur-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Add Environment Variables**:
    | Key | Value |
    |---|---|
    | `NODE_ENV` | `production` |
    | `MONGODB_URI` | *Your MongoDB Atlas Connection String* |
    | `JWT_SECRET` | *A random secure string* |
    | `CORS_ORIGIN` | `https://your-frontend-url.vercel.app` (Add after frontend is deployed) |
    | `CLOUDINARY_CLOUD_NAME` | *Your Cloudinary Cloud Name* |
    | `CLOUDINARY_API_KEY` | *Your Cloudinary API Key* |
    | `CLOUDINARY_API_SECRET` | *Your Cloudinary API Secret* |
    | `BREVO_API_KEY` | *Your Brevo Transactional API Key (v3)* |
    | `MAIL_USER` | *Your Brevo SMTP/Sender Login Email* |
    | `ADMIN_EMAIL` | `admin@ghumojaipur.com` |

---

## 🎨 2. Frontend Deployment (Vercel)

1.  **Create a New Project** on [Vercel](https://vercel.com/).
2.  **Connect your GitHub Repository**.
3.  **Configure Settings**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Add Environment Variables**:
    | Key | Value |
    |---|---|
    | `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

---

## 🛠️ 3. Post-Deployment Steps

### 1. Update CORS
Once Render provides your backend URL and Vercel provides your frontend URL:
- Go to Render settings and update `CORS_ORIGIN` with your Vercel URL.
- Go to Vercel settings and ensure `VITE_API_URL` points to your Render backend URL + `/api`.

### 2. Seed the Database
You can run the seeding scripts from your local machine pointing to the production MongoDB Atlas URI:
```bash
# In backend directory
MONGODB_URI=your_atlas_uri npm run seed:places
MONGODB_URI=your_atlas_uri npm run seed:transport
```

---

## ✅ 4. Verification Checklist
- [ ] Sign up as a new user (verify OTP email arrives).
- [ ] Search for transport (verify backend returns recommendations).
- [ ] Book a cab (verify Leaflet map and driver allocation work).
- [ ] Add a review (verify it appears on the place page).
- [ ] Login as Admin (verify access to admin dashboards).

---

## ⚠️ Important Notes
- **Email System**: The application uses the **Brevo REST API** for reliability on cloud platforms like Render. Ensure `BREVO_API_KEY` is set in your Render dashboard.
- **Cold Starts**: Render's free tier spins down after inactivity. The first request might take 30-50 seconds. We've added a timeout in the frontend to handle this.
- **HTTPS**: Both Vercel and Render provide HTTPS automatically. Always use `https://` in your environment variables.
- **Database**: Ensure your MongoDB Atlas IP Access List allows connections from everywhere (`0.0.0.0/0`) for Render to connect.
