import nodemailer from "nodemailer"

const emailTemplateGenerator = (message, shortMessage, link) => {
    return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p style="font-size: 16px; color: #333;">${message}</p>
                <p><a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Link :)</a></p>
            </div>
        `;
}
const sendEmail = async (options) => {
    try {
        // 1 create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const htmlContent = emailTemplateGenerator(
            options.message,
            "Verify Email", // shortMessage
            options.link // link
        );

        // 2 define email options
        const mailOptions = {
            from: "Aren Talb <aren.talb00@gmail.com>",
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
