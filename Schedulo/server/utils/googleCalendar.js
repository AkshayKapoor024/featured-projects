const { google } = require('googleapis');


const createCalendarEvent = async (accessToken, eventData) => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    if (!eventData.startTime || !eventData.endTime) {
        console.warn('⚠️ Missing dateTime values:', eventData);
    }
    const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
            dateTime: eventData.startTime, // ISO string
            timeZone: 'Asia/Kolkata'
        },
        end: {
            dateTime: eventData.endTime, // ISO string
            timeZone: 'Asia/Kolkata'
        }
    };
console.log('📤 Final event payload:', JSON.stringify(event, null, 2));
    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return response.data;
};
module.exports = createCalendarEvent
