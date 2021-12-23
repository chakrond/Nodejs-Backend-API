const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcEmail = (email, name) => {
    sgMail
        .send({

            to: email,
            from: 'godlooter@gmail.com',
            subject: 'Thanks for joining in',
            text: `Welcome! ${name}. Let me know what are you up to`


        })
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendCancleEmail = (email, name) => {
    sgMail
        .send({

            to: email,
            from: 'godlooter@gmail.com',
            subject: 'Account Cancellation',
            text: `I am sorry that I need to close your account ${name}.`


        })
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = {
    sendWelcEmail,
    sendCancleEmail
}