import { dirname, join } from "path";
import { fileURLToPath } from "url";

//variables de entorno para el directorio de la aplicación
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "..");

// Exportar utilidades comunes
export { join, __dirname };

// Re-exportar utilidades específicas
export { setupGracefulShutdown } from './shutdown.js';
export { createUserSessionData, createPublicUserData } from './user.dto.js';