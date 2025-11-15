# ⚡ Despliegue Rápido - Opción Recomendada

## 🎯 Opción 1: Vercel (Frontend) + Render (Backend) - 5 minutos

### Paso 1: Desplegar Backend en Render (2 min)

1. Ve a: https://render.com
2. Sign up / Login
3. "New +" → "Web Service"
4. Conecta: `DilanRojasca/PetRescue`
5. Configura:
   ```
   Name: petrescue-backend
   Environment: Python 3
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. "Create Web Service"
7. **Copia la URL** (ej: `https://petrescue-backend.onrender.com`)

### Paso 2: Desplegar Frontend en Vercel (2 min)

1. Ve a: https://vercel.com
2. Sign up con GitHub
3. "Add New Project"
4. Importa: `DilanRojasca/PetRescue`
5. Configura:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: Pega la URL de Render (sin `/api/v1`)
7. "Deploy"
8. **¡Listo!** Tu app estará en: `https://petrescue.vercel.app`

---

## 🎯 Opción 2: Railway (Todo en uno) - 7 minutos

### Paso 1: Desplegar Backend (3 min)

1. Ve a: https://railway.app
2. Sign up con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona: `DilanRojasca/PetRescue`
5. Railway detectará automáticamente que es Python
6. Configura:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Espera a que despliegue
8. Haz clic en el servicio → "Settings" → "Generate Domain"
9. **Copia la URL** (ej: `https://petrescue-backend.up.railway.app`)

### Paso 2: Desplegar Frontend (4 min)

1. En el mismo proyecto de Railway, "New Service" → "GitHub Repo"
2. Selecciona el mismo repo: `DilanRojasca/PetRescue`
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
4. **Environment Variables**:
   - `VITE_API_URL` = URL del backend (del paso 1)
5. "Settings" → "Generate Domain"
6. **¡Listo!** Tu app estará en la URL generada

---

## ✅ Verificación

### Backend
Abre: `https://tu-backend-url/api/v1/health`
Deberías ver: `{"status":"ok"}`

### Frontend
Abre la URL de Vercel o Railway
Deberías ver la aplicación funcionando

---

## 🔧 Solución de Problemas

### CORS Error
- El backend ya está configurado para permitir todos los orígenes
- Si persiste, verifica que la URL del backend sea correcta

### Frontend no carga
- Verifica que `VITE_API_URL` esté configurada correctamente
- Revisa los logs en Vercel/Railway

### Backend no responde
- Revisa los logs en Render/Railway
- Verifica que el Start Command sea correcto

---

## 📝 Notas

- **Vercel**: El frontend se actualiza automáticamente en cada push
- **Railway**: Ambos servicios se actualizan automáticamente
- **Render**: Puede tardar 30-60 segundos en responder si está inactivo (free tier)

