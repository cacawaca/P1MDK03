import React from 'react'
import { motion } from 'framer-motion'

const FiltersSidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  priceRange, 
  setPriceRange, 
  sortBy, 
  setSortBy, 
  maxPrice,
  productCount 
}) => {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:w-80 flex-shrink-0"
    >
      <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 sticky top-8">
        <motion.h3 
          className="font-serif text-2xl font-semibold mb-8 text-gray-900 text-center lg:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Фильтры
        </motion.h3>
        
        {/* Поиск */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">Поиск</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.span 
                className="text-gray-400 text-lg"
                animate={{ rotate: searchTerm ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                🔍
              </motion.span>
            </div>
            <input
              type="text"
              placeholder="Название товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-gray-50 transition-all duration-300 focus:bg-white"
            />
          </div>
        </motion.div>

        {/* Ползунок цены */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Цена: до <span className="text-brand-600 font-semibold">€{priceRange}</span>
          </label>
          <motion.div className="relative">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-brand-600 to-gray-300 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--brand-600) 0%, var(--brand-600) ${(priceRange / maxPrice) * 100}%, #e5e7eb ${(priceRange / maxPrice) * 100}%, #e5e7eb 100%)`
              }}
            />
            <motion.div 
              className="flex justify-between text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span>€0</span>
              <span>€{maxPrice}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Сортировка */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">Сортировка</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-gray-50 transition-all duration-300 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="name">По названию</option>
            <option value="price">По цене (сначала дешевые)</option>
            <option value="price-desc">По цене (сначала дорогие)</option>
          </select>
        </motion.div>

        {/* Счетчик товаров для мобильных */}
        <motion.div 
          className="md:hidden text-lg text-gray-500 pt-6 border-t border-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Найдено: <span className="font-semibold text-brand-600">{productCount}</span> товаров
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FiltersSidebar