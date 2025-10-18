/**
 * Main schema index
 * Import each schema and export as the schema types array.
 */
import product from './product'
import featured from './featured'
import testimonial from './testimonial'
import blogPost from './blogPost'
import brand from './brand'

export default {
  name: 'default',
  types: [
    product,
    featured,
    testimonial,
    blogPost,
    brand
  ]
}
