# Sanity import notes

To run the import script you'll need to install dependencies:

```bash
npm install @sanity/client dotenv
node cms/sanity/sanity-import.js
```

Set environment variables:

```bash
export SANITY_PROJECT_ID=your_project_id
export SANITY_DATASET=production
export SANITY_TOKEN=your_sanity_token
```

The import script will create brand, products, featured, testimonials and blogPost documents in the target dataset.
