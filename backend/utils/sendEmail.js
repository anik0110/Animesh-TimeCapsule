import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendNotificationEmail = async (recipients, senderName, unlockDate, customSubject = null) => {

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    
    if (!recipients || recipients.length === 0) {
      console.warn("⚠️ sendNotificationEmail called with no recipients. Aborting.");
      return;
    }

    
    const toAddress = Array.isArray(recipients) ? recipients.join(',') : recipients;
    
    console.log(` Sending via Nodemailer to: ${toAddress}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dateString = new Date(unlockDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const subject = customSubject || `You have a new Time Capsule from ${senderName}!`;

    const mailOptions = {
      from: `"TimeCapsule " <${process.env.EMAIL_USER}>`,
      to: toAddress, 
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4f46e5;">${customSubject ? 'Time Capsule Unlocked! 🔓' : 'You received a locked memory! 🎁'}</h2>
          <p>Hello,</p>
          <p><strong>${senderName}</strong> has sent you a digital Time Capsule.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>🔐 Unlock Date:</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${dateString}</p>
          </div>

          <p>
            ${customSubject ? "The wait is over! Click below to view the message." : "You will receive another email when this memory opens."}
          </p>

          <a href="${FRONTEND_URL}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Open TimeCapsule</a>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully:", info.messageId);
  } catch (error) {
    console.error(" Error sending email:", error);
  }
};

export default sendNotificationEmail;