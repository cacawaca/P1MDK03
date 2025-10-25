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
  const [flyingItems, setFlyingItems] = useState([])

  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const collectionsRef = useRef(null)
  const featuredRef = useRef(null)
  const testimonialsRef = useRef(null)
  const blogRef = useRef(null)
  const cartIconRef = useRef(null)

  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
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
    setIsLoginModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCart([])
    setOrderHistory([])
    setFavorites([])
  }

  const handleAddToCart = (product, event) => {
    if (event) {
      const buttonRect = event.target.getBoundingClientRect()
      const cartRect = cartIconRef.current?.getBoundingClientRect()
      
      if (cartRect) {
        const flyingItem = {
          id: Date.now(),
          startX: buttonRect.left + buttonRect.width / 2,
          startY: buttonRect.top + buttonRect.height / 2,
          endX: cartRect.left + cartRect.width / 2,
          endY: cartRect.top + cartRect.height / 2,
          productImg: product.img
        }
        
        setFlyingItems(prev => [...prev, flyingItem])
        
        setTimeout(() => {
          setFlyingItems(prev => prev.filter(item => item.id !== flyingItem.id))
        }, 1000)
      }
    }

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

  const VerticalSidebar = () => (
    <motion.aside 
      className="fixed left-0 top-0 h-full w-80 z-50"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="h-full bg-gradient-to-b from-white/95 to-cream-50/95 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl flex flex-col">
        
        <motion.div 
          className="p-6 border-b border-gray-200/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-white font-serif font-bold text-lg">L</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-serif text-2xl font-bold text-gray-900">{brand.name}</h1>
              <p className="text-xs text-gray-600 mt-1">Premium Skincare</p>
            </motion.div>
          </div>
        </motion.div>

        <nav className="flex-1 py-8">
          <div className="space-y-2 px-4">
            {[
              { id: 'hero', icon: '🏠', label: 'Главная' },
              { id: 'about', icon: '🌟', label: 'О нас' },
              { id: 'collections', icon: '💎', label: 'Коллекции' },
              { id: 'featured', icon: '⭐', label: 'Бестселлеры' },
              { id: 'testimonials', icon: '💬', label: 'Отзывы' },
              { id: 'blog', icon: '📚', label: 'Блог' }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.id === 'hero') {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    const element = document.getElementById(item.id)
                    if (element) {
                      const offsetTop = element.offsetTop - 20
                      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
                    }
                  }
                  setActiveSection(item.id)
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden ${
                  activeSection === item.id 
                    ? 'bg-brand-50 text-brand-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeSection === item.id && (
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600 rounded-r-full"
                    layoutId="activeIndicator"
                  />
                )}
                
                <motion.span 
                  className="text-xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {item.icon}
                </motion.span>
                
                <motion.span 
                  className="font-medium text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {item.label}
                </motion.span>

                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-brand-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setCurrentView('catalog')}
            className="mx-4 mt-6 w-[calc(100%-2rem)] flex items-center gap-4 p-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span 
              className="text-lg"
              whileHover={{ rotate: 90 }}
            >
              🛍️
            </motion.span>
            <span className="font-semibold text-sm">Каталог</span>
          </motion.button>
        </nav>

        <div className="p-4 border-t border-gray-200/30 space-y-3">
          {user ? (
            <>
              <motion.button
                onClick={() => setCurrentView('profile')}
                className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 transition-all group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm truncate">{user.username || 'Пользователь'}</div>
                  <div className="text-xs text-gray-500">Профиль</div>
                </div>
                <motion.span 
                  className="text-lg opacity-60 group-hover:opacity-100"
                  whileHover={{ x: 2 }}
                >
                  👤
                </motion.span>
              </motion.button>

              <motion.button 
                onClick={() => setCurrentView('profile')}
                className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 transition-all group relative"
                whileHover={{ scale: 1.02 }}
                ref={cartIconRef}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shadow-md group-hover:bg-gray-200 transition-colors">
                  <span className="text-lg">🛒</span>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">Корзина</div>
                  <div className="text-xs text-gray-500">
                    {cart.reduce((total, item) => total + item.quantity, 0)} товаров
                  </div>
                </div>
                
                {cart.length > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cart.reduce((total, item) => total + item.quantity, 0)}
                  >
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-3 rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <span className="text-lg">🚪</span>
                </div>
                <span className="font-medium text-sm">Выйти</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-lg">🔑</span>
              </motion.div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">Войти в аккаунт</div>
                <div className="text-xs text-white/80">Доступ к профилю</div>
              </div>
              <motion.span 
                className="opacity-60 group-hover:opacity-100"
                whileHover={{ x: 3 }}
              >
                →
              </motion.span>
            </motion.button>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-1/4 -left-10 w-20 h-20 bg-brand-600/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 -left-5 w-16 h-16 bg-brand-700/10 rounded-full blur-lg"
            animate={{
              y: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </div>
      </div>
    </motion.aside>
  )

  const ScrollProgress = () => (
    <motion.div 
      className="fixed top-0 left-80 right-0 h-1 bg-brand-600/20 z-40 origin-left"
      style={{ scaleX }}
    />
  )

  const FlyingItem = ({ item }) => (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{
        x: item.startX,
        y: item.startY,
        scale: 1,
        opacity: 1
      }}
      animate={{
        x: item.endX,
        y: item.endY,
        scale: 0.5,
        opacity: 0
      }}
      transition={{
        duration: 1,
        ease: "easeOut"
      }}
    >
      <img 
        src={item.productImg} 
        alt="Flying item" 
        className="w-8 h-8 rounded-lg shadow-lg"
      />
    </motion.div>
  )

  if (currentView === 'catalog') {
    return (
      <div className="min-h-screen bg-cream-50">
        <VerticalSidebar />
        <AnimatePresence>
          {flyingItems.map(item => (
            <FlyingItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
        <div className="ml-80 pt-4 p-8">
          <PremiumCatalogView 
            products={products} 
            onBack={() => setCurrentView('home')} 
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            favorites={favorites}
            onProductClick={handleProductClick}
          />
        </div>
      </div>
    )
  }

  if (currentView === 'profile' && user) {
    return (
      <div className="min-h-screen bg-cream-50">
        <VerticalSidebar />
        <div className="ml-80 pt-4 p-8">
          <ProfileView 
            user={user} 
            cart={cart}
            orderHistory={orderHistory}
            favorites={favorites}
            onBack={() => setCurrentView('home')}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onAddToFavorites={handleAddToFavorites}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-cream-50 overflow-x-hidden">
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

      <VerticalSidebar />
      <ScrollProgress />
      
      <AnimatePresence>
        {flyingItems.map(item => (
          <FlyingItem key={item.id} item={item} />
        ))}
      </AnimatePresence>

      <div className="ml-80">
        <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-brand-50"
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
                onClick={() => {
                  const element = document.getElementById('about')
                  if (element) {
                    const offsetTop = element.offsetTop - 20
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
                  }
                }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-white transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Узнать больше
              </motion.button>
            </motion.div>

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
    </div>
  )
}

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
            onAddToCart(product, e);
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
            onAddToCart(item, e);
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
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-8 text-brand-600 hover:text-brand-700 flex items-center gap-2">
          ← Назад на главную
        </button>
        <h1 className="font-serif text-4xl font-bold mb-8">Каталог продуктов</h1>
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
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-8 text-brand-600 hover:text-brand-700 flex items-center gap-2">
          ← Назад на главную
        </button>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-brand-600 to-brand-700 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">Добро пожаловать в ваш профиль</p>
            </div>
          </div>
        </div>

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
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => onRemoveFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Итого:</span>
                    <span className="text-brand-600">
                      €{cart.reduce((total, item) => total + (parseInt(item.price.replace('€', '')) * item.quantity), 0)}
                    </span>
                  </div>
                  <button className="w-full mt-4 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
                    Оформить заказ
                  </button>
                </div>
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
                      className="text-red-500 hover:text-red-700 text-2xl"
                    >
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {orderHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-8">
            <h2 className="font-serif text-2xl font-semibold mb-4">История заказов</h2>
            <div className="space-y-4">
              {orderHistory.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Заказ #{order.id}</h3>
                    <p className="text-gray-600 text-sm">Дата: {order.date}</p>
                    <p className="text-gray-600 text-sm">Товары: {order.products.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-600">{order.total}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}