import { OpenAI } from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a web design expert that generates CSS styles in JSON format. Generate styles that match this exact schema:
          {
            "text": {
              "title": String,
              "shortDescription": String,
              "buttonText": String
            },
            "info": {
              "name": String,
              "fontname": String,
              "colorScheme": String,
              "style": String,
              "features": String
            },
            "tags": [String],
            "css": String
          }`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const generatedStyle = JSON.parse(completion.choices[0].message.content);
    return Response.json(generatedStyle);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return Response.json(
      { error: "Failed to generate style" },
      { status: 500 }
    );
  }
}
