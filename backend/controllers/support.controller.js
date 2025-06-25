import nodemailer from "nodemailer";

export const support = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,         // Your Gmail address
        pass: process.env.SUPPORT_EMAIL_PASSWORD // App-specific password
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SUPPORT_EMAIL}>`,  // Your Gmail is the actual sender
      to: process.env.SUPPORT_EMAIL,
      subject: `New Support Message from ${name}`,
      text: `
From: ${name} <${email}>

Message:
${message}
      `,
      replyTo: email // So you can click 'Reply' to reach the user
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
};
