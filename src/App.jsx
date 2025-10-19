import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import content from './data/content.json'
import LoginModal from './LoginModal'
import ProductModal from './ProductModal'

export default function App(){
  const { brand, products, featured, testimonials, blog } = content
  const [currentView, setCurrentView] = useState('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState('hero')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const collectionsRef = useRef(null)
  const featuredRef = useRef(null)
  const testimonialsRef = useRef(null)
  const blogRef = useRef(null)

  const { scrollYProgress } = useScroll({
    container: containerRef
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'about', ref: aboutRef },
      { id: 'collections', ref: collectionsRef },
      { id: 'featured', ref: featuredRef },
      { id: 'testimonials', ref: testimonialsRef },
      { id: 'blog', ref: blogRef }
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setCart([
      { id: 1, name: 'Hydra Glow Cream', price: '€49', quantity: 1, img: '/assets/product1.svg' },
      { id: 2, name: 'Silk Serum', price: '€69', quantity: 2, img: '/assets/product2.svg' }
    ])
    setOrderHistory([
      { id: 1, date: '2024-01-15', total: '€118', items: 2, status: 'Доставлен', products: ['Hydra Glow Cream', 'Silk Serum'] },
      { id: 2, date: '2024-01-10', total: '€49', items: 1, status: 'Доставлен', products: ['Velvet Lip Tint'] }
    ])
    setFavorites([
      { id: 3, name: 'Velvet Lip Tint', price: '€29', img: '/assets/product3.svg' }
    ])
    setCurrentView('profile')
  }

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        )
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const handleAddToFavorites = (product) => {
    setFavorites(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const FloatingParticles = () => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2
    }))

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-brand-600/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 8,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
      </div>
    )
  }

  const InteractiveNavigation = () => (
    <motion.nav 
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-2xl border border-white/20">
        <div className="flex items-center gap-6">
          {['hero', 'about', 'collections', 'featured', 'testimonials', 'blog'].map(section => (
            <motion.button
              key={section}
              className={`text-sm font-medium transition-colors relative px-3 py-1 rounded-lg ${
                activeSection === section 
                  ? 'text-brand-600 bg-brand-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById(section)
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </motion.button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <motion.button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-bold">L</span>
            </span>
            Войти
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )

  const ScrollProgress = () => (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-brand-600/20 z-50 origin-left"
      style={{ scaleX }}
    />
  )

  if (currentView === 'catalog') {
    return <PremiumCatalogView 
      products={products} 
      onBack={() => setCurrentView('home')} 
      onAddToCart={handleAddToCart}
      onAddToFavorites={handleAddToFavorites}
      favorites={favorites}
      onProductClick={handleProductClick}
    />
  }

  if (currentView === 'profile' && user) {
    return <ProfileView 
      user={user} 
      cart={cart}
      orderHistory={orderHistory}
      favorites={favorites}
      onBack={() => setCurrentView('home')}
      onRemoveFromCart={handleRemoveFromCart}
      onUpdateQuantity={handleUpdateQuantity}
      onAddToFavorites={handleAddToFavorites}
    />
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-cream-50 overflow-x-hidden" ref={containerRef}>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onAddToCart={handleAddToCart}
        onAddToFavorites={handleAddToFavorites}
        isFavorite={favorites.some(fav => fav.id === selectedProduct?.id)}
      />

      <ScrollProgress />
      <InteractiveNavigation />

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-brand-50"
          style={{
            scale: heroScale,
            opacity: heroOpacity
          }}
        />
        
        <FloatingParticles />
        
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-700/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <motion.h1 
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {brand.name}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {brand.slogan}
            </motion.p>
          </motion.div>

          <motion.p 
            className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {brand.description}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-24"
            variants={fadeInUp}
          >
            <motion.button
              onClick={() => setCurrentView('catalog')}
              className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-semibold text-lg hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Открыть каталог
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-white transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Узнать больше
            </motion.button>
          </motion.div>

          {/* Интерактивный баннер с статистикой - ИСПРАВЛЕННЫЙ */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 mx-auto max-w-4xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "98%", label: "Довольных клиентов", icon: "😊" },
                { number: "5+", label: "Лет на рынке", icon: "⭐" },
                { number: "10k+", label: "Продаж в месяц", icon: "🚀" },
                { number: "24/7", label: "Поддержка", icon: "🛡️" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-serif font-bold text-brand-600 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex justify-center">
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              Философия Lumiára
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Синтез передовой науки и щедрых даров природы для восстановления естественного сияния вашей кожи
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="space-y-8"
            >
              {[
                {
                  icon: '🔬',
                  title: 'Научный подход',
                  description: 'Каждая формула проходит клинические испытания при участии ведущих дерматологов'
                },
                {
                  icon: '🌿',
                  title: 'Натуральные компоненты',
                  description: 'Используем только эффективные концентрации активных ингредиентов из природы'
                },
                {
                  icon: '💎',
                  title: 'Премиальное качество',
                  description: 'Сочетание традиционных рецептов и инновационных технологий'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-start gap-6 p-6 rounded-2xl hover:bg-cream-50 transition-colors group"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div 
                    className="text-3xl group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-transparent"
                  animate={{
                    x: [-100, 300],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <div className="text-center space-y-6 relative z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto bg-brand-600 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white text-3xl">✨</span>
                  </motion.div>
                  <div>
                    <h4 className="font-serif text-2xl font-semibold mb-4">Инновации в каждой капле</h4>
                    <p className="text-gray-600">
                      Сочетание вековых традиций и современных технологий для вашей красоты
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { number: '100%', label: 'Натуральные компоненты' },
              { number: '0%', label: 'Парабены и сульфаты' },
              { number: '5+', label: 'Лет исследований' },
              { number: '10k+', label: 'Довольных клиентов' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="text-3xl font-serif font-semibold text-brand-600 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" ref={collectionsRef} className="py-20 px-4 sm:px-6 bg-cream-50 relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              Коллекции
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Откройте для себя эксклюзивные формулы, созданные для вашего сияния
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === product.id)}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Бестселлеры Section - ПЕРЕИМЕНОВАНО И УЛУЧШЕНО */}
      <section id="featured" ref={featuredRef} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              Бестселлеры
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Самые популярные продукты, которые выбирают наши клиенты
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                id: 5,
                name: "Ночная маска Lumiára",
                price: "€59",
                description: "Интенсивное восстановление кожи во время сна",
                rating: 4.9,
                reviews: 128,
                benefits: ["Глубокое увлажнение", "Восстановление барьера", "Антивозрастной эффект"],
                img: "/assets/feat1.svg"
              },
              {
                id: 6,
                name: "Дневной крем SPF 30",
                price: "€45",
                description: "Защита и сияние на весь день",
                rating: 4.8,
                reviews: 95,
                benefits: ["SPF 30 защита", "Легкая текстура", "Естественное сияние"],
                img: "/assets/feat2.svg"
              },
              {
                id: 7,
                name: "Сыворотка Vitamin C",
                price: "€65",
                description: "Яркость и тонус для сияющей кожи",
                rating: 4.9,
                reviews: 156,
                benefits: ["Осветление тона", "Антиоксиданты", "Уменьшение пигментации"],
                img: "/assets/feat3.svg"
              }
            ].map((item, index) => (
              <BestSellerCard 
                key={item.id} 
                item={item} 
                index={index}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-20 px-4 sm:px-6 bg-cream-50 relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              Отзывы клиентов
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" ref={blogRef} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              Полезные материалы
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {blog.map((blogPost, index) => (
              <BlogCard key={index} blogPost={blogPost} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="font-serif text-2xl text-brand-600 mb-4">{brand.name}</div>
              <p className="text-gray-600 mb-4">{brand.description}</p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Навигация</h6>
              <div className="space-y-2 text-gray-600">
                <div><a href="#about" className="hover:text-brand-600 transition-colors">О бренде</a></div>
                <div><a href="#collections" className="hover:text-brand-600 transition-colors">Коллекции</a></div>
                <div><a href="#blog" className="hover:text-brand-600 transition-colors">Блог</a></div>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Контакты</h6>
              <div className="space-y-2 text-gray-600">
                <div>{brand.contactEmail}</div>
                <div>{brand.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, onAddToCart, index, onProductClick, isFavorite, onAddToFavorites }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }}
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onProductClick(product)}
  >
    <div className="relative overflow-hidden">
      <motion.img 
        src={product.img} 
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onAddToFavorites(product);
        }}
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

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
        <motion.span
          className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-xl"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
        >
          Подробнее
        </motion.span>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="font-serif text-xl font-semibold mb-2 text-gray-900 group-hover:text-brand-600 transition-colors">
        {product.name}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-serif font-semibold text-brand-600">{product.price}</span>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="px-6 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-lg"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          В корзину
        </motion.button>
      </div>
    </div>
  </motion.div>
)

// Best Seller Card Component - НОВЫЙ КОМПОНЕНТ
const BestSellerCard = ({ item, index, onProductClick, onAddToCart }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }}
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    whileHover={{ y: -5 }}
    onClick={() => onProductClick(item)}
  >
    <div className="h-48 bg-gradient-to-br from-brand-50 to-cream-100 flex items-center justify-center relative">
      <motion.img 
        src={item.img} 
        alt={item.name}
        className="h-32 object-contain group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
        ★ {item.rating}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-serif text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
      <p className="text-gray-600 mb-3">{item.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {item.benefits.map((benefit, idx) => (
          <span key={idx} className="px-2 py-1 bg-brand-50 text-brand-700 rounded-full text-xs">
            {benefit}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-serif font-semibold text-brand-600">{item.price}</span>
          <div className="text-sm text-gray-500">{item.reviews} отзывов</div>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Купить
        </motion.button>
      </div>
    </div>
  </motion.div>
)

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }}
    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <div className="font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-sm text-gray-500">Покупатель</div>
      </div>
    </div>
    <p className="text-gray-600 italic">"{testimonial.text}"</p>
  </motion.div>
)

// Blog Card Component
const BlogCard = ({ blogPost, index }) => (
  <motion.a
    href={blogPost.url}
    target="_blank"
    rel="noopener noreferrer"
    variants={{
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }}
    className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    whileHover={{ y: -5 }}
  >
    <div className="h-48 bg-gradient-to-br from-brand-50 to-cream-100 flex items-center justify-center">
      <motion.img 
        src={blogPost.img} 
        alt={blogPost.title}
        className="h-32 object-contain group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div className="p-6">
      <h3 className="font-serif text-xl font-semibold mb-3 text-gray-900 group-hover:text-brand-600 transition-colors">
        {blogPost.title}
      </h3>
      <p className="text-gray-600 mb-4">{blogPost.excerpt}</p>
      <div className="flex items-center justify-between text-sm text-brand-600 font-semibold">
        <span>Читать статью</span>
        <span className="group-hover:translate-x-2 transition-transform">→</span>
      </div>
    </div>
  </motion.a>
)

const PremiumCatalogView = ({ products, onBack, onAddToCart, onAddToFavorites, favorites, onProductClick }) => {
  return (
    <div className="min-h-screen bg-cream-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-8 text-brand-600 hover:text-brand-700">
          ← Назад
        </button>
        <h1 className="font-serif text-4xl font-bold mb-8">Каталог</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              onAddToFavorites={onAddToFavorites}
              isFavorite={favorites.some(fav => fav.id === product.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const ProfileView = ({ user, cart, orderHistory, favorites, onBack, onRemoveFromCart, onUpdateQuantity, onAddToFavorites }) => {
  return (
    <div className="min-h-screen bg-cream-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-8 text-brand-600 hover:text-brand-700">
          ← Назад
        </button>
        <h1 className="font-serif text-4xl font-bold mb-8">Профиль</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl font-semibold mb-4">Корзина</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Корзина пуста</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-brand-600">{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => onRemoveFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl font-semibold mb-4">Избранное</h2>
            {favorites.length === 0 ? (
              <p className="text-gray-600">Нет избранных товаров</p>
            ) : (
              <div className="space-y-4">
                {favorites.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-brand-600">{item.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onAddToFavorites(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}