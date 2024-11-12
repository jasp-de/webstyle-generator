import { OpenAI } from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

function validateAndFormatStyle(style) {
  if (!style.info || !style.info.name) {
    throw new Error("Generated style missing name");
  }

  const cssName = style.info.name.toLowerCase().replace(/\s+/g, "-");
  style.css = style.css.replace(
    /\.preview-[a-zA-Z0-9-]+\s*{/g,
    `.preview-${cssName} {`
  );

  return style;
}

export const runtime = "edge";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are a web design expert that generates CSS styles in JSON format. Create a unique and creative style following this structure:

{
  "text": {
    "title": "Create a memorable, creative title (1-2 words)",
    "shortDescription": "2-4 word evocative description",
    "buttonText": "Engaging call to action (1-2 words)"
  },
  "info": {
    "name": "Descriptive name of the Design-Style",
    "fontname": "Specific Google Font that matches the style",
    "colorScheme": "Color palette description",
    "style": "Two specific style adjectives",
    "features": "Key visual effects and animations"
  },
  "tags": ["Include 5-7 relevant design tags"],
  "css": ".style-name { background: linear-gradient(...); color: #fff; position: relative; overflow: hidden; } .style-name h1 { /* heading styles */ } .style-name p { /* paragraph styles */ } .style-name button { /* button styles */ } .style-name button:hover { /* hover effects */ } .style-name::before { /* decorative effects */ }"
}

Important:
1. Create a cohesive theme throughout all elements
2. Write CSS as a single line string without line breaks
3. Avoid any font-sizes, margins, padding, or dimensions
4. Include all required CSS selectors
5. Make the style name match between title, info.name, and CSS classes
6. Include creative animations and effects where appropriate
7. make sure very button has a hover animation!
8. make sure you define the keyframes for custom animations.
9. Make Sure the Style-name does not contain any special characters.
10. Make sure the css classes are all in lowercase and replace any spaces with "-"

Base your response on this prompt: ${prompt}`,
        },
      ],
    });

    console.log("OpenAI Response:", completion.choices[0].message.content);
    const generatedStyle = JSON.parse(completion.choices[0].message.content);
    const formattedStyle = validateAndFormatStyle(generatedStyle);

    return Response.json(formattedStyle);
  } catch (error) {
    console.error("Error details:", error);
    return Response.json(
      { error: "Failed to generate style" },
      { status: 500 }
    );
  }
}
