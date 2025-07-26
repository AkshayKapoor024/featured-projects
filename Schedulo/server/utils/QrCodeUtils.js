const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
module.exports.renderImage=async(htmlContent)=> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  const imageBuffer = await page.screenshot({ type: 'jpeg' });

  await browser.close();
  return imageBuffer;
}
module.exports.renderPDF = async(htmlContent)=> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdfBuffer;
}

module.exports.generateTicketHTML =async( user, event, ticketId )=>{
  const payload = JSON.stringify({ ticketId, eventId: event._id, userEmail: user.email });
  const qrDataURL = await QRCode.toDataURL(payload); // Inline QR code

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Schedulo Ticket</title>
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background: #f5f5f5;
          margin: 0;
          padding: 30px;
        }
        .ticket-container {
          background: #ffffff;
          border: 2px dashed #4f46e5;
          padding: 30px;
          width: 600px;
          margin: auto;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .ticket-header {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 10px;
        }
        .ticket-details {
          font-size: 16px;
          color: #333333;
          margin-bottom: 20px;
        }
        .qr-code img {
          margin-top: 20px;
        }
        .ticket-id {
          font-size: 14px;
          margin-top: 10px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket-header">${event.title}</div>
        <div class="ticket-details">
          <div><strong>Venue:</strong> ${event.venue}</div>
          <div><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</div>
          <div><strong>Registered To:</strong> ${user.username} (${user.email})</div>
        </div>
        <div class="qr-code">
          <img src="${qrDataURL}" alt="QR Code" width="160" height="160" />
        </div>
        <div class="ticket-id">Ticket ID: ${ticketId}</div>
      </div>
    </body>
    </html>
  `;
}