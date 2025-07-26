const agenda = require('../Agenda/agendaInstance')
module.exports.Layout =async ( recipientEmail, emailSubject,recipientName, emailBody)=>{

    await agenda.now('send email', {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: emailSubject,
        html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f7f9fc; padding: 20px; border-radius: 8px; color: #1a202c;">
        <h2 style="color: #4c51bf;">Hello ${recipientName || ''},</h2>
        <p style="font-size: 16px; line-height: 1.6;">
        ${emailBody}
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
        
        <p style="font-size: 16px;">Warm regards,<br/><strong>Team Schedulo</strong></p>
        
        <div style="margin-top: 20px; text-align: center;">
        <span style="font-size: 14px; color: #718096;">&copy; <strong style="font-size: 16px;">Schedulo</strong> | All rights reserved</span>
        </div>
        </div>
        `
    });
}
module.exports.LayoutSchedule = async ( recipientEmail, emailSubject,recipientName, emailBody,date)=>{

    await agenda.schedule(date,'send email', {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: emailSubject,
        html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f7f9fc; padding: 20px; border-radius: 8px; color: #1a202c;">
        <h2 style="color: #4c51bf;">Hello ${recipientName || ''},</h2>
        <p style="font-size: 16px; line-height: 1.6;">
        ${emailBody}
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
        
        <p style="font-size: 16px;">Warm regards,<br/><strong>Team Schedulo</strong></p>
        
        <div style="margin-top: 20px; text-align: center;">
        <span style="font-size: 14px; color: #718096;">&copy; <strong style="font-size: 16px;">Schedulo</strong> | All rights reserved</span>
        </div>
        </div>
        `
    });
}
module.exports.LayoutTicket = async (
  recipientEmail,
  emailSubject,
  recipientName,
  event,
  user,
  downloadLink // either image or PDF route, based on their choice
) => {
  console.log(downloadLink)
  await agenda.now('send email', {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: emailSubject,
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #fffdfd; padding: 25px; border-radius: 10px; color: #1a202c;">
      <h2 style="color: #2b6cb0;">Hello ${recipientName || ''},</h2>
      <p style="font-size: 16px;">🎉 You’re all set for <strong>${event.title}</strong>!</p>

      <div style="margin-top: 20px; font-size: 15px; line-height: 1.6;">
        <p><strong>Event Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.venue}</p>
        <p><strong>Ticket Holder:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <p style="font-size: 16px;">🎫 Your ticket is attached and ready to download. Keep this for entry and backup purposes.</p>

      <div style="margin-top: 15px; text-align: center;">
        <a href="${downloadLink}" style="background-color: #4c51bf; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Download Ticket</a>
      </div>

      <div style="margin-top: 30px;">
        <p style="font-size: 14px; color: #718096;">Need help? Just reply to this email, and our team will assist you.</p>
        <p style="font-size: 16px;">Warm regards,<br/><strong>Team Schedulo</strong></p>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <span style="font-size: 14px; color: #a0aec0;">&copy; <strong>Schedulo</strong> | All rights reserved</span>
      </div>
    </div>
    `
  });
}
