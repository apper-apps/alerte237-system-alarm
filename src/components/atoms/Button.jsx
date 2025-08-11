import React, { forwardRef } from "react";
import AppIcon from "@/components/atoms/AppIcon";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon, 
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    accent: "btn-accent",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-200",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 focus:ring-gray-200",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm gap-2",
    md: "px-6 py-2.5 text-base gap-2",
    lg: "px-8 py-3 text-lg gap-3",
    xl: "px-10 py-4 text-xl gap-4"
  }

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize[size]} 
          className="animate-spin" 
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button