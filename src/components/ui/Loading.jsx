import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ size = "md", text = "Chargement...", fullScreen = false }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <ApperIcon 
              name="Loader2" 
              className={`${sizes[size]} text-primary-600 animate-spin`}
            />
          </div>
          <p className={`${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium`}>
            {text}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full animate-ping opacity-75"></div>
        <ApperIcon 
          name="Loader2" 
          className={`${sizes[size]} text-primary-600 animate-spin relative z-10`}
        />
      </div>
      <p className={`${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium`}>
        {text}
      </p>
    </div>
  )
}

export default Loading