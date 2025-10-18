export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', title: 'Excerpt', type: 'text' },
    { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
    { name: 'coverImage', title: 'Cover image', type: 'image' },
    { name: 'publishedAt', title: 'Published at', type: 'datetime' }
  ]
}
