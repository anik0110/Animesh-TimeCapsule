import express from 'express';
import auth from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { 
  getCapsules, 
  createCapsule, 
  getReceivedCapsules, 
  addComment, 
  getAIAssistance,
  deleteCapsule 
} from '../controllers/capsuleController.js';

const router = express.Router();

router.get('/', auth, getCapsules); 
router.get('/received', auth, getReceivedCapsules); 
router.post('/', auth, upload.single('file'), createCapsule); 
router.post('/:id/comment', auth, addComment); 
router.post('/ai-assist', auth, getAIAssistance); 

router.delete('/:id', auth, deleteCapsule);
export default router;