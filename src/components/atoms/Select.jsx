import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Select = forwardRef(({ 
  label,
  error,
  icon,
  options = [],
  placeholder = "Sélectionner...",
  className = "",
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
        
        <select
          ref={ref}
          className={cn(
            "input-field appearance-none cursor-pointer pr-10",
            icon && "pl-10",
            error && "border-red-500 focus:ring-red-200 focus:border-red-500",
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select