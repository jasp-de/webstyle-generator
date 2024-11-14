export const sanitizeSvgUrl = (url) => {
  // Check if it's a data URL
  if (url.startsWith("data:image/svg+xml")) {
    return url;
  }

  // Validate external URL
  try {
    new URL(url);
    return url;
  } catch {
    console.error("Invalid SVG URL:", url);
    return "";
  }
};

export const processCssWithSvg = (css) => {
  // Match url("...") patterns
  return css.replace(
    /url\((["'])(.*?)\1\)/g,
    (match, quote, url) => `url(${quote}${sanitizeSvgUrl(url)}${quote})`
  );
};
