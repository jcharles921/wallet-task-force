import express from 'express';
import accountsRouter from './accounts';
import transactionsRouter from './transactions';
import categoriesRouter from './categories';
import notificationsRouter from './notifications';

const router = express.Router();

router.use('/accounts', accountsRouter);
router.use('/transactions', transactionsRouter);
router.use('/categories', categoriesRouter);
router.use('/notifications', notificationsRouter);

export default router;