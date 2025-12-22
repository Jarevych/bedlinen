import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     tls: {
      rejectUnauthorized: false, 
    },
  });
  await transporter.sendMail({
    from: `"BedLinen" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log("📨 Sending email to:", to);
};
