import React from 'react'
import { motion } from 'framer-motion'

const PremiumProductCard = ({ product, onSelect }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
      onClick={() => onSelect(product)}
      layout
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
          {/* Изображение товара с улучшенной анимацией */}
          <motion.div 
            className="flex-shrink-0 w-full lg:w-56 h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center p-6 group-hover:shadow-lg transition-all duration-500"
            whileHover={{ rotateY: 5 }}
          >
            <motion.img 
              src={product.img} 
              alt={product.name}
              className="w-full h-full object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
          
          {/* Информация о товаре с исправленными отступами */}
          <div className="flex-1 text-center lg:text-left w-full">
            <motion.h3 
              className="font-serif text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 leading-tight break-words"
              layout
            >
              {product.name}
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base line-clamp-2 lg:line-clamp-3"
              layout
            >
              Эксклюзивная формула с натуральными ингредиентами для сияния и здоровья вашей кожи. Клинически проверенная эффективность.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <motion.div 
                className="text-2xl lg:text-3xl font-serif font-semibold text-brand-600"
                layout
              >
                {product.price}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "var(--brand-700)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 lg:px-8 py-3 bg-brand-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--brand-600)' }}
              >
                <span className="flex items-center gap-2">
                  <span>Подробнее</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PremiumProductCard