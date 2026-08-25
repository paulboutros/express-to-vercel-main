
/*

const sharp = require("sharp");

const path = require("path");

process.env.FONTCONFIG_FILE = path.join(
    __dirname,
    "fontconfig",
    "fonts.conf"
);


const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="1000"
     height="200">

  <text
      x="20"
      y="120"
      font-family="Wingdings"
      font-size="80"
      font-weight="bold">
      WULIROCKS 123
  </text>

</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile("wuliEngine/fonts/font-test.png")
  .then(() => console.log("done"))
  .catch(console.error);

 */