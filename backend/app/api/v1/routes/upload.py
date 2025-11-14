"""Upload endpoint for animal images with EXIF extraction."""

from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import os
import uuid
from typing import Optional, Dict, Any

router = APIRouter(prefix="/upload")


def extract_gps_from_exif(exif_data: Dict[str, Any]) -> Optional[tuple[float, float]]:
    """Extract GPS coordinates from EXIF data.
    
    Returns (latitude, longitude) or None if GPS data is not available.
    """
    if not exif_data:
        return None
    
    gps_info = exif_data.get("GPSInfo")
    if not gps_info:
        return None
    
    def convert_to_degrees(value):
        """Convert GPS coordinates to degrees."""
        d, m, s = value
        return d + (m / 60.0) + (s / 3600.0)
    
    try:
        gps_latitude = gps_info.get(2)  # GPSLatitude
        gps_latitude_ref = gps_info.get(1)  # N or S
        gps_longitude = gps_info.get(4)  # GPSLongitude
        gps_longitude_ref = gps_info.get(3)  # E or W
        
        if gps_latitude and gps_longitude and gps_latitude_ref and gps_longitude_ref:
            lat = convert_to_degrees(gps_latitude)
            if gps_latitude_ref != "N":
                lat = -lat
            
            lon = convert_to_degrees(gps_longitude)
            if gps_longitude_ref != "E":
                lon = -lon
            
            return (lat, lon)
    except Exception:
        pass
    
    return None


@router.post("/image", summary="Upload animal image and extract GPS coordinates")
async def upload_image(file: UploadFile = File(...)):
    """Upload an animal image and automatically extract GPS coordinates from EXIF data.
    
    Returns the image URL and coordinates if available.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Save file
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, unique_filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Extract EXIF data
    latitude = None
    longitude = None
    
    try:
        image = Image.open(file_path)
        exif_data = image.getexif()
        
        if exif_data:
            # Convert EXIF data to readable format
            exif_dict = {}
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "GPSInfo":
                    gps_data = {}
                    for gps_tag_id in value:
                        gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                        gps_data[gps_tag] = value[gps_tag_id]
                    exif_dict[tag] = gps_data
                else:
                    exif_dict[tag] = value
            
            # Extract GPS coordinates
            coords = extract_gps_from_exif(exif_dict)
            if coords:
                latitude, longitude = coords
    except Exception as e:
        # If EXIF extraction fails, continue without coordinates
        print(f"Error extracting EXIF: {e}")
    
    # Return file URL and coordinates
    image_url = f"/uploads/{unique_filename}"
    
    return {
        "image_url": image_url,
        "latitude": latitude,
        "longitude": longitude,
        "has_gps": latitude is not None and longitude is not None
    }
