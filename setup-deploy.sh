#!/bin/bash

# Script para configurar el despliegue del backend y frontend
# Este script te guiará paso a paso

echo "🚀 Configurando despliegue de PetRescue"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== PASO 1: Desplegar Backend en Render.com ===${NC}"
echo ""
echo "1. Ve a https://render.com y crea una cuenta (o inicia sesión)"
echo "2. Haz clic en 'New +' → 'Web Service'"
echo "3. Conecta tu repositorio de GitHub: https://github.com/DilanRojasca/PetRescue"
echo "4. Configura el servicio:"
echo "   - Name: petrescue-backend"
echo "   - Environment: Python 3"
echo "   - Build Command: cd backend && pip install -r requirements.txt"
echo "   - Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
echo "   - Root Directory: backend"
echo "5. Haz clic en 'Create Web Service'"
echo ""
read -p "Presiona Enter cuando hayas completado el despliegue en Render..."

echo ""
echo -e "${YELLOW}=== PASO 2: Obtener URL del Backend ===${NC}"
echo ""
read -p "Ingresa la URL de tu backend desplegado (ej: https://petrescue-backend.onrender.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Error: Debes ingresar una URL válida"
    exit 1
fi

# Remover trailing slash si existe
BACKEND_URL=${BACKEND_URL%/}

echo ""
echo -e "${GREEN}✓ URL del backend configurada: $BACKEND_URL${NC}"
echo ""

echo -e "${YELLOW}=== PASO 3: Configurar GitHub Secret ===${NC}"
echo ""
echo "Ahora necesitas agregar esta URL como secret en GitHub:"
echo ""
echo "1. Ve a: https://github.com/DilanRojasca/PetRescue/settings/secrets/actions"
echo "2. Haz clic en 'New repository secret'"
echo "3. Name: VITE_API_URL"
echo "4. Secret: $BACKEND_URL"
echo "5. Haz clic en 'Add secret'"
echo ""
read -p "Presiona Enter cuando hayas agregado el secret en GitHub..."

echo ""
echo -e "${YELLOW}=== PASO 4: Habilitar GitHub Pages ===${NC}"
echo ""
echo "1. Ve a: https://github.com/DilanRojasca/PetRescue/settings/pages"
echo "2. En 'Source', selecciona: GitHub Actions"
echo "3. Guarda los cambios"
echo ""
read -p "Presiona Enter cuando hayas habilitado GitHub Pages..."

echo ""
echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo "El workflow se ejecutará automáticamente y en unos minutos tu app estará disponible en:"
echo "https://dilanrojasca.github.io/PetRescue/"
echo ""
echo "Para verificar el estado del despliegue:"
echo "https://github.com/DilanRojasca/PetRescue/actions"

