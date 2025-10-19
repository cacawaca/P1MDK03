import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import content from './data/content.json'
import CatalogView from './components/Catalog/CatalogView'

export default function App(){
  const { brand, products, featured, testimonials, blog } = content
  const [currentView, setCurrentView] = useState('home')
  const [pos, setPos] = useState(0)
  const maxPos = Math.max(0, Math.ceil(products.length / 2) - 1)

  function prev(){ setPos(p => Math.max(0, p - 1)) }
  function next(){ setPos(p => Math.min(maxPos, p + 1)) }

  useEffect(()=>{
    function onKey(e){ if(e.key === 'ArrowLeft') prev(); if(e.key === 'ArrowRight') next(); }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  const fadeIn = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }

  if (currentView === 'catalog') {
    return <CatalogView products={products} onBack={() => setCurrentView('home')} />
  }

  return (
    <div className="min-h-screen font-sans text-[var(--text-color)] bg-cream-50">
      <header className="relative h-screen max-h-[820px] flex items-center justify-center overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline poster="/assets/hero-poster.svg">
          <source src="/video/hero-placeholder.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
        <nav className="absolute top-6 left-6 right-6 flex items-center justify-between z-20" aria-label="Основная навигация">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
              <img src="/assets/logo.svg" alt={`${brand.name} logo`} className="w-7 h-7" />
            </div>
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

      {/* Остальной код главной страницы без изменений */}
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
                          <ProductCard {...left} />
                          { right ? <ProductCard {...right} /> : <div className="bg-white rounded-md shadow p-4 sm:p-6 flex items-center justify-center min-h-[200px]">—</div> }
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

// Эти компоненты остаются в App.jsx (пока не вынесены в отдельные файлы)
function ProductCard({ id, name, price, img }){
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
        <button className="px-3 py-1 rounded-full border text-xs sm:text-sm whitespace-nowrap ml-2 hover:bg-gray-50 transition-colors" aria-label={`Купить ${name}`}>Купить</button>
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

function BlogCard({ title, excerpt, img }){
  return (
    <motion.a whileHover={{ scale: 1.02 }} className="block bg-white rounded-md overflow-hidden shadow h-full" href="#" aria-label={`Читать: ${title}`}>
      <div className="h-32 sm:h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={img} alt={title} className="object-cover h-full w-full" />
      </div>
      <div className="p-4">
        <div className="text-sm font-semibold mb-2 line-clamp-2">{title}</div>
        <div className="text-xs text-gray-500 line-clamp-2">{excerpt}</div>
      </div>
    </motion.a>
  )
}