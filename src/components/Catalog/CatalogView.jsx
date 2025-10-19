import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FiltersSidebar from './FiltersSidebar'
import PremiumProductCard from './PremiumProductCard'
import ProductModal from './ProductModal'

const CatalogView = ({ products, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState(100)
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const maxPrice = Math.max(...products.map(p => parseInt(p.price.replace('€', ''))))

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered = filtered.filter(product => {
      const price = parseInt(product.price.replace('€', ''))
      return price <= priceRange
    })

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') {
        const priceA = parseInt(a.price.replace('€', ''))
        const priceB = parseInt(b.price.replace('€', ''))
        return priceA - priceB
      }
      if (sortBy === 'price-desc') {
        const priceA = parseInt(a.price.replace('€', ''))
        const priceB = parseInt(b.price.replace('€', ''))
        return priceB - priceA
      }
      return 0
    })

    return filtered
  }, [products, searchTerm, priceRange, sortBy])

  // Улучшенные анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  }

  const slideInVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.8
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cream-50"
    >
      {/* Хедер каталога */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-all duration-300 p-3 rounded-2xl hover:bg-gray-50 group"
              >
                <motion.span 
                  className="text-2xl group-hover:-translate-x-1 transition-transform"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ←
                </motion.span>
                <span className="hidden sm:inline text-lg">На главную</span>
              </motion.button>
              <div>
                <motion.h1 
                  className="font-serif text-3xl text-gray-900 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Каталог Lumiára
                </motion.h1>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Эксклюзивная коллекция премиальной косметики
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="text-lg text-gray-500 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Найдено: <span className="font-semibold text-brand-600">{filteredProducts.length}</span> товаров
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель фильтров */}
          <motion.div 
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-80 flex-shrink-0"
          >
            <FiltersSidebar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              maxPrice={maxPrice}
              productCount={filteredProducts.length}
            />
          </motion.div>

          {/* Основная область с товарами */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      layout
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                      whileHover={{ 
                        y: -4,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <PremiumProductCard 
                        product={product} 
                        onSelect={setSelectedProduct}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center py-20"
                >
                  <motion.div 
                    className="text-8xl mb-6 text-gray-200"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Товары не найдены</h3>
                  <p className="text-gray-600 max-w-md mx-auto text-lg">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm('')
                      setPriceRange(maxPrice)
                    }}
                    className="mt-6 px-6 py-3 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors"
                  >
                    Сбросить фильтры
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями товара */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CatalogView