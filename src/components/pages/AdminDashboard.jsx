import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import StatusBadge from "@/components/molecules/StatusBadge"
import SearchBar from "@/components/molecules/SearchBar"
import { reportsService } from "@/services/api/reportsService"
import { categoriesService } from "@/services/api/categoriesService"

const AdminDashboard = () => {
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [selectedReports, setSelectedReports] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    transmitted: 0,
    resolved: 0,
    todayReports: 0
  })

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
      
      // Calculate admin stats
      const total = reportsData.length
      const pending = reportsData.filter(r => r.status === "pending").length
      const transmitted = reportsData.filter(r => r.status === "transmitted").length
      const resolved = reportsData.filter(r => r.status === "resolved").length
      
      // Count today's reports
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayReports = reportsData.filter(r => {
        const reportDate = new Date(r.createdAt)
        reportDate.setHours(0, 0, 0, 0)
        return reportDate.getTime() === today.getTime()
      }).length
      
      setStats({ total, pending, transmitted, resolved, todayReports })
      
    } catch (err) {
      setError("Impossible de charger les données administratives")
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

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.Id.toString().includes(searchQuery)
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

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const updatedReport = await reportsService.update(reportId, { status: newStatus })
      setReports(prev => prev.map(r => r.Id === reportId ? updatedReport : r))
      toast.success("Statut mis à jour avec succès")
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReports.length === 0) {
      toast.warning("Veuillez sélectionner une action et des signalements")
      return
    }

    try {
      const promises = selectedReports.map(reportId => 
        reportsService.update(reportId, { status: bulkAction })
      )
      
      await Promise.all(promises)
      
      setReports(prev => prev.map(r => 
        selectedReports.includes(r.Id) ? { ...r, status: bulkAction } : r
      ))
      
      setSelectedReports([])
      setBulkAction("")
      
      toast.success(`${selectedReports.length} signalement(s) mis à jour`)
      
    } catch (err) {
      toast.error("Erreur lors de l'action groupée")
    }
  }

  const toggleReportSelection = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const selectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map(r => r.Id))
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      "Documents perdus": "FileX",
      "Routes dégradées": "Construction",
      "Incendies": "Flame",
      "Urgences médicales": "Stethoscope",
      "Sécurité": "Shield",
      "Environnement": "TreePine",
      "Services publics": "Building",
      "Autres": "AlertTriangle"
    }
    return icons[category] || "AlertTriangle"
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Documents perdus": "primary",
      "Routes dégradées": "warning",
      "Incendies": "error",
      "Urgences médicales": "error",
      "Sécurité": "info",
      "Environnement": "success",
      "Services publics": "secondary",
      "Autres": "default"
    }
    return colors[category] || "default"
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedStatus("")
  }

  if (loading) return <Loading size="lg" text="Chargement du tableau de bord..." />
  if (error) return <Error message={error} onRetry={loadData} />

  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "transmitted", label: "Transmis" }, 
    { value: "resolved", label: "Résolu" }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }))

  return (
    <div className="min-h-screen py-8 px-4 african-pattern">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-display">
                Tableau de bord administrateur
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestion et suivi des signalements citoyens
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={loadData}
                variant="ghost"
                icon="RefreshCw"
                size="sm"
              >
                Actualiser
              </Button>
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <ApperIcon name="Shield" size={24} className="text-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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
          
          <Card gradient className="p-6 text-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.todayReports}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Aujourd'hui
            </p>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Rechercher par titre, description ou ID..."
              className="md:col-span-2"
            />
            
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
              placeholder="Filtrer par catégorie"
              icon="Filter"
            />
            
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={statusOptions}
              placeholder="Filtrer par statut"
              icon="CheckSquare"
            />
          </div>
          
          {/* Bulk Actions */}
          {selectedReports.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
              <ApperIcon name="Info" size={20} className="text-blue-500" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                {selectedReports.length} signalement(s) sélectionné(s)
              </span>
              
              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  options={statusOptions}
                  placeholder="Action groupée"
                  className="min-w-[150px]"
                />
                
                <Button
                  onClick={handleBulkAction}
                  variant="primary"
                  size="sm"
                  icon="Play"
                  disabled={!bulkAction}
                >
                  Appliquer
                </Button>
                
                <Button
                  onClick={() => setSelectedReports([])}
                  variant="ghost"
                  size="sm"
                  icon="X"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
          
          {(searchQuery || selectedCategory || selectedStatus) && (
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary" icon="Filter">
                Filtres actifs
              </Badge>
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                icon="X"
              >
                Effacer
              </Button>
            </div>
          )}
        </Card>

        {/* Reports Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-display">
              Gestion des signalements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredReports.length} signalement{filteredReports.length !== 1 ? "s" : ""}
            </p>
          </div>
          
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.length === filteredReports.length}
                        onChange={selectAllReports}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      Titre & Catégorie
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredReports.map((report) => (
                    <tr 
                      key={report.Id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.Id)}
                          onChange={() => toggleReportSelection(report.Id)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                          #{report.Id}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs">
                            {report.title}
                          </h3>
                          <Badge 
                            variant={getCategoryColor(report.category)}
                            icon={getCategoryIcon(report.category)}
                            size="sm"
                          >
                            {report.category}
                          </Badge>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.Id, e.target.value)}
                          options={statusOptions}
                          className="min-w-[120px]"
                        />
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(report.createdAt), "PPP", { locale: fr })}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Eye"
                            title="Voir les détails"
                          >
                            Voir
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Supprimer"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              icon={searchQuery || selectedCategory || selectedStatus ? "Search" : "FileX"}
              title={
                searchQuery || selectedCategory || selectedStatus
                  ? "Aucun signalement trouvé"
                  : "Aucun signalement à gérer"
              }
              message={
                searchQuery || selectedCategory || selectedStatus
                  ? "Essayez de modifier vos critères de recherche ou effacez les filtres."
                  : "Tous les signalements apparaîtront ici pour gestion administrative."
              }
              actionLabel={
                searchQuery || selectedCategory || selectedStatus
                  ? "Effacer les filtres"
                  : undefined
              }
              onAction={
                searchQuery || selectedCategory || selectedStatus
                  ? clearFilters
                  : undefined
              }
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard