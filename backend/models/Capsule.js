import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  file: { type: String },
  fileType: { type: String }, 
  unlockDate: { type: Date, required: true },
  theme: { type: String, default: 'general' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  
  recipients: [{
    name: String,
    email: String,
    status: { type: String, default: 'sent' }
  }],

  
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String 
  }],

  
  isUnlockedNotified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Capsule', capsuleSchema);