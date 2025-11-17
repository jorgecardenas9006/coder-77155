import express from 'express';
import usersRouter from './users.router.js';
import productsRouter from './products.router.js';
import { getDirname } from '../utils/index.js';

const __dirname = getDirname(import.meta.url);

const router = express.Router();

router.use(process.env.PREFIX_V1 + '/users', usersRouter);
router.use(process.env.PREFIX_V1 + '/products', productsRouter);
router.use('/public', express.static(__dirname + '/public'));

export default router;