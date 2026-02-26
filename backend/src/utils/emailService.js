import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendStatusUpdateEmail = async (studentEmail, trackingId, newStatus) => {
    try {
        const mailOptions = {
            from: `"ASTU Smart Complaint System" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: `Update on your Complaint #${trackingId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #1565c0;">ASTU Smart Complaint System</h2>
                    <p>Hello,</p>
                    <p>This is to inform you that the status of your complaint <strong>#${trackingId}</strong> has been updated to <strong>${newStatus.toUpperCase()}</strong>.</p>
                    <p>You can view more details by logging into your student portal.</p>
                    <br>
                    <p style="color: #757575; font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER !== 'your-email@gmail.com') {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('--- Email Simulation ---');
            console.log(`To: ${studentEmail}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log('Body:', mailOptions.html);
            console.log('------------------------');
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

export const sendRemarkEmail = async (studentEmail, trackingId) => {
    try {
        const mailOptions = {
            from: `"ASTU Smart Complaint System" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: `New Remark on your Complaint #${trackingId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #1565c0;">ASTU Smart Complaint System</h2>
                    <p>Hello,</p>
                    <p>A staff member has added a new remark to your complaint <strong>#${trackingId}</strong>.</p>
                    <p>Please check your student portal for details.</p>
                    <br>
                    <p style="color: #757575; font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER !== 'your-email@gmail.com') {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('--- Email Simulation: New Remark ---');
            console.log(`To: ${studentEmail}`);
            console.log('-----------------------------------');
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};
