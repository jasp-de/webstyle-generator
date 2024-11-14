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
          content: `You are a web design expert that generates CSS styles in JSON format. Create a unique, creative and style. Follow this structure:

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

  "css": ".style-name { 
    background: #000; 
    color: #fff; 
    font-family: 'Font Name', sans-serif; 
    position: relative; 
    overflow: hidden; 
  } 
  
  .style-name::before { 
    content: ''; 
    position: absolute; 
    inset: 0; 
    z-index: 1;
    background-image: linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px; 
    animation: style-name-pattern 10s linear infinite; 
  } 
  
  .style-name h1, 
  .style-name p, 
  .style-name button { 
    position: relative;
    z-index: 2;
  }
  
  .style-name button { 
    background: transparent; 
    border: 1px solid currentColor; 
    transition: all 0.3s ease;
    cursor: pointer;
  } 
  
  .style-name button:hover { 
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255,255,255,0.2);
  }"
}

Important:
1. Create a cohesive theme throughout all elements
2. Write CSS as a single line string without line breaks
3. Include all required CSS selectors
4. Make the style name match between title, info.name, and CSS classes
5. For visual effects you can use:

   a) Background Pattern:
      - Solid Colors
      - Gradients
      - SVG Patterns 
      - SVG Images from the web
      - Solid color with (gradient) overlay effects

   b) Animation Layer:
      - Must be smooth and looping
      - Use ::before or ::after for overlays
      - Ensure start and end states match

    c) H1 Text effects
      - Text Gradient
      - Optional text effects
      - Optional glow effects

6. When using SVG patterns:
   - Ensure pattern tiles seamlessly
   - Use proper URL encoding
   - Keep viewBox proportional

7. Make sure the css classes are all in lowercase and replace any spaces with "-"
8. Make sure THE TEXT and BUTTON ELEMENTS are in the front layer!
9. Make sure every button has a hover animation!
10. Ensure proper contrast and readability of text and button!

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
