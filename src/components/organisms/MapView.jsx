import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import StatusBadge from "@/components/molecules/StatusBadge"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import L from "leaflet"

// Custom markers for different statuses
const createCustomIcon = (status) => {
  const colors = {
    pending: "#f59e0b",
    transmitted: "#3b82f6", 
    resolved: "#22c55e"
  }
  
  const color = colors[status] || colors.pending
  
  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  })
}

const MapView = ({ reports = [], center = [3.8480, 11.5021], zoom = 10, height = "400px" }) => {
  const [mapCenter, setMapCenter] = useState(center)

  const getCategoryIcon = (category) => {
    const icons = {
      "Documents perdus": "FileX",
      "Routes dégradées": "Construction", 
      "Incendies": "Flame",
      "Urgences médicales": "Stethoscope",
      "Sécurité": "Shield",
      "Environnement": "TreePine",
      "Services publics": "Building",
      "Autres": "AlertTriangle"
    }
    return icons[category] || "AlertTriangle"
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Documents perdus": "primary",
      "Routes dégradées": "warning",
      "Incendies": "error", 
      "Urgences médicales": "error",
      "Sécurité": "info",
      "Environnement": "success",
      "Services publics": "secondary",
      "Autres": "default"
    }
    return colors[category] || "default"
  }

  useEffect(() => {
    if (reports.length > 0) {
      // Calculate center based on all reports
      const validReports = reports.filter(r => r.latitude && r.longitude)
      if (validReports.length > 0) {
        const avgLat = validReports.reduce((sum, r) => sum + r.latitude, 0) / validReports.length
        const avgLng = validReports.reduce((sum, r) => sum + r.longitude, 0) / validReports.length
        setMapCenter([avgLat, avgLng])
      }
    }
  }, [reports])

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports
          .filter(report => report.latitude && report.longitude)
          .map((report) => (
            <Marker
              key={report.Id}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(report.status)}
            >
              <Popup className="custom-popup" maxWidth={320}>
                <div className="p-4 min-w-[280px]">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h4 className="font-semibold text-lg text-gray-900 font-display">
                      {report.title}
                    </h4>
                    <StatusBadge status={report.status} />
                  </div>
                  
                  {/* Category */}
                  <Badge 
                    variant={getCategoryColor(report.category)}
                    icon={getCategoryIcon(report.category)}
                    className="mb-3"
                  >
                    {report.category}
                  </Badge>
                  
                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  {/* Image */}
                  {report.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={report.imageUrl} 
                        alt="Signalement"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-600 pt-3 border-t border-gray-200">
                    <span>
                      {format(new Date(report.createdAt), "PPP", { locale: fr })}
                    </span>
                    <span className="font-mono">
                      #{report.Id}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

export default MapView