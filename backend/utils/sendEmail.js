import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendNotificationEmail = async (recipients, senderName, unlockDate) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email credentials missing in .env file");
      return;
    }

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

    const mailOptions = {
      from: `"TimeCapsule ⏳" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: `You have a new Time Capsule from ${senderName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">You've received a locked memory! 🎁</h2>
          <p>Hello,</p>
          <p><strong>${senderName}</strong> has created a digital Time Capsule for you.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>🔐 Unlock Date:</strong> ${dateString}</p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #666;">(Content is hidden until this date)</p>
          </div>

          <p>Login to view your vault:</p>
          <a href="http://localhost:5173" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open TimeCapsule</a>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully. ID:", info.messageId);

  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendNotificationEmail;