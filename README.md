# 🐾 PetRescue Map

Aplicación para reportar animales callejeros o en riesgo, permitiendo coordinar ayuda entre voluntarios y refugios.

## ✨ Características

- 📸 **Subida de fotos** con extracción automática de coordenadas GPS desde metadatos EXIF
- 📍 **Geolocalización automática** para obtener tu ubicación actual
- 🗺️ **Mapa interactivo** con Google Maps mostrando todos los casos reportados
- 🔄 **Actualización en tiempo real** del mapa al crear nuevos reportes
- 🎯 **API REST completa** con FastAPI

## 🚀 Instalación y Ejecución

### Backend (FastAPI)

1. Instalar dependencias:
```bash
cd backend
pip install -r requirements.txt
```

2. Iniciar el servidor:
```bash
uvicorn app.main:app --reload
```

El backend estará disponible en: http://127.0.0.1:8000
- Documentación API: http://127.0.0.1:8000/docs

### Frontend (React + Vite)

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. **IMPORTANTE**: Configurar Google Maps API Key
   - Obtén una API Key gratuita en: https://console.cloud.google.com/google/maps-apis
   - Abre `frontend/src/components/AnimalMap.tsx`
   - Reemplaza `YOUR_GOOGLE_MAPS_API_KEY` con tu API Key

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📖 Cómo usar la aplicación

### Reportar un animal

1. **Opción 1: Con foto que tiene GPS**
   - Selecciona una foto tomada con un smartphone (las fotos de teléfonos modernos incluyen coordenadas GPS)
   - La aplicación extraerá automáticamente las coordenadas de la foto
   - Agrega una descripción del animal
   - Envía el reporte

2. **Opción 2: Usar ubicación actual**
   - Haz clic en "📍 Usar mi ubicación actual"
   - Permite que el navegador acceda a tu ubicación
   - Toma o selecciona una foto del animal
   - Agrega una descripción
   - Envía el reporte

3. **Opción 3: Ingresar coordenadas manualmente**
   - Ingresa latitud y longitud manualmente
   - Sube una foto (opcional)
   - Agrega una descripción
   - Envía el reporte

### Ver casos en el mapa

- El mapa muestra todos los casos reportados con marcadores
- Haz clic en un marcador para ver los detalles del caso
- Los nuevos reportes aparecen automáticamente en el mapa

## 🛠️ Tecnologías

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Uvicorn**: Servidor ASGI
- **Pillow**: Procesamiento de imágenes y extracción de EXIF
- **Pydantic**: Validación de datos

### Frontend
- **React**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool rápido
- **Axios**: Cliente HTTP
- **Google Maps API**: Visualización de mapas
- **ExifReader**: Lectura de metadatos de imágenes

## 📁 Estructura del Proyecto

```
PetRescue/
├── backend/
│   ├── app/
│   │   ├── main.py                    # Configuración de la app
│   │   ├── api/v1/routes/
│   │   │   ├── animals.py             # Endpoints de animales
│   │   │   ├── health.py              # Health check
│   │   │   └── upload.py              # Upload de imágenes
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── repositories/
│   ├── uploads/                       # Imágenes subidas
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.tsx                    # Componente principal
    │   ├── components/
    │   │   ├── AnimalMap.tsx          # Mapa con Google Maps
    │   │   └── AnimalReportForm.tsx   # Formulario de reporte
    │   └── services/
    │       └── api.ts                 # Cliente API
    ├── package.json
    └── vite.config.ts
```

## 🔑 API Endpoints

### Animales
- `GET /api/v1/animals/` - Listar todos los casos
- `POST /api/v1/animals/` - Crear nuevo caso

### Upload
- `POST /api/v1/upload/image` - Subir imagen y extraer GPS

### Health
- `GET /api/v1/health` - Health check

## 🎯 Próximas características

- [ ] Sistema de usuarios y autenticación
- [ ] "Adoptar un caso" para hacer seguimiento
- [ ] Notificaciones cuando alguien se acerca a ayudar
- [ ] Dashboard para refugios y autoridades
- [ ] Filtros de búsqueda por estado, fecha, tipo de animal
- [ ] Chat entre voluntarios
- [ ] Historial de casos resueltos

## 📝 Notas

- Las fotos se guardan en la carpeta `backend/uploads/`
- El backend usa almacenamiento en memoria (los datos se pierden al reiniciar)
- Para producción, se recomienda usar una base de datos real
- La extracción de GPS solo funciona si la foto tiene metadatos EXIF

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request.

## 📄 Licencia

MIT
