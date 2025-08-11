import categoriesData from "@/services/mockData/categories.json"

class CategoriesService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.categories]
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(c => c.Id === parseInt(id))
    if (!category) {
      throw new Error("Catégorie non trouvée")
    }
    return { ...category }
  }

  async create(categoryData) {
    await this.delay(300)
    
    // Find highest existing Id and add 1
    const highestId = Math.max(...this.categories.map(c => c.Id), 0)
    const newId = highestId + 1
    
    const newCategory = {
      Id: newId,
      ...categoryData
    }
    
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updateData) {
    await this.delay(300)
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Catégorie non trouvée")
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...updateData
    }
    
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay(200)
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Catégorie non trouvée")
    }
    
    this.categories.splice(index, 1)
    return true
  }

  // Get category by name
  async getByName(name) {
    await this.delay()
    return this.categories.find(c => c.name === name) || null
  }
}

export const categoriesService = new CategoriesService()