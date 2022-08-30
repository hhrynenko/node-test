const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS,
        },
    },
    {
        from: 'sanekok2000@ukr.net',
    },
);

const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err);
        console.log(info);
    });
};

module.exports = mailer;
