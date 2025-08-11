import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  title = "Une erreur est survenue", 
  message = "Nous n'avons pas pu charger les données. Veuillez réessayer.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
          className="animate-bounce-subtle"
        >
          Réessayer
        </Button>
      )}
    </div>
  )
}

export default Error