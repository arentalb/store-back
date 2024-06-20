import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const emailTemplateGenerator = (type, message, link) => {
    const baseStyle = `
        font-family: 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #f9f9f9;
    `;
    const headerStyle = `
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #007BFF;
    `;
    const messageStyle = `
        font-size: 18px;
        margin: 20px 0;
    `;
    const footerStyle = `
        font-size: 14px;
        color: #777;
        text-align: center;
        margin-top: 40px;
        border-top: 1px solid #e0e0e0;
        padding-top: 20px;
    `;
    const buttonStyle = `
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        color: #fff;
        background-color: #007BFF;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
    `;
    const linkStyle = `
        color: #007BFF;
        text-decoration: none;
    `;

    switch (type) {
        case 'resetPassword':
            return `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">Reset Your Password</div>
                    <p style="${messageStyle}">${message}</p>
                    <p><a href="${link}" style="${buttonStyle}">Reset Password</a></p>
                    <div style="${footerStyle}">
                        If you did not request a password reset, please ignore this email or contact support if you have questions.
                        <br>
                        <a href="https://arentalb.com/" style="${linkStyle}">Contact Support</a>
                    </div>
                </div>
            `;
        case 'orderSuccess':
            return `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">Order Confirmation</div>
                    <p style="${messageStyle}">${message}</p>
                    <p style="${messageStyle}">Order Details: <a href="${link}" style="${buttonStyle}">View Order</a></p>
                    <div style="${footerStyle}">
                        Thank you for shopping with us! If you have any questions about your order, please visit our
                        <a href="https://arentalb.com/" style="${linkStyle}">Support Center</a>.
                    </div>
                </div>
            `;
        case 'verifyEmail':
            return `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">Verify Your Email Address</div>
                    <p style="${messageStyle}">${message}</p>
                    <p><a href="${link}" style="${buttonStyle}">Verify Email</a></p>
                    <div style="${footerStyle}">
                        If you did not create an account using this email address, please ignore this email or contact support.
                        <br>
                        <a href="https://arentalb.com/" style="${linkStyle}">Contact Support</a>
                    </div>
                </div>
            `;
        default:
            return `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">Notification</div>
                    <p style="${messageStyle}">${message}</p>
                    <div style="${footerStyle}">
                        For more information, visit our
                        <a href="https://arentalb.com/" style="${linkStyle}">website</a> or contact support.
                    </div>
                </div>
            `;
    }
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
            options.type, // Type of email (e.g., 'resetPassword', 'orderSuccess', 'verifyEmail')
            options.message, // Main message body
            options.link // URL link
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
    } catch (error) {
    }
};

export default sendEmail;
