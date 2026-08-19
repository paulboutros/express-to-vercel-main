 
const sharp = require("sharp");

const fs = require("fs");
const path = require("path");
 
const fontPath = path.join(
     __dirname,  
    // "../fonts/DejaVuSansMono-Bold.ttf"
    "../fonts/LiberationSans-Bold.ttf"
);
  
const fontBase64 = fs.readFileSync(fontPath).toString("base64");



function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Default single-line SVG text renderer
 * Receives already-computed layout values from createTextBuffer()
 */
function renderSingleLineSvg({
  text,
  safeText,
  width,
  height,
  x,
  y,
  anchor,
  style
}) {
  return `
 
<text
    x="${x}"
    y="${y}"
    text-anchor="${anchor}"
    font-family="${style.fontFamily}"
    font-size="${style.fontSize}"
    font-weight="${style.fontWeight}"
    fill="${style.color}">
    ${safeText}
</text>`;
}

/**
 * Generic text buffer creator
 * Keeps your layout logic, but lets you swap the SVG text renderer
 */
async function createTextBuffer(
  text,
  width,
  height,
  canvasWidth,
  canvasHeight,
  style = {},
  svgRenderer = renderSingleLineSvg
) {
  style = {
    position: "absolute",
    justify: "center", // left | center | right
    align: "middle",   // top | middle | bottom

    fontFamily:  "WuliFont",// "sans-serif",// "Arial",
    fontSize: 32,//64,
    fontWeight: "bold",
    color: "#000000",

    marginX: 0,
    marginY: 0,

    ...style
  };

  //-------------------------
  // Horizontal text anchor
  //-------------------------



  // console.log(  "canvasWidth" , canvasWidth    ,  "  canvasHeight   "  , canvasHeight )
  let x;
  let anchor;

  switch (style.justify) {
    case "left":
      x = style.marginX;
      anchor = "start";
      break;

    case "right":
      x = width - style.marginX;
      anchor = "end";
      break;

    default:
      x = width / 2;
      anchor = "middle";
  }

  //-------------------------
  // Vertical text baseline
  //-------------------------

  let y;

  switch (style.align) {
    case "top":
      y = style.fontSize + style.marginY;
      break;

    case "bottom":
      y = height - style.marginY;
      break;

    default:
      y = (height + style.fontSize) / 2;
  }

  //-------------------------
  // Composite placement
  //-------------------------

  let left = 0;
  let top = 0;

  if (style.position === "absolute") {
    // NOTE:
    // canvasWidth / canvasHeight must exist in your current scope,
    // since your original function already relied on them.
    switch (style.justify) {
      case "left":
        left = 0 + style.marginX;
        break;

      case "center":
        left = (canvasWidth - width) / 2;
        break;

      case "right":
        left = canvasWidth - width - style.marginX;
        break;
    }

    switch (style.align) {
      case "top":
        top = 0 + style.marginY;
        break;

      case "middle":
        top = (canvasHeight - height) / 2;
        break;

      case "bottom":
        top = canvasHeight - height - style.marginY;
        break;
    }
  }

  const safeText = escapeXml(text);

  // renderer returns the INNER SVG CONTENT ONLY
  const innerSvg = svgRenderer({
    text,
    safeText,
    width,
    height,
    x,
    y,
    anchor,
    style
  });

  /*
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width}"
     height="${height}">
  ${innerSvg}
</svg>`;*/
const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width}"
     height="${height}">

  <style>
    @font-face {
      font-family: "WuliFont";
       src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
    }
  </style>

  ${innerSvg}

</svg>`;





  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return {
    input: buffer,
    left,
    top
  };
}


function renderMultilineSvg({
  text,
  width,
  height,
  x,
  y,
  anchor,
  style
}) {
  const lines = Array.isArray(text) ? text : String(text).split("\n");
  const lineHeight = style.lineHeight || "1.2em";

  const tspans = lines
    .map((line, index) => {
      const safeLine = escapeXml(line);
      const dy = index === 0 ? 0 : lineHeight;
      return `<tspan x="${x}" dy="${dy}">${safeLine}</tspan>`;
    })
    .join("");

  return `
<text
    x="${x}"
    y="${y}"
    text-anchor="${anchor}"
    font-family="${style.fontFamily}"
    font-size="${style.fontSize}"
    font-weight="${style.fontWeight}"
    fill="${style.color}">
    ${tspans}
</text>`;
}



module.exports = {
  createTextBuffer,
  renderSingleLineSvg,
  renderMultilineSvg
};
 
