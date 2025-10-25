export default {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/coder-77155',
    SECRET: process.env.SECRET || 'fallback-secret-key',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
};