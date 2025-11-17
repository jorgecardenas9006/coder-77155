export class UsersController {
    constructor() {
        this.users = [];
    }

    getAllUsers(req, res) {
        res.status(200).json({ message: 'Users fetched successfully' });
    }
}