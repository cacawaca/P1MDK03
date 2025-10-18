/**
 * sanity-import.js
 *
 * Usage:
 * 1. npm install @sanity/client dotenv
 * 2. Set environment variables: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
 * 3. node cms/sanity/sanity-import.js
 *
 * This script reads src/data/content.json and imports documents to Sanity.
 * It tries to create or patch documents based on slug/title to avoid duplicates.
 */

const fs = require('fs')
const path = require('path')
const sanityClient = require('@sanity/client')
require('dotenv').config()

const PROJECT_ID = process.env.SANITY_PROJECT_ID
const DATASET = process.env.SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Please set SANITY_PROJECT_ID and SANITY_TOKEN in your environment.')
  process.exit(1)
}

const client = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false
})

async function importContent() {
  const jsonPath = path.join(__dirname, '../../src/data/content.json')
  const raw = fs.readFileSync(jsonPath, 'utf-8')
  const data = JSON.parse(raw)

  // Upsert brand
  if (data.brand) {
    const brandDoc = {
      _id: 'brand-main',
      _type: 'brand',
      name: data.brand.name || '',
      slogan: data.brand.slogan || '',
      description: data.brand.description || '',
      contactEmail: data.brand.contactEmail || '',
      phone: data.brand.phone || ''
    }
    await client.createOrReplace(brandDoc)
    console.log('Brand imported.')
  }

  // Products
  if (Array.isArray(data.products)) {
    for (const p of data.products) {
      const doc = {
        _type: 'product',
        title: p.name || '',
        slug: { _type: 'slug', current: p.slug || p.name.toLowerCase().replace(/\s+/g,'-') },
        price: p.price || '',
        description: p.description || '',
        order: p.id || 0
      }
      const res = await client.create(doc)
      console.log('Created product', res._id)
    }
  }

  // Featured
  if (Array.isArray(data.featured)) {
    for (const f of data.featured) {
      const doc = {
        _type: 'featured',
        title: f.title || '',
        subtitle: f.subtitle || '',
        order: f.order || 0
      }
      await client.create(doc)
    }
  }

  // Testimonials
  if (Array.isArray(data.testimonials)) {
    for (const t of data.testimonials) {
      const doc = {
        _type: 'testimonial',
        name: t.name || '',
        role: t.role || 'Покупатель',
        text: t.text || ''
      }
      await client.create(doc)
    }
  }

  // Blog posts
  if (Array.isArray(data.blog)) {
    for (const b of data.blog) {
      const doc = {
        _type: 'blogPost',
        title: b.title || '',
        slug: { _type: 'slug', current: b.slug || b.title.toLowerCase().replace(/\s+/g,'-') },
        excerpt: b.excerpt || '',
        publishedAt: new Date().toISOString()
      }
      await client.create(doc)
    }
  }

  console.log('Import finished.')
}

importContent().catch(err => { console.error(err); process.exit(1) })
