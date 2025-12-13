import Capsule from '../models/Capsule.js';
import User from '../models/User.js';
import sendNotificationEmail from '../utils/sendEmail.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; 

export const getCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ creator: req.user.id }).sort({ createdAt: -1 });
    res.json(capsules);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const createCapsule = async (req, res) => {
  try {
    const { title, message, unlockDate, theme, recipients } = req.body;

    
    let fileUrl = null;
    let fileType = 'none';

    if (req.file && req.file.path) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        fileUrl = cloudinaryResponse.secure_url;
        if (cloudinaryResponse.resource_type === 'image') fileType = 'image';
        else if (cloudinaryResponse.resource_type === 'video') fileType = 'video';
        else if (req.file.mimetype.startsWith('audio')) fileType = 'audio';
      }
    }

    
    let selectedRecipients = [];
    if (recipients) {
      try {
        selectedRecipients = JSON.parse(recipients);
      } catch (e) {
        console.error("Recipient Parse Error", e);
      }
    }

    
    const newCapsule = new Capsule({
      title,
      message,
      file: fileUrl,
      fileType: fileType,
      unlockDate,
      theme,
      recipients: selectedRecipients, 
      creator: req.user.id,
    });

    await newCapsule.save();

    try {
      const user = await User.findById(req.user.id);
      
      if (selectedRecipients.length > 0 && user) {
        const emailList = selectedRecipients.map(r => r.email); 
        
        console.log("📧 Sending notification to:", emailList);
        

        await sendNotificationEmail(emailList, user.username, unlockDate);
      }
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    res.status(201).json(newCapsule);

  } catch (err) {
    console.error("Error in createCapsule:", err);
    res.status(500).send('Server Error');
  }
};