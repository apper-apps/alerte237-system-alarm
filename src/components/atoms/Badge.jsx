import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  icon,
  className = "",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center gap-1 font-semibold rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400",
    accent: "bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-400",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-1.5 text-base"
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={iconSizes[size]} />}
      {children}
    </span>
  )
}

export default Badge