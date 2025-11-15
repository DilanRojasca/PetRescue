# 🚀 Guía de Despliegue en GitHub Pages

## ✅ Pasos Completados

1. ✅ Creada rama `deploy` con todos los cambios
2. ✅ Configurado `vite.config.ts` con `base: "/PetRescue/"`
3. ✅ Creado workflow de GitHub Actions (`.github/workflows/deploy.yml`)
4. ✅ Cambios subidos al repositorio

## 📋 Pasos para Habilitar GitHub Pages

### 1. Habilitar GitHub Pages en el Repositorio

1. Ve a tu repositorio: https://github.com/DilanRojasca/PetRescue
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages** (en la sección "Code and automation")
4. En **Source**, selecciona:
   - **Source**: `GitHub Actions`
5. Guarda los cambios

### 2. Verificar el Workflow

El workflow se ejecutará automáticamente cuando:
- Hagas push a la rama `deploy`
- O lo ejecutes manualmente desde la pestaña **Actions**

### 3. Acceder a tu Aplicación

Una vez que el workflow termine de ejecutarse (puede tardar 2-3 minutos), tu aplicación estará disponible en:

**https://dilanrojasca.github.io/PetRescue/**

## 🔧 Configuración Adicional

### Si necesitas cambiar la URL base

Si tu repositorio tiene un nombre diferente o quieres usar una URL personalizada, actualiza:

1. `frontend/vite.config.ts` - Cambia el valor de `base`
2. El workflow se ejecutará automáticamente al hacer push

### Variables de Entorno

Para producción, asegúrate de que:
- La API del backend esté desplegada y accesible
- Actualiza la URL de la API en `frontend/src/services/api.ts` si es necesario
- Configura tu Google Maps API Key en `frontend/src/components/AnimalMap.tsx`

## 📝 Notas Importantes

- El workflow está configurado para ejecutarse en la rama `deploy`
- Si quieres cambiar la rama, edita `.github/workflows/deploy.yml` línea 5
- El build se genera automáticamente en cada push
- GitHub Pages puede tardar unos minutos en actualizar después del despliegue

## 🐛 Solución de Problemas

### El workflow falla
- Verifica que Node.js 18 esté disponible (el workflow lo instala automáticamente)
- Revisa los logs en la pestaña **Actions** de GitHub

### La página no carga
- Verifica que GitHub Pages esté habilitado con fuente "GitHub Actions"
- Espera 2-3 minutos después del despliegue
- Verifica que la URL sea correcta: `https://dilanrojasca.github.io/PetRescue/`

### Los recursos no cargan
- Verifica que `base: "/PetRescue/"` en `vite.config.ts` coincida con el nombre de tu repositorio
- Asegúrate de que todas las rutas sean relativas

## 🔄 Actualizar el Despliegue

Para actualizar la aplicación en GitHub Pages:

1. Haz cambios en tu código
2. Haz commit y push a la rama `deploy`:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push origin deploy
   ```
3. El workflow se ejecutará automáticamente
4. Espera 2-3 minutos y verifica la actualización

