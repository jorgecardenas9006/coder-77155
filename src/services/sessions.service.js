import { SessionsRepository } from '../repositories/sessions.repository.js';
export class SessionsService {
    constructor() {
        this.sessionsRepository = new SessionsRepository();
    }

    async registerUser(email, password) {
        return await this.sessionsRepository.registerUser(email, password);
    }
}