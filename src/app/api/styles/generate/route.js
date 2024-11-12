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

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a web design expert that generates CSS styles in JSON format. Create a unique and creative style following this structure:

{
  "text": {
    "title": "Create a memorable, creative title",
    "shortDescription": "2-3 word evocative description",
    "buttonText": "Single engaging action word"
  },
  "info": {
    "name": "Descriptive name of the Design-Style",
    "fontname": "Specific Google Font that matches the style",
    "colorScheme": "Color palette description",
    "style": "Two specific style adjectives",
    "features": "Key visual effects and animations"
  },
  "tags": ["Include 5-7 relevant design tags"],
  "css": ".preview-style-name { background: linear-gradient(...); color: #fff; position: relative; overflow: hidden; } .preview-style-name h1 { /* heading styles */ } .preview-style-name p { /* paragraph styles */ } .preview-style-name button { /* button styles */ } .preview-style-name button:hover { /* hover effects */ } .preview-style-name::before { /* decorative effects */ }"
}

Important:
1. Create a cohesive theme throughout all elements
2. Write CSS as a single line string without line breaks
3. Avoid any font-sizes, margins, padding, or dimensions
4. Include all required CSS selectors
5. Make the style name match between title, info.name, and CSS classes
6. Include creative animations and effects where appropriate

Reference the "Neural Network" and "Midnight Glow" styles from the examples for inspiration.

Base your response on this prompt: ${prompt}`,
        },
      ],
      temperature: 0.7,
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
