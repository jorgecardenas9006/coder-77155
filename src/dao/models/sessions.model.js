import mongoose from 'mongoose';

// Schema básico para el modelo User
const userSchema = new mongoose.Schema({
    // githubId para registro con github
    githubId:{
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    // Información personal básica
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxlength: [50, 'El apellido no puede exceder 50 caracteres']
    },
    
    // Información de contacto
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Por favor ingresa un email válido'
        ]
    },
    phone: {
        type: String,
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Por favor ingresa un número de teléfono válido'
        ]
    },
    
    // Autenticación básica
    password: {
        type: String,
        required: function() {
            // Solo requerido si NO es OAuth (no tiene githubId)
            return !this.githubId;
        },
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    
    // Estado y roles
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    
    // Información de perfil
    avatar: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function(date) {
                return date < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a hoy'
        }
    },
    
    // Dirección simple
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    city: {
        type: String,
        trim: true,
        maxlength: [50, 'La ciudad no puede exceder 50 caracteres']
    },
    
    // Configuraciones de usuario
    preferences: {
        language: {
            type: String,
            enum: ['es', 'en', 'pt'],
            default: 'es'
        },
        timezone: {
            type: String,
            default: 'America/Argentina/Buenos_Aires'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            }
        }
    },
    
    // Timestamps básicos
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

/**
 * Virtual: fullName
 * Combina firstName y lastName para crear el nombre completo del usuario
 * 
 * @returns {string} El nombre completo formateado como "Nombre Apellido"
 * 
 * @example
 * const user = new User({ firstName: 'Juan', lastName: 'Pérez' });
 * console.log(user.fullName); // "Juan Pérez"
 */
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * Virtual: age
 * Calcula la edad del usuario basada en su fecha de nacimiento
 * 
 * @returns {number|null} La edad en años, o null si no hay fecha de nacimiento
 * 
 * @description
 * Calcula la edad considerando el año, mes y día de nacimiento.
 * Si el cumpleaños aún no ha llegado este año, resta 1 año.
 * 
 * @example
 * const user = new User({ 
 *   firstName: 'Juan', 
 *   lastName: 'Pérez',
 *   dateOfBirth: new Date('1990-05-15') 
 * });
 * console.log(user.age); // 34 (si estamos en 2024)
 * 
 * @example
 * const user = new User({ firstName: 'Ana', lastName: 'García' });
 * console.log(user.age); // null (sin fecha de nacimiento)
 */
userSchema.virtual('age').get(function() {
    // Si no hay fecha de nacimiento, retornar null
    if (!this.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    
    // Calcular diferencia de años
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Verificar si el cumpleaños ya pasó este año
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    // Si el cumpleaños no ha llegado este año, restar 1 año
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    return age;
});

const SessionsModel = mongoose.model('User', userSchema);

export { SessionsModel };