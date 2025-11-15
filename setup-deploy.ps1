# Script PowerShell para configurar el despliegue del backend y frontend
# Este script te guiará paso a paso

Write-Host "🚀 Configurando despliegue de PetRescue" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== PASO 1: Desplegar Backend en Render.com ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a https://render.com y crea una cuenta (o inicia sesión)"
Write-Host "2. Haz clic en 'New +' → 'Web Service'"
Write-Host "3. Conecta tu repositorio de GitHub: https://github.com/DilanRojasca/PetRescue"
Write-Host "4. Configura el servicio:"
Write-Host "   - Name: petrescue-backend"
Write-Host "   - Environment: Python 3"
Write-Host "   - Build Command: cd backend && pip install -r requirements.txt"
Write-Host "   - Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port `$PORT"
Write-Host "   - Root Directory: backend"
Write-Host "5. Haz clic en 'Create Web Service'"
Write-Host ""
Read-Host "Presiona Enter cuando hayas completado el despliegue en Render"

Write-Host ""
Write-Host "=== PASO 2: Obtener URL del Backend ===" -ForegroundColor Yellow
Write-Host ""
$backendUrl = Read-Host "Ingresa la URL de tu backend desplegado (ej: https://petrescue-backend.onrender.com)"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "❌ Error: Debes ingresar una URL válida" -ForegroundColor Red
    exit 1
}

# Remover trailing slash si existe
$backendUrl = $backendUrl.TrimEnd('/')

Write-Host ""
Write-Host "✓ URL del backend configurada: $backendUrl" -ForegroundColor Green
Write-Host ""

Write-Host "=== PASO 3: Configurar GitHub Secret ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ahora necesitas agregar esta URL como secret en GitHub:"
Write-Host ""
Write-Host "1. Ve a: https://github.com/DilanRojasca/PetRescue/settings/secrets/actions"
Write-Host "2. Haz clic en 'New repository secret'"
Write-Host "3. Name: VITE_API_URL"
Write-Host "4. Secret: $backendUrl"
Write-Host "5. Haz clic en 'Add secret'"
Write-Host ""
Read-Host "Presiona Enter cuando hayas agregado el secret en GitHub"

Write-Host ""
Write-Host "=== PASO 4: Habilitar GitHub Pages ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a: https://github.com/DilanRojasca/PetRescue/settings/pages"
Write-Host "2. En 'Source', selecciona: GitHub Actions"
Write-Host "3. Guarda los cambios"
Write-Host ""
Read-Host "Presiona Enter cuando hayas habilitado GitHub Pages"

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "El workflow se ejecutará automáticamente y en unos minutos tu app estará disponible en:"
Write-Host "https://dilanrojasca.github.io/PetRescue/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar el estado del despliegue:"
Write-Host "https://github.com/DilanRojasca/PetRescue/actions" -ForegroundColor Cyan

