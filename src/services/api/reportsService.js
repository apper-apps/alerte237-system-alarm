import reportsData from "@/services/mockData/reports.json"

class ReportsService {
  constructor() {
    this.reports = [...reportsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    // Sort by creation date, newest first
    return [...this.reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getById(id) {
    await this.delay()
    const report = this.reports.find(r => r.Id === parseInt(id))
    if (!report) {
      throw new Error("Signalement non trouvé")
    }
    return { ...report }
  }

  async create(reportData) {
    await this.delay(500)
    
    // Find highest existing Id and add 1
    const highestId = Math.max(...this.reports.map(r => r.Id), 0)
    const newId = highestId + 1
    
    const newReport = {
      Id: newId,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.reports.unshift(newReport)
    return { ...newReport }
  }

  async update(id, updateData) {
    await this.delay(400)
    
    const index = this.reports.findIndex(r => r.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Signalement non trouvé")
    }
    
    this.reports[index] = {
      ...this.reports[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.reports[index] }
  }

  async delete(id) {
    await this.delay(300)
    
    const index = this.reports.findIndex(r => r.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Signalement non trouvé")
    }
    
    this.reports.splice(index, 1)
    return true
  }

  // Filter by status
  async getByStatus(status) {
    await this.delay()
    return this.reports.filter(r => r.status === status)
  }

  // Filter by category
  async getByCategory(category) {
    await this.delay()
    return this.reports.filter(r => r.category === category)
  }

  // Filter by user
  async getByUser(userId) {
    await this.delay()
    return this.reports.filter(r => r.userId === parseInt(userId))
  }

  // Get statistics
  async getStatistics() {
    await this.delay(200)
    
    const total = this.reports.length
    const pending = this.reports.filter(r => r.status === "pending").length
    const transmitted = this.reports.filter(r => r.status === "transmitted").length
    const resolved = this.reports.filter(r => r.status === "resolved").length
    
    // Today's reports
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayReports = this.reports.filter(r => {
      const reportDate = new Date(r.createdAt)
      reportDate.setHours(0, 0, 0, 0)
      return reportDate.getTime() === today.getTime()
    }).length
    
    return {
      total,
      pending,
      transmitted,
      resolved,
      todayReports
    }
  }
}

export const reportsService = new ReportsService()