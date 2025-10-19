import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import content from './data/content.json'
import LoginModal from './LoginModal'

export default function App(){
  const { brand, products, featured, testimonials, blog } = content
  const [currentView, setCurrentView] = useState('home')
  const [pos, setPos] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const maxPos = Math.max(0, Math.ceil(products.length / 2) - 1)

  function prev(){ setPos(p => Math.max(0, p - 1)) }
  function next(){ setPos(p => Math.min(maxPos, p + 1)) }

  useEffect(()=>{
    function onKey(e){ 
      if(e.key === 'ArrowLeft') prev(); 
      if(e.key === 'ArrowRight') next(); 
      if(e.key === 'l' || e.key === 'L') setIsLoginModalOpen(true);
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  const fadeIn = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }

  const handleLogin = (userData) => {
    setUser(userData)
    // Заглушка для данных пользователя
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
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
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

  if (currentView === 'catalog') {
    return <PremiumCatalogView 
      products={products} 
      onBack={() => setCurrentView('home')} 
      onAddToCart={handleAddToCart}
      onAddToFavorites={handleAddToFavorites}
      favorites={favorites}
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
    <div className="min-h-screen font-sans text-[var(--text-color)] bg-cream-50">
      {/* Модальное окно авторизации */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <header className="relative h-screen max-h-[820px] flex items-center justify-center overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline poster="/assets/hero-poster.svg">
          <source src="/video/hero-placeholder.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
        <nav className="absolute top-6 left-6 right-6 flex items-center justify-between z-20" aria-label="Основная навигация">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
            >
              <span className="font-serif text-lg font-bold text-brand-600">L</span>
            </button>
            <div className="hidden md:block">
              <ul className="flex gap-6 text-sm" role="menubar">
                <li role="none"><a role="menuitem" href="#collections" className="hover:underline">Коллекции</a></li>
                <li role="none"><a role="menuitem" href="#about" className="hover:underline">О бренде</a></li>
                <li role="none"><a role="menuitem" href="#blog" className="hover:underline">Советы</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="z-20 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 md:mb-6">{brand.name} — {brand.slogan}</h1>
          <p className="max-w-xl mx-auto text-sm md:text-base mb-6 md:mb-8 px-4">{brand.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <button 
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm md:text-base w-full sm:w-auto text-center hover:bg-brand-700 transition-colors"
            >
              Перейти в каталог
            </button>
            <a href="#about" className="px-6 py-3 rounded-full border border-gray-300 text-sm md:text-base w-full sm:w-auto text-center hover:bg-gray-50 transition-colors">О бренде</a>
          </div>
        </motion.div>
      </header>

      {/* Секция "О бренде" */}
      <section id="about" className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-8 text-gray-900">
              О бренде Lumiára
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-brand-600">Наша философия</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Lumiára — это синтез передовых научных разработок и щедрых даров природы. 
                    Мы создаём косметику, которая не просто ухаживает за кожей, а восстанавливает 
                    её естественное сияние и здоровье.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-brand-600">Научный подход</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Каждая наша формула проходит клинические испытания и создаётся при участии 
                    ведущих дерматологов. Мы используем только эффективные концентрации активных 
                    ингредиентов.
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-serif font-semibold text-brand-600">100%</div>
                    <div className="text-sm text-gray-600">Натуральные компоненты</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif font-semibold text-brand-600">0%</div>
                    <div className="text-sm text-gray-600">Парабены и сульфаты</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-serif font-semibold text-brand-600">5+</div>
                    <div className="text-sm text-gray-600">Лет исследований</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-brand-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">✨</span>
                    </div>
                    <h4 className="font-serif text-xl font-semibold">Инновации в каждой капле</h4>
                    <p className="text-gray-600 text-sm">
                      Сочетание традиционных рецептов и современных технологий
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Коллекции */}
      <section id="collections" className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-xl sm:text-2xl font-semibold mb-6 text-center md:text-left">Коллекции</motion.h2>
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={prev} aria-label="Предыдущая" className="p-2 sm:p-3 rounded-full shadow bg-white text-sm sm:text-base">‹</button>
              <div className="flex-1 overflow-hidden">
                <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${pos * 100}%)` }}>
                  {products.reduce((acc, p, i, arr) => {
                    if(i % 2 === 0){
                      const left = arr[i]
                      const right = arr[i+1]
                      acc.push(
                        <div key={i} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2">
                          <ProductCard {...left} onAddToCart={handleAddToCart} />
                          { right ? <ProductCard {...right} onAddToCart={handleAddToCart} /> : <div className="bg-white rounded-md shadow p-4 sm:p-6 flex items-center justify-center min-h-[200px]">—</div> }
                        </div>
                      )
                    }
                    return acc
                  },[])}
                </div>
              </div>
              <button onClick={next} aria-label="Следующая" className="p-2 sm:p-3 rounded-full shadow bg-white text-sm sm:text-base">›</button>
            </div>
          </div>
        </div>
      </section>

      <section id="selected" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h3 initial="hidden" whileInView="visible" variants={fadeIn} className="text-lg sm:text-xl font-semibold mb-6 text-center md:text-left">Избранные продукты</motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featured.map((f, i) => <FeaturedCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h4 initial="hidden" whileInView="visible" variants={fadeIn} className="text-base sm:text-lg font-semibold mb-4">Что говорят наши клиенты</motion.h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {testimonials.map((t,i) => <Testimonial key={i} {...t} />)}
          </div>
        </div>
      </section>

      <section id="blog" className="py-12 bg-cream-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h5 initial="hidden" whileInView="visible" variants={fadeIn} className="text-lg sm:text-xl font-semibold mb-6 text-center md:text-left">Полезные материалы</motion.h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blog.map((b,i) => <BlogCard key={i} {...b} />)}
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between gap-6 md:gap-8 items-start">
          <div className="text-center md:text-left">
            <div className="font-serif text-2xl">{brand.name}</div>
            <p className="text-sm text-gray-600 max-w-md mt-2">{brand.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full sm:w-auto">
            <div className="text-center sm:text-left">
              <h6 className="text-sm font-semibold">Меню</h6>
              <ul className="text-xs mt-2 space-y-1">
                <li><a href="#about" className="hover:underline">О бренде</a></li>
                <li><a href="#collections" className="hover:underline">Коллекции</a></li>
                <li><a href="#blog" className="hover:underline">Статьи</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h6 className="text-sm font-semibold">Контакты</h6>
              <p className="text-xs mt-2">{brand.contactEmail}<br/>{brand.phone}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Компонент профиля пользователя
function ProfileView({ user, cart, orderHistory, favorites, onBack, onRemoveFromCart, onUpdateQuantity, onAddToFavorites }) {
  const totalCartValue = cart.reduce((sum, item) => sum + parseInt(item.price.replace('€', '')) * item.quantity, 0)

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Хедер профиля */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-50"
            >
              <span className="text-lg">←</span>
              <span>На главную</span>
            </button>
            <div>
              <h1 className="font-serif text-3xl text-gray-900">Мой профиль</h1>
              <p className="text-gray-600">Добро пожаловать, {user.username}!</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-serif text-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Корзина */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold mb-6 text-gray-900">Корзина ({cart.length})</h2>
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img src={item.img} alt={item.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-semibold">
                      €{parseInt(item.price.replace('€', '')) * item.quantity}
                    </div>
                    <button 
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Итого:</span>
                    <span>€{totalCartValue}</span>
                  </div>
                  <button className="w-full mt-4 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
                    Оформить заказ
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Корзина пуста
              </div>
            )}
          </div>

          {/* История заказов */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold mb-6 text-gray-900">История заказов</h2>
            {orderHistory.length > 0 ? (
              <div className="space-y-4">
                {orderHistory.map(order => (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Заказ #{order.id}</div>
                        <div className="text-sm text-gray-600">{order.date}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Доставлен' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{order.items} товара</span>
                      <span className="font-semibold">{order.total}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {order.products.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                История заказов пуста
              </div>
            )}
          </div>

          {/* Избранное */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold mb-6 text-gray-900">Избранное ({favorites.length})</h2>
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img src={item.img} alt={item.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.price}</div>
                    </div>
                    <button 
                      onClick={() => onAddToFavorites(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ♥
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Пока нет избранных товаров
              </div>
            )}
          </div>

          {/* Настройки аккаунта */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold mb-6 text-gray-900">Настройки аккаунта</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span>Личная информация</span>
                <span>→</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span>Уведомления</span>
                <span>→</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span>Безопасность</span>
                <span>→</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                <span>Подписка на рассылку</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Премиальный каталог
function PremiumCatalogView({ products, onBack, onAddToCart, onAddToFavorites, favorites }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState(100)
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Максимальная цена для ползунка
  const maxPrice = Math.max(...products.map(p => parseInt(p.price.replace('€', ''))))

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Фильтрация по цене (ползунок)
    filtered = filtered.filter(product => {
      const price = parseInt(product.price.replace('€', ''))
      return price <= priceRange
    })

    // Сортировка
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <span className="text-lg">←</span>
                <span className="hidden sm:inline">На главную</span>
              </button>
              <div>
                <h1 className="font-serif text-2xl text-gray-900">Каталог Lumiára</h1>
                <p className="text-gray-600 text-sm">Эксклюзивная коллекция премиальной косметики</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 hidden md:block">
              Найдено: {filteredProducts.length} товаров
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковая панель фильтров */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="font-serif text-lg font-semibold mb-6 text-gray-900">Фильтры</h3>
              
              {/* Поиск */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Название товара..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              {/* Ползунок цены */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Цена: до €{priceRange}
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--brand-600) 0%, var(--brand-600) ${(priceRange / maxPrice) * 100}%, #e5e7eb ${(priceRange / maxPrice) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>€0</span>
                  <span>€{maxPrice}</span>
                </div>
              </div>

              {/* Сортировка */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Сортировка</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-gray-50"
                >
                  <option value="name">По названию</option>
                  <option value="price">По цене (сначала дешевые)</option>
                  <option value="price-desc">По цене (сначала дорогие)</option>
                </select>
              </div>

              {/* Счетчик товаров для мобильных */}
              <div className="md:hidden text-sm text-gray-500 pt-4 border-t">
                Найдено: {filteredProducts.length} товаров
              </div>
            </div>
          </motion.div>

          {/* Основная область с товарами */}
          <div className="flex-1">
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      layout
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <PremiumProductCard 
                        product={product} 
                        onSelect={setSelectedProduct}
                        onAddToFavorites={onAddToFavorites}
                        isFavorite={favorites.some(fav => fav.id === product.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4 text-gray-300">✨</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Попробуйте изменить параметры поиска или фильтры, чтобы найти подходящие товары
                  </p>
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
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            isFavorite={favorites.some(fav => fav.id === selectedProduct.id)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Улучшенный PremiumProductCard
function PremiumProductCard({ product, onSelect, onAddToFavorites, isFavorite }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
    >
      <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
        {/* Изображение товара с улучшенной анимацией */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden">
          <motion.img 
            src={product.img} 
            alt={product.name}
            className="w-full h-full object-contain"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => onSelect(product)}
          />
          <button 
            onClick={() => onAddToFavorites(product)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>
        
        {/* Информация о товаре */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            Эксклюзивная формула с натуральными ингредиентами для сияния и здоровья вашей кожи
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <motion.div 
              className="text-2xl font-serif font-semibold text-brand-600"
              whileHover={{ scale: 1.05 }}
            >
              {product.price}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "var(--brand-700)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium transition-colors text-sm"
              onClick={() => onSelect(product)}
            >
              Подробнее
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Модальное окно с деталями товара
function ProductModal({ product, onClose, onAddToCart, onAddToFavorites, isFavorite }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="font-serif text-3xl font-semibold text-gray-900">{product.name}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onAddToFavorites(product)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-64 object-contain"
              />
            </div>
            
            <div>
              <div className="text-3xl font-serif font-semibold text-brand-600 mb-6">
                {product.price}
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Описание</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Премиальный уход с клинически доказанной эффективностью. 
                    Натуральные ингредиенты в сочетании с инновационными технологиями 
                    обеспечивают мгновенный и долгосрочный результат.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ключевые преимущества</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Натуральные активные компоненты</li>
                    <li>• Клинически проверенная формула</li>
                    <li>• Подходит для чувствительной кожи</li>
                    <li>• Vegan-friendly состав</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors"
                >
                  Добавить в корзину
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToFavorites(product)}
                  className={`px-6 py-4 rounded-xl font-semibold text-lg border transition-colors ${
                    isFavorite 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isFavorite ? '♥' : '♡'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Остальные компоненты
function ProductCard({ id, name, price, img, onAddToCart }){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-md shadow p-4 sm:p-6 flex flex-col gap-3 h-full" role="article">
      <div className="h-32 sm:h-44 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        <img src={img} alt={name} className="object-contain h-full max-w-full" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="text-xs text-gray-500">{price}</div>
        </div>
        <button 
          onClick={() => onAddToCart({ id, name, price, img })}
          className="px-3 py-1 rounded-full border text-xs sm:text-sm whitespace-nowrap ml-2 hover:bg-gray-50 transition-colors" 
          aria-label={`Купить ${name}`}
        >
          Купить
        </button>
      </div>
    </motion.div>
  )
}

function FeaturedCard({ title, subtitle, img }){
  return (
    <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="rounded-md overflow-hidden shadow h-full">
      <div className="h-36 sm:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={img} alt={title} className="object-cover h-full w-full" />
      </div>
      <div className="p-4 bg-white">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </motion.div>
  )
}

function Testimonial({ name, text, img }){
  return (
    <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} className="bg-white rounded-md shadow p-4 sm:p-6 text-left h-full">
      <div className="flex items-center gap-3 sm:gap-4 mb-3">
        <img src={img} alt={`Фото ${name}`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="text-xs text-gray-500">Покупатель</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed">"{text}"</p>
    </motion.div>
  )
}

function BlogCard({ title, excerpt, img, url }){
  // Внешние ресурсы для блога
  const blogUrls = {
    "Как выбрать дневной крем": "https://www.vichyconsult.com/ru/sovety-po-ukhodu-za-kozhei/kak-vybrat-dnevnoy-krem-dlya-litsa-article-763.aspx",
    "Ритуал ночного ухода": "https://www.loreal-paris.ru/beauty-magazine/skin-care/night-skin-care-routine",
    "Польза витамина C": "https://www.theordinary.com/en-us/vitamin-c-guide"
  };

  const blogUrl = url || blogUrls[title] || "#";

  return (
    <motion.a 
      whileHover={{ scale: 1.02, y: -4 }}
      href={blogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100"
      aria-label={`Читать: ${title}`}
    >
      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
        <img src={img} alt={title} className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
      </div>
      <div className="p-6">
        <div className="text-lg font-semibold mb-3 line-clamp-2 text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 line-clamp-2 mb-4">{excerpt}</div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-600 font-medium">Читать статью</span>
          <span className="text-gray-400 text-lg">→</span>
        </div>
      </div>
    </motion.a>
  )
}