import { SessionsDao } from '../dao/sessions.dao.js';
export class SessionsRepository {
    constructor() {
        this.sessionsDao = new SessionsDao();
    }

    async registerUser(email, password) {
        return await this.sessionsDao.registerUser(email, password);
    }
}