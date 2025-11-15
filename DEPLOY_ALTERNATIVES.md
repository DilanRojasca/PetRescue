# 🌐 Alternativas de Despliegue - PetRescue

Guía completa de plataformas para desplegar tanto el frontend como el backend.

## 🏆 Opciones Recomendadas

### 1. **Vercel** ⭐ (Recomendado - Más Fácil)

**Ventajas:**
- ✅ Despliegue automático desde GitHub
- ✅ Gratis con generoso plan free tier
- ✅ Excelente para React/Next.js
- ✅ CDN global (muy rápido)
- ✅ SSL automático
- ✅ Puede desplegar backend con serverless functions

**Despliegue:**

#### Frontend en Vercel:
1. Ve a: https://vercel.com
2. Sign up con GitHub
3. "Add New Project"
4. Importa: `DilanRojasca/PetRescue`
5. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. **Environment Variables**:
   - `VITE_API_URL` = URL de tu backend
7. Deploy

#### Backend en Render/Railway:
- Despliega el backend en Render o Railway (ver opciones abajo)
- Usa esa URL en `VITE_API_URL`

**URL resultante**: `https://petrescue.vercel.app`

---

### 2. **Railway** ⭐⭐ (Todo en uno)

**Ventajas:**
- ✅ Despliega frontend Y backend en el mismo lugar
- ✅ Gratis con $5 de crédito mensual
- ✅ Muy fácil de usar
- ✅ Auto-deploy desde GitHub
- ✅ Base de datos incluida (si la necesitas después)

**Despliegue:**

1. Ve a: https://railway.app
2. Sign up con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona: `DilanRojasca/PetRescue`

#### Desplegar Backend:
1. "New Service" → "GitHub Repo"
2. Selecciona el mismo repo
3. Configura:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Railway detectará automáticamente Python y requirements.txt
5. Obtén la URL del backend

#### Desplegar Frontend:
1. "New Service" → "GitHub Repo" (otra vez)
2. Selecciona el mismo repo
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
4. **Environment Variables**:
   - `VITE_API_URL` = URL del backend (del paso anterior)
5. Deploy

**URLs resultantes**: 
- Frontend: `https://petrescue-production.up.railway.app`
- Backend: `https://petrescue-backend.up.railway.app`

---

### 3. **Netlify** ⭐

**Ventajas:**
- ✅ Gratis con buen plan free tier
- ✅ Excelente para frontend
- ✅ Deploy automático
- ✅ Formularios y funciones serverless

**Despliegue:**

#### Frontend en Netlify:
1. Ve a: https://netlify.com
2. Sign up con GitHub
3. "Add new site" → "Import an existing project"
4. Selecciona: `DilanRojasca/PetRescue`
5. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. **Environment Variables**:
   - `VITE_API_URL` = URL de tu backend
7. Deploy

#### Backend:
- Usa Render, Railway o Fly.io para el backend

**URL resultante**: `https://petrescue.netlify.app`

---

### 4. **Render** (Todo en uno)

**Ventajas:**
- ✅ Gratis (con algunas limitaciones)
- ✅ Puede desplegar ambos servicios
- ✅ Auto-deploy desde GitHub

**Despliegue:**

Ya tienes la configuración en `backend/render.yaml`. Para desplegar ambos:

#### Backend:
1. Ve a: https://render.com
2. "New +" → "Web Service"
3. Conecta tu repo
4. Configura como ya te expliqué antes

#### Frontend:
1. "New +" → "Static Site"
2. Conecta tu repo
3. Configura:
   - **Name**: `petrescue-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. **Environment Variables**:
   - `VITE_API_URL` = URL de tu backend
5. Deploy

**URLs resultantes**:
- Frontend: `https://petrescue-frontend.onrender.com`
- Backend: `https://petrescue-backend.onrender.com`

---

### 5. **Fly.io** ⭐

**Ventajas:**
- ✅ Gratis con generoso plan
- ✅ Puede desplegar ambos
- ✅ Muy rápido
- ✅ Global edge network

**Despliegue:**

1. Instala Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Login: `fly auth login`
3. Para backend: `fly launch` en carpeta `backend`
4. Para frontend: `fly launch` en carpeta `frontend`

---

## 📊 Comparación Rápida

| Plataforma | Frontend | Backend | Dificultad | Gratis | Recomendado |
|------------|----------|---------|------------|--------|-------------|
| **Vercel** | ⭐⭐⭐ | ⚠️ Serverless | ⭐⭐⭐ Muy fácil | ✅ Sí | ⭐⭐⭐ |
| **Railway** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ Fácil | ✅ $5/mes | ⭐⭐⭐ |
| **Netlify** | ⭐⭐⭐ | ⚠️ Serverless | ⭐⭐ Fácil | ✅ Sí | ⭐⭐ |
| **Render** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ Fácil | ✅ Sí | ⭐⭐ |
| **Fly.io** | ⭐⭐ | ⭐⭐⭐ | ⭐ Medio | ✅ Sí | ⭐⭐ |

## 🎯 Mi Recomendación

**Para empezar rápido**: **Vercel** (frontend) + **Render** (backend)
- Más fácil de configurar
- Ambos gratuitos
- Excelente rendimiento

**Para todo en uno**: **Railway**
- Todo en el mismo lugar
- Muy fácil de gestionar
- $5 gratis al mes

## 🚀 Configuración Rápida para Vercel

Voy a crear los archivos de configuración para Vercel:

