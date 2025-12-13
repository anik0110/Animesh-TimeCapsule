import express from 'express';
import auth from '../middleware/auth.js';
import { getRecipients, addRecipient, deleteRecipient } from '../controllers/recipientController.js';

const router = express.Router();

router.get('/', auth, getRecipients);
router.post('/', auth, addRecipient);
router.delete('/:id', auth, deleteRecipient);

export default router;