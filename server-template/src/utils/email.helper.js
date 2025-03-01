import nodemailer from "nodemailer";

/**
 * Sends an email using the configured SMTP server.
 *
 * @param {Object} options - Email details
 * @param {string} options.email - Recipient's email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message body
 * @returns {Promise<void>} - Resolves when the email is sent successfully
 */
const sendMail = async (options) => {
  // Create a transporter using SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host
    port: process.env.SMTP_PORT, // SMTP server port
    secure: true, // Use TLS for port 465, otherwise set to false
    auth: {
      user: process.env.SMTP_MAIL, // SMTP authentication email
      pass: process.env.SMTP_PASSWORD, // SMTP authentication password
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.SMTP_MAIL, // Sender's email
    to: options.email, // Recipient's email
    subject: options.subject, // Email subject
    text: options.message, // Email body in plain text
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendMail;
