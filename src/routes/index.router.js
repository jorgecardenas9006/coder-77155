import express from 'express';
import productsRouter from './products.router.js';
import sessionsRouter from './sessions.router.js';
import { getDirname } from '../utils/index.js';

const __dirname = getDirname(import.meta.url);

const router = express.Router();

router.use(process.env.PREFIX_V1 + '/products', productsRouter);
router.use(process.env.PREFIX_V1 + '/sessions', sessionsRouter);
router.use('/public', express.static(__dirname + '/public'));

export default router;