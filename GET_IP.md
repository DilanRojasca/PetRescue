# 📱 Cómo hacer que el backend sea accesible desde tu celular

## Opción 1: Usar la IP de tu PC (Rápido para desarrollo)

### Paso 1: Obtener la IP de tu PC

1. Abre PowerShell o CMD
2. Ejecuta: `ipconfig`
3. Busca "IPv4 Address" en "Adaptador de Ethernet" o "Adaptador de LAN inalámbrica"
4. Copia esa IP (ej: `192.168.1.100`)

### Paso 2: Iniciar el backend con acceso de red

En lugar de:
```bash
uvicorn app.main:app --reload
```

Usa:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

O ejecuta el archivo: `backend/start-network.bat`

### Paso 3: Configurar Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - Name: `VITE_API_URL`
   - Value: `http://TU_IP:8000` (reemplaza TU_IP con la IP de tu PC)
4. Save y Redeploy

### Paso 4: Conectar tu celular a la misma red WiFi

- Tu celular y tu PC deben estar en la misma red WiFi
- Abre la app en Vercel desde tu celular
- Debería funcionar

## ⚠️ Limitaciones

- Solo funciona cuando tu PC está encendida
- Solo funciona en la misma red WiFi
- No funciona desde fuera de tu casa/oficina

## ✅ Solución Permanente: Desplegar el Backend

Para que funcione desde cualquier lugar, necesitas desplegar el backend en un servicio como Render, Railway, etc.

