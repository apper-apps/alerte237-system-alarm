import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useGeolocation } from "@/hooks/useGeolocation"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import L from "leaflet"

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
})

function LocationMarker({ position, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng)
    }
  })

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15)
    }
  }, [position, map])

  return position === null ? null : <Marker position={position} />
}

const LocationPicker = ({ 
  onLocationSelect, 
  initialPosition = null,
  className = "" 
}) => {
  const { location, loading, error, getCurrentPosition } = useGeolocation()
  const [selectedPosition, setSelectedPosition] = useState(initialPosition)
  const [address, setAddress] = useState("")
  
  // Default to Yaoundé, Cameroon
  const defaultCenter = [3.8480, 11.5021]
  const mapCenter = selectedPosition || (location ? [location.latitude, location.longitude] : defaultCenter)

  useEffect(() => {
    if (location && !selectedPosition) {
      const newPosition = [location.latitude, location.longitude]
      setSelectedPosition(newPosition)
      onLocationSelect({
        lat: location.latitude,
        lng: location.longitude,
        address: "Position actuelle"
      })
    }
  }, [location, selectedPosition, onLocationSelect])

  const handleLocationClick = (latlng) => {
    const newPosition = [latlng.lat, latlng.lng]
    setSelectedPosition(newPosition)
    onLocationSelect({
      lat: latlng.lat,
      lng: latlng.lng,
      address: address || `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
    })
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4 font-display">
        Localisation du signalement
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={getCurrentPosition}
            loading={loading}
            variant="primary"
            icon="MapPin"
            size="sm"
          >
            Ma position
          </Button>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              {error}
            </p>
          )}
        </div>
        
        <Input
          label="Adresse (optionnel)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Entrez une adresse ou description du lieu"
          icon="MapPin"
        />
        
        <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={selectedPosition}
              onLocationSelect={handleLocationClick}
            />
          </MapContainer>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cliquez sur la carte pour sélectionner la localisation du signalement
        </p>
      </div>
    </Card>
  )
}

export default LocationPicker