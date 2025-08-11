import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  icon = "FileX",
  title = "Aucune donnée disponible", 
  message = "Il n'y a aucun élément à afficher pour le moment.",
  actionLabel,
  onAction,
  showPattern = true
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto relative ${showPattern ? 'african-pattern' : ''}`}>
      {showPattern && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-secondary-50/30 to-accent-50/50 dark:from-primary-900/10 dark:via-secondary-900/10 dark:to-accent-900/10 rounded-2xl"></div>
      )}
      
      <div className="relative z-10">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-full animate-pulse-soft"></div>
          <div className="relative bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-full p-6">
            <ApperIcon name={icon} size={48} className="text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
          {message}
        </p>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            size="lg"
            icon="Plus"
            className="animate-bounce-subtle shadow-xl hover:shadow-2xl"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty