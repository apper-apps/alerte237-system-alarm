import React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge" 
import StatusBadge from "@/components/molecules/StatusBadge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const ReportCard = ({ report, onView, onEdit, onDelete, showActions = false }) => {
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

  return (
    <Card className="p-6 space-y-4 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate font-display">
            {report.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {format(new Date(report.createdAt), "PPP 'à' HH:mm", { locale: fr })}
          </p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {/* Category */}
      <Badge 
        variant={getCategoryColor(report.category)}
        icon={getCategoryIcon(report.category)}
        className="w-fit"
      >
        {report.category}
      </Badge>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
        {report.description}
      </p>

      {/* Location */}
      {(report.latitude && report.longitude) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <ApperIcon name="MapPin" size={16} />
          <span>
            {report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}
          </span>
        </div>
      )}

      {/* Image */}
      {report.imageUrl && (
        <div className="rounded-lg overflow-hidden">
          <img 
            src={report.imageUrl} 
            alt="Signalement"
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <ApperIcon name="Eye" size={16} />
          <span>ID: #{report.Id}</span>
        </div>
        
        <div className="flex gap-2">
          {onView && (
            <Button
              onClick={() => onView(report)}
              variant="ghost"
              size="sm"
              icon="Eye"
            >
              Voir
            </Button>
          )}
          
          {showActions && (
            <>
              {onEdit && (
                <Button
                  onClick={() => onEdit(report)}
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                >
                  Modifier
                </Button>
              )}
              
              {onDelete && (
                <Button
                  onClick={() => onDelete(report)}
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Supprimer
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ReportCard