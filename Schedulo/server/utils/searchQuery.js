const { GEMINI_API_FUNCTION } = require('../GeminiAPI')
const Event = require('../models/event')
async function getResponse(Query) {
    return await GEMINI_API_FUNCTION(Query)
}

const getList =async (Query) => {
    const queryObj = await getResponse(Query);
    console.log(queryObj);

    if (!queryObj.error) {
        // Build flexible date query
        let dateFilter = {};
        if (queryObj.startDate && queryObj.endDate) {
            dateFilter.date = {
                $gte: new Date(queryObj.startDate),
                $lte: new Date(queryObj.endDate)
            };
        } else if (queryObj.startDate) {
            dateFilter.date = { $gte: new Date(queryObj.startDate) };
        } else if (queryObj.endDate) {
            dateFilter.date = { $lte: new Date(queryObj.endDate) };
        }

        const mongoQuery = {
            ...(queryObj.title && { title: { $regex: queryObj.title, $options: 'i' } }),
            ...(queryObj.description && { description: { $regex: queryObj.description, $options: 'i' } }),
            ...(queryObj.venue && { venue: { $regex: queryObj.venue, $options: 'i' } }),
            ...(queryObj.enums?.length && { enums: { $in: queryObj.enums } }),
            ...dateFilter
        };

        const results = await Event.find(mongoQuery);
        return results;
    } else {
        return new customError(404, 'Bad Request!!');
    }
};
module.exports = getList