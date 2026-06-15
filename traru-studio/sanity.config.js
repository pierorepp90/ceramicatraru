import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/index.js'

// projectId no es secreto (es público): queda en el código sin problema.
// Se completa tras crear el proyecto con `sanity projects create`.
export default defineConfig({
  name: 'default',
  title: 'Traru Cerámica',

  projectId: 'REEMPLAZAR_PROJECT_ID',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
