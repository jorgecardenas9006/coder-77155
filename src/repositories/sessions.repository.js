import { SessionsDao } from '../dao/sessions.dao.js';
import { redisClient } from '../config/index.js';
export class SessionsRepository {
    constructor() {
        this.sessionsDao = new SessionsDao();
    }

    async registerUser(email, password) {
        return await this.sessionsDao.registerUser(email, password);
    }
    async forgotPassword(email) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(code, email, { EX: 60 * 10 });
        return code;
    }
    async validateCode(code) {
        const extractedDataKey = await redisClient.get(code);
        console.log(extractedDataKey);
        return extractedDataKey;
    } 
    async changePassword(email, newPassword) {
        const user = await this.sessionsDao.changePassword(email, newPassword);
        return user;
    }
    async deleteCode(code) {
        await redisClient.del(code);
    }
}