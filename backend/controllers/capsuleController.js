import Capsule from '../models/Capsule.js';
import User from '../models/User.js';
import { generateAIContent } from '../utils/gemini.js';
import sendNotificationEmail from '../utils/sendEmail.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; 

export const getCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ creator: req.user.id }).sort({ createdAt: -1 });
    res.json(capsules);
  } catch (err) { res.status(500).send('Server Error'); }
};

export const createCapsule = async (req, res) => {
  try {
    console.log("------------------------------------------------");
    console.log("🔍 DEBUG: Starting createCapsule...");
    
    const { title, message, unlockDate, theme, recipients } = req.body;
    console.log(" Raw Recipients from Frontend:", recipients); 

    // ✅ FIX 1: TIMEZONE CORRECTION (IST to UTC)
    // Server is UTC. You are in IST (+5:30).
    // We subtract 5.5 hours so the server stores the correct UTC moment.
    const userDate = new Date(unlockDate);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const adjustedDate = new Date(userDate.getTime() - istOffset);

    console.log(`🕒 Input Date (IST): ${userDate.toISOString()}`);
    console.log(`🕒 Stored Date (UTC): ${adjustedDate.toISOString()}`);

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
    let recipientEmails = [];

    if (recipients) {
      try {
        const parsed = typeof recipients === 'string' ? JSON.parse(recipients) : recipients;
        console.log("🧩 Parsed JSON:", parsed);

        const recipientArray = Array.isArray(parsed) ? parsed : [parsed];
        
        selectedRecipients = recipientArray.map(r => ({
          name: r.name || 'Friend',
          email: r.email,  
          status: 'sent'
        }));
        console.log("🗂️ Mapped Recipients:", selectedRecipients);

        recipientEmails = selectedRecipients
            .map(r => r.email)
            .filter(e => e && e.includes('@')); 
        
        console.log(" Final Email List to Send:", recipientEmails); 

      } catch (e) {
        console.error(" Recipient Parse Error:", e);
      }
    }

    const newCapsule = new Capsule({
      title,
      message,
      file: fileUrl,
      fileType: fileType,
      unlockDate: adjustedDate, // 👈 USING CORRECTED DATE
      theme,
      recipients: selectedRecipients, 
      creator: req.user.id,
    });

    await newCapsule.save();
    console.log(" Capsule Saved to DB");

    // Send "Locked" Notification (Optional)
    if (recipientEmails.length > 0) {
      const user = await User.findById(req.user.id);
      console.log(" Attempting to send email via Nodemailer...");
      
      await sendNotificationEmail(
          recipientEmails, 
          user ? user.username : "A Friend", 
          adjustedDate // Use the adjusted date in email too
      );
    } else {
      console.log(" SKIPPING EMAIL: 'recipientEmails' array is empty.");
    }

    console.log("------------------------------------------------");
    res.status(201).json(newCapsule);

  } catch (err) {
    console.error("Error in createCapsule:", err);
    res.status(500).send('Server Error');
  }
};


export const getReceivedCapsules = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).send("User not found");

    const capsules = await Capsule.find({ 
      "recipients.email": currentUser.email 
    }).populate('creator', 'username'); 
    
    res.json(capsules);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const capsule = await Capsule.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!capsule) return res.status(404).send("Capsule not found");

    if (new Date(capsule.unlockDate) > new Date()) {
      return res.status(403).json({ msg: "Capsule is locked!" });
    }

    capsule.comments.push({
      user: req.user.id,
      username: user.username,
      text
    });
    
    await capsule.save();
    res.json(capsule.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


export const getAIAssistance = async (req, res) => {
  try {
    const { promptType, contextText } = req.body;
    let finalPrompt = "";

    if (promptType === 'caption') {
      finalPrompt = `Create a short, nostalgic, and heartwarming caption (max 15 words) based on this text: "${contextText}". Output ONLY the caption, no quotes, no intro.`;
    } else if (promptType === 'summary') {
      finalPrompt = `Summarize this text into a catchy, emotional title (maximum 4 words): "${contextText}". Output ONLY the title, no quotes, no markdown.`;
    }

    let aiText = await generateAIContent(finalPrompt);

    if (aiText) {
      aiText = aiText
        .replace(/["*]/g, '')      
        .replace(/^Title:\s*/i, '') 
        .replace(/^Caption:\s*/i, '') 
        .trim();                    
    } else {
      aiText = "Could not generate text.";
    }

    res.json({ result: aiText });
  } catch (err) {
    console.error("AI Controller Error:", err);
    res.status(500).send('AI Error');
  }
};


export const checkUnlocks = async (req, res) => {
  try {
    const now = new Date();
    // Debug Log: Show IST equivalent to help you verify
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    console.log("⏰ CRON RUNNING | UTC:", now.toISOString(), "| IST:", istTime.toISOString().replace('Z', ''));

    const capsules = await Capsule.find({
      unlockDate: { $lte: now },
      isUnlockedNotified: false
    }).populate('creator', 'username');

    let count = 0;
    for (const cap of capsules) {
      console.log(`🚀 Unlocking Capsule: ${cap.title}`);
      
      // Handle recipients (support string or object structure)
      const recipientEmails = cap.recipients.map(r => r.email || r).filter(e => e);
      
      if(recipientEmails.length > 0) {
          await sendNotificationEmail(
            recipientEmails, 
            cap.creator ? cap.creator.username : "A Friend", 
            cap.unlockDate, 
            "Your Time Capsule is now UNLOCKED! 🔓" // Custom Subject
          );
      }
      cap.isUnlockedNotified = true;
      await cap.save();
      count++;
    }
    res.send(`Checked unlocks. Sent ${count} notifications.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Cron Error");
  }
};


export const deleteCapsule = async (req, res) => {
  try {
    console.log(`🗑️ DELETE REQUEST: ID ${req.params.id}`);
    
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ msg: 'Capsule not found' });
    }

    // ✅ FIX 2: Use 'creator' instead of 'user' (matches Schema)
    if (!capsule.creator) { 
        console.log("⚠️ Alert: Capsule has no owner (Corrupted Data). Deleting...");
        await capsule.deleteOne();
        return res.json({ msg: 'Corrupted capsule removed' });
    }

    console.log(` Owner ID in DB: ${capsule.creator.toString()}`);
    console.log(` Request User ID: ${req.user.id}`);

    // ✅ FIX 3: Authorization Check using 'creator'
    if (capsule.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await capsule.deleteOne();
    console.log("Success: Capsule deleted.");

    res.json({ msg: 'Capsule removed' });
  } catch (err) {
    console.error(" Server Error during delete:", err.message);
    res.status(500).send('Server Error');
  }
};