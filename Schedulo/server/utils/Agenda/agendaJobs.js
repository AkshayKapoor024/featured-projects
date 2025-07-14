const customError = require('../customError');
const agenda = require('./agendaInstance');
const sendEmail = require('./nodemailerSetup'); // your nodemailer logic

module.exports = () => {
  agenda.define('send email', async (job) => {
    const mailOptions = job.attrs.data;
    try {
      let response = await sendEmail(mailOptions);
    } catch (err) {
      throw new customError(400, "Email Could not be sent !!");
    }

  });
};
