# 🚀 Guía para Desplegar el Backend

Para que el frontend funcione completamente, necesitas desplegar el backend en un servicio de hosting. Aquí te muestro las opciones más populares:

## Opción 1: Render.com (Recomendado - Gratis)

### Pasos:

1. **Crear cuenta en Render.com**: https://render.com

2. **Crear un nuevo Web Service**:
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `PetRescue`

3. **Configuración**:
   - **Name**: `petrescue-backend` (o el nombre que prefieras)
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     cd backend && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Root Directory**: `backend`

4. **Variables de Entorno** (si las necesitas):
   - No son necesarias para el funcionamiento básico

5. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará tu backend
   - Obtendrás una URL como: `https://petrescue-backend.onrender.com`

6. **Actualizar el Frontend**:
   - Ve a tu repositorio en GitHub
   - Settings → Secrets and variables → Actions
   - Agrega un nuevo secret llamado `VITE_API_URL`
   - Valor: `https://petrescue-backend.onrender.com` (tu URL de Render)
   - Guarda

## Opción 2: Railway.app (Gratis con límites)

1. **Crear cuenta**: https://railway.app
2. **Nuevo Proyecto** → "Deploy from GitHub repo"
3. **Seleccionar repositorio** → Configurar:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Obtener URL** y configurar en GitHub Secrets como arriba

## Opción 3: Heroku (Requiere tarjeta de crédito para verificación)

1. **Instalar Heroku CLI**
2. **Login**: `heroku login`
3. **Crear app**: `heroku create petrescue-backend`
4. **Configurar**:
   ```bash
   cd backend
   echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```
5. **Desplegar**: `git push heroku main`

## ⚙️ Configurar CORS en el Backend

Asegúrate de que tu backend permita requests desde GitHub Pages. En `backend/app/main.py`, verifica que CORS esté configurado así:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio de GitHub Pages
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Para producción, es mejor especificar los orígenes permitidos:
```python
allow_origins=[
    "https://dilanrojasca.github.io",
    "http://localhost:5173",  # Para desarrollo local
]
```

## 🔗 Actualizar Frontend con la URL del Backend

Una vez que tengas la URL de tu backend desplegado:

1. **Opción A: Usar GitHub Secrets (Recomendado)**
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega un secret: `VITE_API_URL` = `https://tu-backend-url.com`
   - El workflow usará automáticamente esta variable

2. **Opción B: Editar directamente el workflow**
   - Edita `.github/workflows/deploy.yml`
   - Reemplaza `'https://tu-backend-url.com'` con tu URL real

## ✅ Verificar que Funciona

1. Despliega el backend
2. Verifica que la API responda: `https://tu-backend-url.com/api/v1/health`
3. Actualiza `VITE_API_URL` en GitHub Secrets
4. Haz push a la rama `deploy` para re-desplegar el frontend
5. Verifica que el frontend pueda conectarse al backend

## 📝 Notas Importantes

- **Render.com** puede tardar unos minutos en iniciar el servicio si está inactivo (free tier)
- **Railway** tiene límites de uso en el plan gratuito
- Las imágenes subidas se guardan en el servidor, asegúrate de tener espacio suficiente
- Considera usar un servicio de almacenamiento (S3, Cloudinary) para producción

