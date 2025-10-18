import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import content from './data/content.json'

export default function App(){
  const { brand, products, featured, testimonials, blog } = content
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
          <div className="flex gap-3 items-center">
            <a href="#catalog" className="px-4 py-2 text-sm rounded-full bg-brand-600 text-white" aria-label="Перейти в каталог">Каталог</a>
            <button aria-label="Открыть поиск" className="w-10 h-10 rounded-full bg-white/80 shadow">🔍</button>
          </div>
        </nav>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="z-20 text-center px-6">
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-4">{brand.name} — {brand.slogan}</h1>
          <p className="max-w-xl mx-auto text-sm md:text-base mb-6">{brand.description}</p>
          <div className="flex gap-4 items-center justify-center">
            <a href="#catalog" className="px-6 py-3 rounded-full bg-brand-600 text-white">Перейти в каталог</a>
            <a href="#about" className="px-6 py-3 rounded-full border border-gray-300">О бренде</a>
          </div>
        </motion.div>
      </header>

      <section id="collections" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-2xl font-semibold mb-6">Коллекции</motion.h2>

          <div className="relative">
            <div className="flex items-center gap-4">
              <button onClick={prev} aria-label="Предыдущая" className="p-3 rounded-full shadow bg-white">‹</button>
              <div className="flex-1 overflow-hidden">
                <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${pos * 100}%)` }}>
                  {products.reduce((acc, p, i, arr) => {
                    if(i % 2 === 0){
                      const left = arr[i]
                      const right = arr[i+1]
                      acc.push(
                        <div key={i} className="w-full flex-shrink-0 grid grid-cols-2 gap-6">
                          <ProductCard {...left} />
                          { right ? <ProductCard {...right} /> : <div className="bg-white rounded-md shadow p-6 flex items-center justify-center">—</div> }
                        </div>
                      )
                    }
                    return acc
                  },[])}
                </div>
              </div>
              <button onClick={next} aria-label="Следующая" className="p-3 rounded-full shadow bg-white">›</button>
            </div>
          </div>
        </div>
      </section>

      <section id="selected" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3 initial="hidden" whileInView="visible" variants={fadeIn} className="text-xl font-semibold mb-6">Избранные продукты</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((f, i) => <FeaturedCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h4 initial="hidden" whileInView="visible" variants={fadeIn} className="text-lg font-semibold mb-4">Что говорят наши клиенты</motion.h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {testimonials.map((t,i) => <Testimonial key={i} {...t} />)}
          </div>
        </div>
      </section>

      <section id="blog" className="py-12 bg-cream-100 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h5 initial="hidden" whileInView="visible" variants={fadeIn} className="text-xl font-semibold mb-6">Полезные материалы</motion.h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blog.map((b,i) => <BlogCard key={i} {...b} />)}
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 items-start">
          <div>
            <div className="font-serif text-2xl">{brand.name}</div>
            <p className="text-sm text-gray-600 max-w-md mt-2">{brand.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h6 className="text-sm font-semibold">Меню</h6>
              <ul className="text-xs mt-2">
                <li><a href="#about">О бренде</a></li>
                <li><a href="#collections">Коллекции</a></li>
                <li><a href="#blog">Статьи</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-sm font-semibold">Контакты</h6>
              <p className="text-xs mt-2">{brand.contactEmail}<br/>{brand.phone}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ id, name, price, img }){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-md shadow p-4 flex flex-col gap-3" role="article">
      <div className="h-44 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        <img src={img} alt={name} className="object-contain h-full" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">{price}</div>
        </div>
        <button className="px-3 py-1 rounded-full border" aria-label={`Купить ${name}`}>Купить</button>
      </div>
    </motion.div>
  )
}

function FeaturedCard({ title, subtitle, img }){
  return (
    <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="rounded-md overflow-hidden shadow">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
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
    <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} className="bg-white rounded-md shadow p-6 text-left">
      <div className="flex items-center gap-4 mb-3">
        <img src={img} alt={`Фото ${name}`} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">Покупатель</div>
        </div>
      </div>
      <p className="text-sm">“{text}”</p>
    </motion.div>
  )
}

function BlogCard({ title, excerpt, img }){
  return (
    <motion.a whileHover={{ scale: 1.02 }} className="block bg-white rounded-md overflow-hidden shadow" href="#" aria-label={`Читать: ${title}`}>
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={img} alt={title} className="object-cover h-full w-full" />
      </div>
      <div className="p-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-gray-500">{excerpt}</div>
      </div>
    </motion.a>
  )
}
