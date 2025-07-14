const nodemailer = require('nodemailer');
const customError = require('../customError')
// Create transporter with Gmail service
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD // NOT your Gmail password
  }
});

transporter.verify((error, success) => {
  if (error) console.error("Mail transporter issue:", error);
});
// Send the email
module.exports = async (mailOptions) => {
  try {
    let response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    throw new customError(400, 'Error! Mail could not be sent!');
  }
};
