module.exports.GEMINI_API_FUNCTION = async (Query) => {
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `I am building an event search feature for a website. Users can type free-form text queries into a search bar, and I want to understand their intent to help them find the most relevant events.

Break down the query and extract keywords or phrases under the following 4 categories:
1. title – words referring to the name or type of event
2. description – thematic content or things mentioned inside the event
3. venue – cities, regions, venues
4. enums – any descriptors like music genres, tech, sports, etc.
5. startDate - any time mentioned in this format (Sat Jul 27 2025) when user mentions specific start date
6. endDate - same as startDate but when user mentions an end date explicitly
If the query is not relevant to event search — for example, asking for food recipes or unrelated advice — return only this:
{ "error": "Query not related to events or event search." }

If any title ,description , venue, startDate and endDate fields are empty use '' in value and for enums use empty objects [] structure in json object you send
Only include these keys in the object — no formatting, markdown, or extra explanation. Dont put event title under quotes 
If you think someone is mentioning an events name / title dont add it in enums and this remains same for all the fields , until you are damn sure about the intent dont add unnecessary things to clutter up . 
HERE IS MY QUERY: ${Query}`
        });

        // Extract and parse the response
        const rawText = response.text.trim();
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        
        const parsed = JSON.parse(cleaned);
        
        return parsed;
    } catch (err) {
        console.error("Failed to parse Gemini response:", err.message);
        return { error: "Gemini response could not be parsed." };
    }
};