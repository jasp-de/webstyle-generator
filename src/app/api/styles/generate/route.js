import { OpenAI } from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

function validateAndFormatStyle(style) {
  if (!style.info || !style.info.name) {
    throw new Error("Generated style missing name");
  }

  const cssName = style.info.name.toLowerCase().replace(/\s+/g, "-");
  style.css = style.css
    .replace(/\.[\w-]+\s*{/g, `.${cssName} {`)
    .replace(/\.[\w-]+::/g, `.${cssName}::`);

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
    "shortDescription": "2-7 word evocative description",
    "buttonText": "Engaging call to action (1-3 words)"
  },
  "info": {
    "name": "Descriptive name of the Design-Style",
    "fontname": "Specific Google Font that matches the style",
    "colorScheme": "Color palette description",
    "style": "three specific style adjectives",
    "features": "Key visual effects and animations"
  },
  "tags": ["Include 5-7 relevant design tags that are specific to the style - no generic tags such as web-design or "],
  "css": ".style-name { background: #000; color: #fff; font-family: 'Font Name', sans-serif; position: relative; overflow: hidden; } .style-name::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; animation: style-name-pattern 10s linear infinite; } .style-name button { background: transparent; border: 1px solid currentColor; transition: all 0.3s; } .style-name button:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); } @keyframes style-name-pattern { 0% { background-position: 0 0; } 100% { background-position: 20px 20px; } }"
}

Important:
1. Create a cohesive theme throughout all elements
2. Write CSS as a single line string without line breaks
3. Avoid any font-sizes, margins, padding, or dimensions
4. Include all required CSS selectors
5. Make the style name match between title, info.name, and CSS classes
6. For visual effects, implement at least TWO of these:
   a) Background Pattern (choose one):
      - Gradient: background: linear-gradient(...)
      - SVG Pattern: background-image: url("data:image/svg+xml,...")
      - CSS Pattern: background-image: repeating-linear-gradient(...)

   b) Animation Layer (using ::before or ::after):
      - Position it with: content: ''; position: absolute; inset: 0;
      - Add animation: animation: [style-name]-effect 5s infinite;
      - Define keyframes for the animation

   c) Interactive Elements:
      - Button hover effects
      - Text glow effects
      - Transform animations

7. When using SVG patterns:
   - Use geometric shapes: circles, waves, lines, dots
   - Keep paths simple and minimal
   - Encode colors as %23 instead of #
   - Test pattern with: background-size: cover;

8. When creating animations:
   - Name format: [style-name]-[effect-name]
   - Use simple transforms: translate, scale, rotate
   - Keep durations between 2-10 seconds
   - Ensure smooth loops with matching start/end states
9. Make Sure the Style-name does not contain any special characters
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
