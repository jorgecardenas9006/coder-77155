import 'dotenv/config';
const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sessions',
    POSTGRES_DB: process.env.POSTGRES_DB || 'sessions',
    POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
    POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
    POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
    PREFIX_V1: process.env.PREFIX_V1 || '/api/v1',
    SECRET: process.env.SECRET || 'secret'
}

export default env;