import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'REEMPLAZAR_PROJECT_ID',
    dataset: 'production',
  },
  // Fija el hostname del Studio publicado → https://traru.sanity.studio
  // (evita el prompt interactivo en `sanity deploy`).
  studioHost: 'traru',
  autoUpdates: true,
})
