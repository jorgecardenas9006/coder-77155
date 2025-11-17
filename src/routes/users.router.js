import express from 'express';
import { UsersController } from '../controllers/users.controller.js';


const router = express.Router();

const usersController = new UsersController();

router.get('/', async (req, res) => usersController.getAllUsers(req, res));


export default router;