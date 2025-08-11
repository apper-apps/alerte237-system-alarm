import React from "react"
import Badge from "@/components/atoms/Badge"

const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    pending: {
      variant: "warning",
      icon: "Clock",
      text: "En attente"
    },
    transmitted: {
      variant: "info", 
      icon: "Send",
      text: "Transmis"
    },
    resolved: {
      variant: "success",
      icon: "CheckCircle",
      text: "Résolu"
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      className={`status-badge status-${status} ${className}`}
    >
      {config.text}
    </Badge>
  )
}

export default StatusBadge