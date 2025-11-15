# 📱 Solución Rápida: Backend Accesible desde Celular

## Tu IP es: `192.168.78.230`

## Pasos Rápidos:

### 1. Iniciar Backend con Acceso de Red

**Opción A: Usar el script**
```bash
cd backend
start-network.bat
```

**Opción B: Comando manual**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Configurar Vercel

1. Ve a: https://vercel.com → Tu proyecto → Settings → Environment Variables
2. Agrega o actualiza:
   - **Name**: `VITE_API_URL`
   - **Value**: `http://192.168.78.230:8000`
3. **IMPORTANTE**: Selecciona todos los ambientes (Production, Preview, Development)
4. **Save**
5. Ve a **Deployments** → Haz clic en los 3 puntos del último deployment → **Redeploy**

### 3. Verificar Firewall

Windows puede bloquear el puerto. Si no funciona:

1. Abre "Windows Defender Firewall"
2. "Configuración avanzada"
3. "Reglas de entrada" → "Nueva regla"
4. Tipo: Puerto → TCP → Puerto específico: 8000
5. Permitir la conexión
6. Aplicar a todos los perfiles
7. Nombre: "PetRescue Backend"

### 4. Probar desde Celular

1. Asegúrate de que tu celular esté en la **misma red WiFi** que tu PC
2. Abre la app en Vercel desde tu celular
3. Debería funcionar ahora

## ⚠️ Importante

- **Solo funciona cuando tu PC está encendida**
- **Solo funciona en la misma red WiFi**
- **No funciona desde fuera de tu casa/oficina**

## ✅ Solución Permanente

Para que funcione desde cualquier lugar y dispositivo, despliega el backend en:
- **Render.com** (gratis, fácil)
- **Railway.app** (gratis con $5/mes)
- **Fly.io** (gratis)

¿Quieres que te ayude a desplegar el backend ahora?

