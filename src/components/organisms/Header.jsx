import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import ThemeToggle from "@/components/molecules/ThemeToggle"
import Button from "@/components/atoms/Button"

const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Accueil", path: "/", icon: "Home" },
    { label: "Signaler", path: "/report", icon: "Plus" },
    { label: "Carte", path: "/map", icon: "Map" },
    { label: "Mon Profil", path: "/profile", icon: "User" }
  ]

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-2 rounded-xl transform group-hover:scale-105 transition-transform duration-200">
                <ApperIcon name="Shield" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">
                  Alerte237
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Signalement Citoyen
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link px-4 py-2 rounded-lg text-sm"
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <Button
                onClick={() => navigate("/report")}
                variant="primary"
                size="sm"
                icon="Plus"
                className="hidden sm:flex"
              >
                Signaler
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link w-full rounded-lg"
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-0"
            >
              <ApperIcon name={item.icon} size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Header