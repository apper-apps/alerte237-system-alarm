import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import MapView from "@/components/organisms/MapView"
import ReportCard from "@/components/organisms/ReportCard"
import { reportsService } from "@/services/api/reportsService"
import { categoriesService } from "@/services/api/categoriesService"

const Home = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      
      setReports(reportsData.slice(0, 6)) // Show only latest 6 reports
      setCategories(categoriesData)
      
      // Calculate stats
      const total = reportsData.length
      const pending = reportsData.filter(r => r.status === "pending").length
      const transmitted = reportsData.filter(r => r.status === "transmitted").length
      const resolved = reportsData.filter(r => r.status === "resolved").length
      
      setStats({ total, pending, transmitted, resolved })
      
    } catch (err) {
      setError("Impossible de charger les données. Vérifiez votre connexion internet.")
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading size="lg" text="Chargement des signalements..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen african-pattern">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Alerte237
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Plateforme camerounaise de signalement citoyen centralisée
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Signalez rapidement les problèmes de votre communauté avec localisation GPS, 
              photos et suivez leur résolution en temps réel sur notre carte interactive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                onClick={() => navigate("/report")}
                variant="secondary"
                size="lg"
                icon="Plus"
                className="text-primary-700 hover:text-primary-800 shadow-xl"
              >
                Faire un signalement
              </Button>
              <Button
                onClick={() => navigate("/map")}
                variant="outline"
                size="lg"
                icon="Map"
                className="border-white text-white hover:bg-white hover:text-primary-600 shadow-xl"
              >
                Voir la carte
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Statistics Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-display">
            Statistiques en temps réel
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card gradient className="p-6 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="FileText" size={24} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {stats.total}
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Total des signalements
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
        </section>

        {/* Interactive Map */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">
              Carte des signalements
            </h2>
            <Button
              onClick={() => navigate("/map")}
              variant="primary"
              icon="Maximize2"
            >
              Plein écran
            </Button>
          </div>
          
          <Card className="p-6">
            {reports.length > 0 ? (
              <MapView reports={reports} height="500px" />
            ) : (
              <Empty
                icon="Map"
                title="Aucun signalement sur la carte"
                message="Soyez le premier à signaler un problème dans votre communauté."
                actionLabel="Faire un signalement"
                onAction={() => navigate("/report")}
              />
            )}
          </Card>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-display">
            Catégories de signalement
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.Id} className="p-4 text-center hover:shadow-xl cursor-pointer" onClick={() => navigate("/report")}>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <ApperIcon name={category.icon} size={24} style={{ color: category.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">
              Signalements récents
            </h2>
            <Button
              onClick={() => navigate("/profile")}
              variant="ghost"
              icon="ArrowRight"
            >
              Voir tout
            </Button>
          </div>
          
          {reports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.Id}
                  report={report}
                />
              ))}
            </div>
          ) : (
            <Empty
              icon="FileX"
              title="Aucun signalement récent"
              message="Aucun signalement n'a encore été créé. Commencez par signaler un problème."
              actionLabel="Faire un signalement"
              onAction={() => navigate("/report")}
            />
          )}
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center font-display">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Edit3" size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                1. Signaler
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Décrivez le problème, ajoutez une photo et localisez-le sur la carte
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Send" size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                2. Transmission
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Votre signalement est transmis aux autorités compétentes
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                3. Suivi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Suivez l'évolution de votre signalement jusqu'à sa résolution
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home