import nodemailer from "nodemailer"
import transporter from "../config/transporter.config.js"
import config from "../config/index.js"

const mailHelper = async (option) => {
    const message = {
        from: config.SMTP_SENDER_EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transporter.sendMail(message)
}

export default mailHelper