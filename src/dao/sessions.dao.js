import { SessionsModel } from './models/sessions.model.js';

export class SessionsDao {
    async registerUser(email, password) {
        return await SessionsModel.create({ email, password });
    }
}