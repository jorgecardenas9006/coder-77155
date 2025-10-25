// En ./utils/index.js
import { fileURLToPath } from 'url'
import { dirname, join as pathJoin } from 'path'

// Crear __dirname para ES modules
const __dirname = dirname(fileURLToPath(import.meta.url))

// Función join para paths
const join = (...paths) => pathJoin(...paths)

// Exportar todo
export { createHash, isValidPassword } from './pass.js'
export { __dirname, join }