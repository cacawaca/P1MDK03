export default {
  name: 'featured',
  title: 'Featured',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'image', title: 'image', type: 'image' },
    { name: 'order', title: 'order', type: 'number' }
  ]
}
