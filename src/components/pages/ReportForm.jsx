import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reportsService } from "@/services/api/reportsService";
import { categoriesService } from "@/services/api/categoriesService";
import ApperIcon from "@/components/ApperIcon";
import LocationPicker from "@/components/molecules/LocationPicker";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const ReportForm = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: null,
    longitude: null,
    address: "",
    imageUrl: "",
    anonymous: false,
    shareOnSocial: true
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesService.getAll()
      setCategories(data)
    } catch (err) {
      setError("Impossible de charger les catégories")
      toast.error("Erreur lors du chargement des catégories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const validateStep = (step) => {
    const errors = {}
    
    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Le titre est requis"
      if (!formData.description.trim()) errors.description = "La description est requise"
      if (!formData.category) errors.category = "Veuillez sélectionner une catégorie"
    }
    
    if (step === 2) {
      if (!formData.latitude || !formData.longitude) {
        errors.location = "Veuillez sélectionner une localisation"
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      address: location.address || ""
    }))
    if (formErrors.location) {
      setFormErrors(prev => ({ ...prev, location: null }))
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Simulate image upload - in real app, upload to server
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, imageUrl }))
      toast.success("Image ajoutée avec succès")
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

const handleSocialShare = (platform, reportData) => {
    const shareText = `🚨 Nouveau signalement Alerte237: ${reportData.title}\n📍 ${reportData.address || 'Localisation GPS'}\n\n#Alerte237 #StopNidsDePoule #Cameroun`
    const shareUrl = `${window.location.origin}/report/${reportData.Id}`
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return
    
    try {
      setSubmitting(true)
      
      const reportData = {
        ...formData,
        status: "published", // Changed from "pending" to "published"
        userId: formData.anonymous ? null : 1,
        isPublic: true, // Make reports public by default
        visibility: "community" // Community visibility
      }
      
      const createdReport = await reportsService.create(reportData)
      
      toast.success("Signalement publié avec succès ! Votre communauté peut maintenant le voir.")
      
      // Auto-share on social media if enabled
      if (formData.shareOnSocial) {
        setTimeout(() => {
          handleSocialShare('whatsapp', createdReport)
        }, 1000)
      }
      
      navigate("/profile")
      
    } catch (err) {
      toast.error("Erreur lors de la publication du signalement")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading size="lg" text="Chargement du formulaire..." />
  if (error) return <Error message={error} onRetry={loadCategories} />

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }))

  const getStepTitle = (step) => {
    const titles = {
      1: "Détails du signalement",
      2: "Localisation",
      3: "Confirmation et envoi"
    }
    return titles[step]
  }

  const getStepIcon = (step) => {
    const icons = {
      1: "Edit3",
      2: "MapPin", 
      3: "Send"
    }
    return icons[step]
  }

  return (
<div className="min-h-screen py-8 px-4 african-pattern">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-display">
            Nouveau signalement citoyen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Exposez les problèmes de votre communauté. Votre signalement sera publié publiquement pour créer une pression citoyenne.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-600 dark:text-primary-400">
            <ApperIcon name="Users" size={16} />
            <span>Plateforme citoyenne indépendante • Transparence garantie</span>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {Math.round((currentStep / totalSteps) * 100)}% complété
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-primary-600 to-accent-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`flex items-center gap-2 ${step <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {step < currentStep ? (
                    <ApperIcon name="Check" size={16} />
                  ) : (
                    <ApperIcon name={getStepIcon(step)} size={16} />
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {getStepTitle(step)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            {/* Step 1: Report Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Edit3" size={32} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-display">
                    {getStepTitle(1)}
                  </h2>
                </div>

                <Input
                  label="Titre du signalement"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="ex: Route endommagée sur l'Avenue Kennedy"
                  icon="Type"
                  error={formErrors.title}
                  required
                />

                <Select
                  label="Catégorie"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={categoryOptions}
                  placeholder="Sélectionnez une catégorie"
                  icon="Tag"
                  error={formErrors.category}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description détaillée
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Décrivez le problème en détail..."
                    rows={4}
                    className={`input-field resize-none ${formErrors.description ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : ''}`}
                    required
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <ApperIcon name="AlertCircle" size={14} />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => handleInputChange("anonymous", e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                    Faire ce signalement de façon anonyme
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="MapPin" size={32} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-display">
                    {getStepTitle(2)}
                  </h2>
                </div>

                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                />

                {formErrors.location && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={14} />
                    {formErrors.location}
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Photo du problème (optionnel)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ApperIcon name="Upload" size={24} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Cliquez pour télécharger</span> ou glissez une image
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={formData.imageUrl} 
                        alt="Aperçu"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Send" size={32} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-display">
                    Publication & Partage
                  </h2>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Résumé de votre signalement
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Titre:</span>
                      <p className="text-gray-900 dark:text-gray-100">{formData.title}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Catégorie:</span>
                      <p className="text-gray-900 dark:text-gray-100">{formData.category}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description:</span>
                      <p className="text-gray-900 dark:text-gray-100">{formData.description}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Localisation:</span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.address || `${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)}`}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type de signalement:</span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.anonymous ? "Anonyme" : "Avec identification"}
                      </p>
                    </div>
                  </div>
                  
                  {formData.imageUrl && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Photo:</span>
                      <img 
                        src={formData.imageUrl} 
                        alt="Signalement"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="Users" size={20} className="text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Impact communautaire
                      </h4>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• Votre signalement sera publié publiquement sur la carte</li>
                        <li>• Les médias et ONG locales peuvent le relayer</li>
                        <li>• La pression citoyenne encourage les solutions</li>
                        <li>• Vous contribuez à la base de données citoyenne du Cameroun</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="Share2" size={20} className="text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Partage sur les réseaux sociaux
                      </h4>
                      <div className="flex items-center gap-3 mt-3">
                        <input
                          type="checkbox"
                          id="shareOnSocial"
                          checked={formData.shareOnSocial}
                          onChange={(e) => handleInputChange("shareOnSocial", e.target.checked)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="shareOnSocial" className="text-sm text-blue-700 dark:text-blue-300">
                          Partager automatiquement sur WhatsApp (#Alerte237 #StopNidsDePoule)
                        </label>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="MessageCircle"
                          className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                          onClick={() => handleSocialShare('whatsapp', { title: formData.title, address: formData.address })}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="Facebook"
                          className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          onClick={() => handleSocialShare('facebook', { title: formData.title, address: formData.address })}
                        >
                          Facebook
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="Twitter"
                          className="text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-900/20"
                          onClick={() => handleSocialShare('twitter', { title: formData.title, address: formData.address })}
                        >
                          Twitter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={handlePreviousStep}
                variant="ghost"
                icon="ArrowLeft"
                disabled={currentStep === 1}
                className={currentStep === 1 ? "invisible" : ""}
              >
                Précédent
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="ghost"
                >
                  Annuler
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    variant="primary"
                    icon="ArrowRight"
                    iconPosition="right"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={submitting}
                    variant="primary"
                    icon="Send"
                  >
                    Publier le signalement
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default ReportForm