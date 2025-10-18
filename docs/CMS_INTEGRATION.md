# Headless CMS integration (Sanity / Contentful / Strapi) — instructions & code snippets

This project ships with a **local JSON content source** at `src/data/content.json` used by the app by default.

To connect a real Headless CMS, choose one of these approaches and follow the steps below.

---

## Sanity (recommended)

1. Install CLI and create a project:
```bash
npm install -g @sanity/cli
sanity init --create-project
```
2. Create schemas for products, featured, testimonials and blog posts.
3. Deploy the dataset and get `PROJECT_ID` and `DATASET`.
4. In your frontend install the Sanity client:
```bash
npm install @sanity/client
```
5. Example client usage (create `src/cms/sanity.js`):
```js
import sanityClient from '@sanity/client'
export const client = sanityClient({ projectId: process.env.SANITY_PROJECT_ID, dataset: process.env.SANITY_DATASET, useCdn: true })
// Sample query
export async function fetchContent(){
  const products = await client.fetch(`*[_type == "product"]{_id, name, price, 'img': image.asset->url}`)
  // map to expected shape and return
}
```
6. Set environment variables in Netlify/Vercel and update fetching code.

---

## Contentful

1. Create a space and content types.
2. Obtain Delivery API key and Space ID.
3. Install contentful client:
```bash
npm install contentful
```
4. Example (src/cms/contentful.js):
```js
import { createClient } from 'contentful'
const client = createClient({ space: process.env.CONTENTFUL_SPACE_ID, accessToken: process.env.CONTENTFUL_ACCESS_TOKEN })
export async function fetchContent(){
  const entries = await client.getEntries({ content_type: 'product' })
  // map entries to project shape
}
```

---

## Strapi (self-hosted)

1. Deploy Strapi (or run locally), create collection types.
2. Use REST or GraphQL endpoints in the frontend to fetch data.
3. Example fetch:
```js
const res = await fetch(`${process.env.STRAPI_URL}/products`)
const products = await res.json()
```

---

### Notes about Media and CORS
- When loading images from a CMS, ensure CORS headers are set or proxy images to your hosting.
- For Sanity, use the image URL builder or `@sanity/image-url`.

---

If you want, I can prepare a ready-to-run Sanity schema + a bash script to push the sample content from `src/data/content.json` into a new Sanity dataset. Say "да — Sanity" and I will generate that next.
