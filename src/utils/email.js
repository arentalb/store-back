import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const emailTemplateGenerator = (message, shortMessage, link) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p style="font-size: 16px; color: #333;">${message}</p>
            <p><a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">${shortMessage}</a></p>
        </div>
    `;
};

const sendEmail = async (options) => {
    try {
        // 1 create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const htmlContent = emailTemplateGenerator(
            options.message,
            "Verify Email", // shortMessage
            options.link // link
        );

        // 2 define email options
        const mailOptions = {
            from: `Aren Talb <${process.env.EMAIL_USERNAME}>`,
            to: options.email,
            subject: options.subject, // Correctly use options.subject
            text: options.message, // Plain text body
            html: htmlContent, // HTML body with inline styles
        };

        // 3 send email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;
