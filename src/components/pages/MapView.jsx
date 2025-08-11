import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import MapView from "@/components/organisms/MapView"
import CategoryFilter from "@/components/molecules/CategoryFilter"
import { reportsService } from "@/services/api/reportsService"
import { categoriesService } from "@/services/api/categoriesService"

const MapViewPage = () => {
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    transmitted: 0,
    resolved: 0
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [reportsData, categoriesData] = await Promise.all([
        reportsService.getAll(),
        categoriesService.getAll()
      ])
      
      // Only show reports with valid coordinates
      const validReports = reportsData.filter(r => r.latitude && r.longitude)
      
      setReports(validReports)
      setCategories(categoriesData)
      
      // Calculate stats
      const total = validReports.length
      const pending = validReports.filter(r => r.status === "pending").length
      const transmitted = validReports.filter(r => r.status === "transmitted").length
      const resolved = validReports.filter(r => r.status === "resolved").length
      
      setStats({ total, pending, transmitted, resolved })
      
    } catch (err) {
      setError("Impossible de charger les signalements sur la carte")
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter reports
  useEffect(() => {
    let filtered = reports

    if (selectedCategory) {
      filtered = filtered.filter(report => report.category === selectedCategory)
    }

    if (selectedStatus) {
      filtered = filtered.filter(report => report.status === selectedStatus)
    }

    setFilteredReports(filtered)
  }, [reports, selectedCategory, selectedStatus])

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedStatus("")
  }

  if (loading) return <Loading size="lg" text="Chargement de la carte..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="h-screen flex flex-col african-pattern">
      {/* Header */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
                <ApperIcon name="Map" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-display">
                  Carte interactive des signalements
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredReports.length} signalement{filteredReports.length !== 1 ? "s" : ""} affiché{filteredReports.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.pending} En attente
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.transmitted} Transmis
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.resolved} Résolus
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "primary" : "ghost"}
                icon="Filter"
                size="sm"
              >
                Filtres
              </Button>
              
              <Button
                onClick={loadData}
                variant="ghost"
                icon="RefreshCw"
                size="sm"
              >
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 font-display">
                  Filtres de carte
                </h2>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="ghost"
                  icon="X"
                  size="sm"
                />
              </div>
              
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onClear={clearFilters}
                className="border-0 shadow-none bg-transparent p-0"
              />
              
              {/* Map Legend */}
              <Card className="mt-6 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Légende
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md transform rotate-45"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">En attente</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md transform rotate-45"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Transmis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md transform rotate-45"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Résolu</span>
                  </div>
                </div>
              </Card>
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => window.location.href = "/report"}
                  variant="primary"
                  icon="Plus"
                  className="w-full"
                >
                  Nouveau signalement
                </Button>
                
                <Button
                  onClick={() => window.location.href = "/profile"}
                  variant="secondary"
                  icon="User"
                  className="w-full"
                >
                  Mes signalements
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          {filteredReports.length > 0 ? (
            <MapView 
              reports={filteredReports} 
              height="100%" 
              zoom={11}
              center={[3.8480, 11.5021]} // Yaoundé, Cameroon
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <Empty
                icon="Map"
                title={
                  selectedCategory || selectedStatus
                    ? "Aucun signalement trouvé avec ces filtres"
                    : "Aucun signalement géolocalisé"
                }
                message={
                  selectedCategory || selectedStatus
                    ? "Essayez de modifier vos critères de filtrage."
                    : "Les signalements avec coordonnées GPS apparaîtront ici."
                }
                actionLabel={
                  selectedCategory || selectedStatus
                    ? "Effacer les filtres"
                    : "Faire un signalement"
                }
                onAction={
                  selectedCategory || selectedStatus
                    ? clearFilters
                    : () => window.location.href = "/report"
                }
              />
            </div>
          )}
          
          {/* Floating Action Button for Mobile */}
          <div className="absolute bottom-6 right-6 z-[1000]">
            <Button
              onClick={() => window.location.href = "/report"}
              variant="primary"
              icon="Plus"
              size="lg"
              className="shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <span className="hidden sm:inline">Signaler</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapViewPage