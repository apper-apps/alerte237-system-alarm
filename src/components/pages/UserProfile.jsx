import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ReportCard from "@/components/organisms/ReportCard"
import CategoryFilter from "@/components/molecules/CategoryFilter"
import SearchBar from "@/components/molecules/SearchBar"
import { reportsService } from "@/services/api/reportsService"
import { categoriesService } from "@/services/api/categoriesService"

const UserProfile = () => {
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    transmitted: 0,
    resolved: 0
  })

  // Mock user data
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    joinDate: "2024-01-15",
    avatar: null
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [reportsData, categoriesData] = await Promise.all([
        reportsService.getAll(),
        categoriesService.getAll()
      ])
      
      setReports(reportsData)
      setCategories(categoriesData)
      
      // Calculate user stats
      const total = reportsData.length
      const pending = reportsData.filter(r => r.status === "pending").length
      const transmitted = reportsData.filter(r => r.status === "transmitted").length
      const resolved = reportsData.filter(r => r.status === "resolved").length
      
      setStats({ total, pending, transmitted, resolved })
      
    } catch (err) {
      setError("Impossible de charger vos signalements")
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter reports based on search and filters
  useEffect(() => {
    let filtered = reports

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(report => report.category === selectedCategory)
    }

    if (selectedStatus) {
      filtered = filtered.filter(report => report.status === selectedStatus)
    }

    setFilteredReports(filtered)
  }, [reports, searchQuery, selectedCategory, selectedStatus])

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce signalement ?")) {
      return
    }

    try {
      await reportsService.delete(reportId)
      setReports(prev => prev.filter(r => r.Id !== reportId))
      toast.success("Signalement supprimé avec succès")
    } catch (err) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedStatus("")
  }

  if (loading) return <Loading size="lg" text="Chargement de votre profil..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen py-8 px-4 african-pattern">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                <ApperIcon name="User" size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Membre depuis janvier 2024
                </p>
              </div>
            </div>
            
            <div className="flex-1"></div>
            
            <Button
              onClick={() => window.location.href = "/report"}
              variant="primary"
              icon="Plus"
              size="lg"
            >
              Nouveau signalement
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card gradient className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.total}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Total
            </p>
          </Card>
          
          <Card gradient className="p-6 text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.pending}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              En attente
            </p>
          </Card>
          
          <Card gradient className="p-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Send" size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.transmitted}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Transmis
            </p>
          </Card>
          
          <Card gradient className="p-6 text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.resolved}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Résolus
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onClear={clearFilters}
              />
              
              {/* Quick Stats */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Progression
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Taux de résolution</span>
                    <span className="font-semibold text-green-600">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-display">
                    Mes signalements
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredReports.length} signalement{filteredReports.length !== 1 ? "s" : ""}
                    {(selectedCategory || selectedStatus || searchQuery) && ` trouvé${filteredReports.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                
                <div className="w-full md:w-auto">
                  <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Rechercher dans mes signalements..."
                    className="min-w-[300px]"
                  />
                </div>
              </div>
              
              {filteredReports.length > 0 ? (
                <div className="space-y-6">
                  {filteredReports.map((report) => (
                    <ReportCard
                      key={report.Id}
                      report={report}
                      showActions={true}
                      onDelete={() => handleDeleteReport(report.Id)}
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  icon={searchQuery || selectedCategory || selectedStatus ? "Search" : "FileX"}
                  title={
                    searchQuery || selectedCategory || selectedStatus
                      ? "Aucun signalement trouvé"
                      : "Vous n'avez pas encore de signalement"
                  }
                  message={
                    searchQuery || selectedCategory || selectedStatus
                      ? "Essayez de modifier vos critères de recherche ou effacez les filtres."
                      : "Commencez par signaler un problème dans votre communauté."
                  }
                  actionLabel={
                    searchQuery || selectedCategory || selectedStatus
                      ? "Effacer les filtres"
                      : "Faire un signalement"
                  }
                  onAction={
                    searchQuery || selectedCategory || selectedStatus
                      ? clearFilters
                      : () => window.location.href = "/report"
                  }
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile