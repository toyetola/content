const nodemailer = require("nodemailer")
const serviceAuth = require("../config/email.config")
const viewSetUp = require('../../public/views/EmailConfirmation')


const emailSetUp = async (rootUrl, receivers, user, confirmationcode) => {
    try {
        let transporter = await nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: serviceAuth.user, // generated ethereal user
              pass: serviceAuth.pass, // generated ethereal password
            },
        });
    
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Rhema Care" <foo@rhemacare.com>', // sender address
            to: receivers, // list of receivers
            subject: "Welcome To Rhema Care - Confirm your email ✔", // Subject line
            // text: "Hello world?", // plain text body
            // html: "<b>Hello world?</b>", // html body
            // html: await viewSetUp(req, user, confirmationcode)
            html: viewSetUp(rootUrl, user, confirmationcode)
        });
    
        console.log("Message sent: %s", info.messageId);
        
        
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = emailSetUp