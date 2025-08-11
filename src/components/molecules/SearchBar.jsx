import React, { useState } from 'react'
import AppIcon from '@/components/atoms/AppIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

function SearchBar({ onSearch, placeholder = "Search reports...", className = "" }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          icon="Search"
          className="pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <AppIcon name="X" size={16} className="text-gray-400" />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" icon="Search">
        Rechercher
      </Button>
    </form>
  )
}

export default SearchBar