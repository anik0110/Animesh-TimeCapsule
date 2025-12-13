import express from 'express';
import auth from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { getCapsules, createCapsule } from '../controllers/capsuleController.js';

const router = express.Router();

router.get('/', auth, getCapsules);
router.post('/', auth, upload.single('file'), createCapsule);

export default router;