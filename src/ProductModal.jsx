import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductModal = ({ product, isOpen, onClose, onAddToCart, onAddToFavorites, isFavorite }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productDetails = {
    1: {
      fullDescription: "Hydra Glow Cream — это интенсивно увлажняющий крем с гиалуроновой кислотой и натуральными растительными экстрактами. Формула проникает в глубокие слои кожи, обеспечивая длительное увлажнение и восстанавливая естественный барьер.",
      ingredients: ["Гиалуроновая кислота", "Экстракт алоэ вера", "Масло ши", "Витамин E", "Ниацинамид"],
      benefits: ["Глубокое увлажнение на 72 часа", "Улучшение текстуры кожи", "Снятие раздражения", "Защита от потери влаги"],
      usage: "Наносите утром и вечером на очищенную кожу лица легкими массажными движениями.",
      size: ["50ml", "100ml", "200ml"],
      images: ["/assets/product1.svg", "/assets/product1.svg", "/assets/product1.svg"]
    },
    2: {
      fullDescription: "Silk Serum — легкая шелковистая сыворотка с пептидами и витамином C. Улучшает эластичность кожи, борется с первыми признаками старения и придает коже сияние.",
      ingredients: ["Пептиды", "Витамин C", "Экстракт зеленого чая", "Гиалуроновая кислота", "Ниацинамид"],
      benefits: ["Уменьшение морщин", "Улучшение тонуса", "Осветление пигментации", "Антиоксидантная защита"],
      usage: "Наносите 2-3 капли на очищенную кожу перед кремом.",
      size: ["30ml", "50ml"],
      images: ["/assets/product2.svg", "/assets/product2.svg", "/assets/product2.svg"]
    },
    3: {
      fullDescription: "Velvet Lip Tint — стойкий тинт для губ с бархатистой текстурой. Не сушит губы, обеспечивает равномерное покрытие на 8 часов.",
      ingredients: ["Масло жожоба", "Витамин E", "Натуральные пигменты", "Экстракт ромашки"],
      benefits: ["Стойкость до 8 часов", "Уход за губами", "Нежная текстура", "10 модных оттенков"],
      usage: "Наносите на чистые сухие губы, растушевывая кончиком пальца.",
      size: ["5ml"],
      images: ["/assets/product3.svg", "/assets/product3.svg", "/assets/product3.svg"]
    },
    4: {
      fullDescription: "Radiance Palette — универсальная палетка для создания естественного сияния. Включает хайлайтер, бронзер и румяна премиум-качества.",
      ingredients: ["Слюда", "Натуральные пигменты", "Масло арганы", "Витамин E"],
      benefits: ["Многофункциональность", "Естественное сияние", "Долгая стойкость", "Подходит для всех тонов кожи"],
      usage: "Наносите кистью на скулы, переносицу и другие зоны, которые хотите выделить.",
      size: ["12g"],
      images: ["/assets/product4.svg", "/assets/product4.svg", "/assets/product4.svg"]
    },
    5: {
      fullDescription: "Ночная маска Lumiára — интенсивное восстановление кожи во время сна. Формула с керамидами и пептидами работает всю ночь, восстанавливая естественный барьер кожи.",
      ingredients: ["Керамиды", "Пептиды", "Ниацинамид", "Гиалуроновая кислота", "Экстракт центеллы"],
      benefits: ["Восстановление барьера", "Глубокое увлажнение", "Антивозрастной эффект", "Успокаивающее действие"],
      usage: "Наносите вечером на очищенную кожу вместо ночного крема.",
      size: ["50ml", "75ml"],
      images: ["/assets/feat1.svg", "/assets/feat1.svg", "/assets/feat1.svg"]
    },
    6: {
      fullDescription: "Дневной крем SPF 30 — легкая текстура с защитой от UV-лучей. Обеспечивает увлажнение и защиту на весь день, придавая коже естественное сияние.",
      ingredients: ["SPF 30", "Гиалуроновая кислота", "Витамин E", "Экстракт алоэ вера", "Ниацинамид"],
      benefits: ["Защита от UV-лучей", "Легкая текстура", "Естественное сияние", "Увлажнение на 24 часа"],
      usage: "Наносите утром на очищенную кожу за 15 минут до выхода на солнце.",
      size: ["50ml"],
      images: ["/assets/feat2.svg", "/assets/feat2.svg", "/assets/feat2.svg"]
    },
    7: {
      fullDescription: "Сыворотка Vitamin C — мощная антиоксидантная формула для яркости и тонуса кожи. Борется с признаками старения и осветляет пигментацию.",
      ingredients: ["Витамин C", "Феруловая кислота", "Витамин E", "Гиалуроновая кислота", "Экстракт зеленого чая"],
      benefits: ["Осветление тона", "Антиоксиданты", "Уменьшение пигментации", "Улучшение эластичности"],
      usage: "Наносите утром на очищенную кожу перед кремом.",
      size: ["30ml"],
      images: ["/assets/feat3.svg", "/assets/feat3.svg", "/assets/feat3.svg"]
    }
  };

  const details = productDetails[product?.id];

  if (!isOpen || !details) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid lg:grid-cols-2">
              {/* Левая часть - изображения */}
              <div className="bg-gradient-to-br from-cream-50 to-brand-50 p-8">
                <div className="relative h-80 mb-6">
                  <motion.img
                    key={selectedImage}
                    src={details.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.button
                    onClick={() => onAddToFavorites(product)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span
                      animate={{ scale: isFavorite ? 1.2 : 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {isFavorite ? "❤️" : "🤍"}
                    </motion.span>
                  </motion.button>
                </div>

                <div className="flex gap-4 justify-center">
                  {details.images.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden ${
                        selectedImage === index ? 'border-brand-600' : 'border-gray-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Правая часть - информация */}
              <div className="p-8">
                <button
                  onClick={onClose}
                  className="float-right text-gray-500 hover:text-gray-700 text-2xl mb-4"
                >
                  ✕
                </button>

                <div className="clear-both">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-serif font-semibold text-brand-600 mb-6">
                    {product.price}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Описание</h3>
                      <p className="text-gray-600 leading-relaxed">{details.fullDescription}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Активные ингредиенты</h3>
                      <div className="flex flex-wrap gap-2">
                        {details.ingredients.map((ingredient, index) => (
                          <motion.span
                            key={index}
                            className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            {ingredient}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Эффект</h3>
                      <ul className="space-y-2">
                        {details.benefits.map((benefit, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-center text-gray-600"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="w-2 h-2 bg-brand-600 rounded-full mr-3"></span>
                            {benefit}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Размер</h3>
                      <div className="flex gap-3">
                        {details.size.map((size, index) => (
                          <motion.button
                            key={size}
                            onClick={() => setSelectedSize(index)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedSize === index
                                ? 'border-brand-600 bg-brand-50 text-brand-700'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* ИСПРАВЛЕННАЯ СЕКЦИЯ КОЛИЧЕСТВА */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4 text-gray-900">Добавить в заказ</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Количество</div>
                          <div className="flex items-center gap-4">
                            <motion.button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600"
                              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                              whileTap={{ scale: 0.9 }}
                            >
                              -
                            </motion.button>
                            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                            <motion.button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600"
                              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={() => {
                            onAddToCart({ ...product, quantity });
                            onClose();
                          }}
                          className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-semibold text-lg shadow-lg"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Добавить в корзину
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;