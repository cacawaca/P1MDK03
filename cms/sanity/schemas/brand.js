export default {
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slogan', title: 'Slogan', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' }
  ]
}
