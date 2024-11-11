import mongoose from "mongoose";

const StyleSchema = new mongoose.Schema({
  text: {
    title: String,
    shortDescription: String,
    buttonText: String,
  },
  info: {
    name: String,
    fontname: String,
    colorScheme: String,
    style: String,
    features: String,
  },
  tags: [String],
  css: String,
});

export default mongoose.models.Style || mongoose.model("Style", StyleSchema);

/*

Style Model

text
- title
- shortDescription
- buttonText
info
- name
- fontname
- colors
- style
- features
---
---
- font
--family
-- weights
---
- css
-- frame
-- h1
-- p
-- button

*/
