import mongoose from 'mongoose';

const CapsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  file: { type: String },
  fileType: { type: String, enum: ['image', 'video', 'audio', 'none'], default: 'none' },

  unlockDate: { type: Date, required: true },
  theme: { 
    type: String, 
    enum: ['Childhood', 'Family History', 'College Years', 'Love', 'General'],
    default: 'General'
  },
  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipients: [{ name: String, email: String }], 
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Capsule', CapsuleSchema);