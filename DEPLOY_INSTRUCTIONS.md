# 🚀 Guía Rápida de Despliegue - PetRescue

Esta guía te llevará paso a paso para desplegar tanto el backend como el frontend.

## ⚡ Despliegue Rápido (5 minutos)

### Paso 1: Desplegar Backend en Render.com (2 minutos)

1. **Abre**: https://render.com
2. **Crea cuenta** o inicia sesión (puedes usar GitHub para login rápido)
3. **Haz clic en**: "New +" → "Web Service"
4. **Conecta tu repositorio**:
   - Si es la primera vez, autoriza Render para acceder a GitHub
   - Selecciona: `DilanRojasca/PetRescue`
5. **Configura el servicio**:
   ```
   Name: petrescue-backend
   Environment: Python 3
   Region: (elige el más cercano a ti)
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. **Haz clic en**: "Create Web Service"
7. **Espera 2-3 minutos** mientras Render construye y despliega
8. **Copia la URL** que aparece (ej: `https://petrescue-backend.onrender.com`)

### Paso 2: Configurar GitHub Secret (1 minuto)

1. **Abre**: https://github.com/DilanRojasca/PetRescue/settings/secrets/actions
2. **Haz clic en**: "New repository secret"
3. **Configura**:
   - **Name**: `VITE_API_URL`
   - **Secret**: Pega la URL de Render (ej: `https://petrescue-backend.onrender.com`)
4. **Haz clic en**: "Add secret"

### Paso 3: Habilitar GitHub Pages (30 segundos)

1. **Abre**: https://github.com/DilanRojasca/PetRescue/settings/pages
2. **En "Source"**, selecciona: **GitHub Actions**
3. **Guarda** (no necesitas hacer clic en ningún botón, se guarda automáticamente)

### Paso 4: Verificar Despliegue (1 minuto)

1. **Ve a**: https://github.com/DilanRojasca/PetRescue/actions
2. **Verás** que el workflow "Deploy to GitHub Pages" se está ejecutando
3. **Espera 2-3 minutos** hasta que veas una ✅ verde
4. **Tu app estará en**: https://dilanrojasca.github.io/PetRescue/

## ✅ Verificación

### Verificar Backend
Abre en tu navegador: `https://tu-backend-url.onrender.com/api/v1/health`

Deberías ver: `{"status":"ok"}`

### Verificar Frontend
Abre: https://dilanrojasca.github.io/PetRescue/

Deberías ver la aplicación funcionando.

## 🔧 Solución de Problemas

### El backend no responde
- Verifica que el servicio esté "Live" en Render
- Revisa los logs en Render para ver errores
- Asegúrate de que el Start Command sea correcto

### El frontend no se conecta al backend
- Verifica que el secret `VITE_API_URL` esté configurado correctamente
- Asegúrate de que la URL no tenga `/` al final
- Revisa la consola del navegador (F12) para ver errores

### CORS Error
- El backend ya está configurado para permitir GitHub Pages
- Si ves errores de CORS, verifica que la URL del backend sea correcta

## 📝 Notas Importantes

- **Render.com** puede tardar 30-60 segundos en responder si el servicio está inactivo (plan gratuito)
- **GitHub Pages** puede tardar 2-3 minutos en actualizar después del despliegue
- Las **imágenes** se guardan en el servidor de Render (plan gratuito tiene límites de espacio)

## 🎯 URLs Importantes

- **Frontend**: https://dilanrojasca.github.io/PetRescue/
- **Backend API**: `https://tu-backend-url.onrender.com/api/v1/`
- **Backend Health**: `https://tu-backend-url.onrender.com/api/v1/health`
- **GitHub Actions**: https://github.com/DilanRojasca/PetRescue/actions

