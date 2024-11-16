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
          content:
            "You are a web design expert that generates CSS styles in JSON format. Return only valid JSON with no markdown formatting, no code blocks, and no backticks.",
        },
        {
          role: "user",
          content: `Create a unique, creative style following this exact structure:

{
  "text": {
    "title": "Create a memorable, creative title (1-2 words)",
    "shortDescription": "2-7 word evocative description",
    "buttonText": "Engaging call to action (1-3 words)"
  },
  "info": {
    "name": "Descriptive name of the Design-Style",
    "fontnames": "1-2 Specific Google Fonts that match the style",
    "colorScheme": "Color palette description",
    "style": "three specific style adjectives",
    "features": "Key visual effects and animations"
  },
  "tags": ["Include 7 relevant design tags that are specific to the style. The first tag must the name of the style. Dont include generic tags such as web-design"],
  "css": "Create a self-contained CSS style following these strict rules:

1. Class Naming:
   - Use lowercase kebab-case for ALL class names (example: .cyber-punk)
   - Main container class must match the lowercase name
   - All selectors must use the exact same class name

2. Selector Structure:
   - Container: .style-name { }
   - Elements: .style-name h1 { }, .style-name p { }, .style-name button { }
   - Hover: .style-name button:hover { }
   - Animations: @keyframes style-name-animation { }

3. Style Guidelines:
   - Background and base styles in container
   - Direct child selectors for elements
   - One hover effect for button
   - Optional: one keyframe animation

4. Format:
   - No empty lines between rules
   - No spaces before opening braces
   - One space after colons
   - Semicolon after each property

Example format:
.style-name{background:linear-gradient(...)}.style-name h1{color:#fff}.style-name p{color:#000}.style-name button{background:#fff}.style-name button:hover{transform:scale(1.1)}@keyframes style-name-animation{0%{opacity:0}100%{opacity:1}}

IMPORTANT: Always use the exact same lowercase kebab-case class name throughout the entire CSS."
}

IMPORTANT:
1. Never use standalone element selectors (h1, p, button)
2. Always prefix classes and animations with the style name (i.e. style-name h1)
3. Keep styles contained within the main component class
4. Avoid position: fixed or absolute positioning
5. Limit special effects to maintain performance
6. Avoid any spacing, margins, and padding.
7. Choose tasteful font-Combinations.
8. Ensure sufficient contrast between backgground and text-elements.

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
