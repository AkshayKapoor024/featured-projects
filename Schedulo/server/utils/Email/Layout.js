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