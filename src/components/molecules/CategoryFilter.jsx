import React from "react"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus,
  onStatusChange,
  onClear,
  className = "" 
}) => {
  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "transmitted", label: "Transmis" },
    { value: "resolved", label: "Résolu" }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }))

  const hasFilters = selectedCategory || selectedStatus

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4 font-display">
        Filtrer les signalements
      </h3>
      
      <div className="space-y-4">
        <Select
          label="Catégorie"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
          placeholder="Toutes les catégories"
          icon="Filter"
        />
        
        <Select
          label="Statut"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
          placeholder="Tous les statuts"
          icon="CheckSquare"
        />
        
        {hasFilters && (
          <Button
            onClick={onClear}
            variant="ghost"
            icon="X"
            size="sm"
            className="w-full"
          >
            Effacer les filtres
          </Button>
        )}
      </div>
    </div>
  )
}

export default CategoryFilter