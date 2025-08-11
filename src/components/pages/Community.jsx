import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const Community = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('partnerships')

  const partnerships = [
    {
      Id: 1,
      name: "Croix-Rouge Camerounaise",
      type: "ONG Humanitaire",
      contact: "contact@croixrouge-cm.org",
      phone: "+237 222 23 45 67",
      description: "Organisation humanitaire pour les urgences médicales et catastrophes",
      categories: ["Urgences médicales", "Catastrophes naturelles"],
      status: "Active",
      icon: "Heart"
    },
    {
      Id: 2,
      name: "Mimi Mefo Info",
      type: "Média Local",
      contact: "redaction@mimimefoinfo.com",
      phone: "+237 677 89 12 34",
      description: "Média d'investigation et d'information citoyenne",
      categories: ["Tous signalements", "Investigation"],
      status: "Active",
      icon: "Tv"
    },
    {
      Id: 3,
      name: "Green Belt Cameroon",
      type: "ONG Environnementale",
      contact: "info@greenbelt-cm.org",
      phone: "+237 655 44 33 22",
      description: "Protection environnementale et développement durable",
      categories: ["Environnement", "Déchets"],
      status: "Active",
      icon: "Leaf"
    },
    {
      Id: 4,
      name: "Université de Yaoundé I - Club Tech",
      type: "Institution Académique",
      contact: "techclub@univ-yaounde1.cm",
      phone: "+237 698 55 44 33",
      description: "Étudiants en technologie et innovation citoyenne",
      categories: ["Innovation", "Formation"],
      status: "Partenaire",
      icon: "GraduationCap"
    }
  ]

  const socialHashtags = [
    { tag: "#Alerte237", usage: "Principal - tous signalements", color: "#2b7a0b" },
    { tag: "#StopNidsDePoule", usage: "Routes dégradées", color: "#f59e0b" },
    { tag: "#PerteCNI", usage: "Documents perdus", color: "#3b82f6" },
    { tag: "#SécuritéCameroun", usage: "Problèmes de sécurité", color: "#ef4444" },
    { tag: "#EnvironnementCM", usage: "Questions environnementales", color: "#22c55e" },
    { tag: "#ServicePublicCM", usage: "Dysfonctionnements services", color: "#8b5cf6" }
  ]

  const pilotZones = [
    {
      name: "Douala-Bonabéri",
      region: "Littoral",
      population: "~300,000 hab.",
      problems: ["Routes dégradées", "Éclairage public", "Drainage"],
      coverage: 85,
      reports: 234,
      status: "Active"
    },
    {
      name: "Yaoundé-Mvog Ada",
      region: "Centre", 
      population: "~150,000 hab.",
      problems: ["Circulation", "Déchets", "Sécurité"],
      coverage: 72,
      reports: 189,
      status: "Active"
    },
    {
      name: "Bafoussam Centre",
      region: "Ouest",
      population: "~120,000 hab.",
      problems: ["Approvisionnement eau", "Routes"],
      coverage: 45,
      reports: 67,
      status: "En développement"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success'
      case 'Partenaire': return 'primary'
      case 'En développement': return 'warning'
      default: return 'default'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ONG Humanitaire': return 'Heart'
      case 'ONG Environnementale': return 'Leaf'
      case 'Média Local': return 'Tv'
      case 'Institution Académique': return 'GraduationCap'
      default: return 'Building'
    }
  }

  const tabs = [
    { id: 'partnerships', label: 'Partenaires', icon: 'Users' },
    { id: 'hashtags', label: 'Hashtags Locaux', icon: 'Hash' },
    { id: 'zones', label: 'Zones Pilotes', icon: 'MapPin' },
    { id: 'impact', label: 'Impact Citoyen', icon: 'TrendingUp' }
  ]

  return (
    <div className="min-h-screen py-8 px-4 african-pattern">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-display">
            Communauté Alerte237
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Plateforme citoyenne indépendante soutenue par les ONG, médias locaux et universités du Cameroun
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="success" size="lg">Mouvement Citoyen</Badge>
            <Badge variant="primary" size="lg">Transparence Garantie</Badge>
            <Badge variant="warning" size="lg">Sans Gouvernement</Badge>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Card className="p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => setSelectedTab(tab.id)}
                icon={tab.icon}
                className="flex-1 sm:flex-none"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Partnerships Tab */}
        {selectedTab === 'partnerships' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">
                    Nos Partenaires Locaux
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    ONG, médias et institutions qui relaient nos signalements
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/report')}
                  variant="primary"
                  icon="Plus"
                >
                  Signaler un problème
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {partnerships.map((partner) => (
                  <Card key={partner.Id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center">
                        <ApperIcon name={getTypeIcon(partner.type)} size={24} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">
                            {partner.name}
                          </h3>
                          <Badge variant={getStatusColor(partner.status)}>
                            {partner.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                          {partner.type}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {partner.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ApperIcon name="Mail" size={16} />
                            <a href={`mailto:${partner.contact}`} className="hover:text-primary-600">
                              {partner.contact}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ApperIcon name="Phone" size={16} />
                            <a href={`tel:${partner.phone}`} className="hover:text-primary-600">
                              {partner.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-4">
                          {partner.categories.map((category, index) => (
                            <Badge key={index} variant="secondary" size="sm">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Hashtags Tab */}
        {selectedTab === 'hashtags' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-display">
              Hashtags Locaux pour le Partage
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Utilisez ces hashtags pour amplifier vos signalements sur WhatsApp, Facebook et Twitter
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {socialHashtags.map((hashtag, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: hashtag.color }}
                    ></div>
                    <span className="font-mono text-lg font-bold" style={{ color: hashtag.color }}>
                      {hashtag.tag}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {hashtag.usage}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Copy"
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(hashtag.tag)
                      toast.success('Hashtag copié!')
                    }}
                  >
                    Copier
                  </Button>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
                Exemple de partage WhatsApp:
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <p>🚨 Route complètement détruite à Bonabéri!</p>
                <p>📍 Avenue des Cocotiers, près du marché</p>
                <p className="mt-2 text-blue-600">#Alerte237 #StopNidsDePoule #Douala</p>
                <p className="text-gray-500">Voir sur: alerte237.com/report/123</p>
              </div>
            </div>
          </Card>
        )}

        {/* Pilot Zones Tab */}
        {selectedTab === 'zones' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-display">
              Zones Pilotes Alerte237
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Quartiers et villes où nous concentrons nos efforts pour maximum d'impact
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              {pilotZones.map((zone, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {zone.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {zone.region} • {zone.population}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(zone.status)}>
                      {zone.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Couverture
                        </span>
                        <span className="text-sm font-bold text-primary-600">
                          {zone.coverage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${zone.coverage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Signalements reçus
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {zone.reports}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Problèmes principaux:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {zone.problems.map((problem, idx) => (
                          <Badge key={idx} variant="warning" size="sm">
                            {problem}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Impact Tab */}
        {selectedTab === 'impact' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-display">
              Notre Impact Citoyen
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="FileText" size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">1,247</p>
                <p className="text-gray-600 dark:text-gray-400">Signalements publiés</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Share2" size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">8,934</p>
                <p className="text-gray-600 dark:text-gray-400">Partages sur réseaux</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Newspaper" size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">156</p>
                <p className="text-gray-600 dark:text-gray-400">Relayés par médias</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Wrench" size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">89</p>
                <p className="text-gray-600 dark:text-gray-400">Problèmes résolus</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Témoignages d'Impact
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                    "Grâce à Alerte237, le nid de poule devant notre école a été réparé en 2 semaines. 
                    Le partage Facebook a généré plus de 500 réactions!"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="MapPin" size={14} className="text-primary-600" />
                    <span className="text-gray-600 dark:text-gray-400">École Publique Mvog-Ada, Yaoundé</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                    "Notre signalement sur l'éclairage public a été relayé par Mimi Mefo Info. 
                    Les lampadaires ont été installés 3 semaines plus tard."
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="MapPin" size={14} className="text-primary-600" />
                    <span className="text-gray-600 dark:text-gray-400">Quartier Bonamoussadi, Douala</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white">
          <h2 className="text-2xl font-bold mb-4 font-display">
            Rejoignez le Mouvement Citoyen Alerte237
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Ensemble, créons la transparence et la pression citoyenne nécessaire 
            pour améliorer nos communautés au Cameroun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/report')}
              variant="secondary"
              size="lg"
              icon="Plus"
              className="text-primary-700 hover:text-primary-800"
            >
              Faire mon premier signalement
            </Button>
            <Button
              onClick={() => navigator.clipboard.writeText('#Alerte237 #CitoyenEngagé')}
              variant="outline"
              size="lg"
              icon="Share2"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Partager la plateforme
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Community