import React from "react"
import { useTheme } from "@/hooks/useTheme"
import ApperIcon from "@/components/ApperIcon"

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 shadow-md hover:shadow-lg ${className}`}
      title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
    >
      <ApperIcon 
        name={theme === "light" ? "Moon" : "Sun"} 
        size={20} 
        className="text-gray-600 dark:text-gray-400 transition-transform duration-300 rotate-0 dark:rotate-180" 
      />
    </button>
  )
}

export default ThemeToggle