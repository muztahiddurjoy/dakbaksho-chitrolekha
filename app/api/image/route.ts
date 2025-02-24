import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs";

export const GET = async () => {
  const imagePath = path.join(process.cwd(), "public", "bg.jpeg");
  const outputImagePath = path.join(process.cwd(), "public", "output.jpg");
  const text =
    "যেহেতু মানব অধিকারের প্রতি অবজ্ঞা এবং ঘৃণার ফলে মানুবের বিবেক লাঞ্ছিত বোধ করে এমন সব বর্বরোচিত ";

  const imageBuffer = fs.readFileSync(imagePath);

  const words = text.split(" ");
  let formattedText = "";
  let line = "";

  words.forEach((word) => {
    if ((line + word).length <= 40) {
      line += `${word} `;
    } else {
      formattedText += `<tspan x="50%" dy="1.2em">${line.trim()}</tspan>`;
      line = `${word} `;
    }
  });
  formattedText += `<tspan x="50%" dy="1.2em">${line.trim()}</tspan>`;

  await sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(
          `<svg width="1600" height="800">
                <style>
                    @font-face {
                        font-family: 'Priyo';
                        src: url('${path.join(
                          process.cwd(),
                          "public",
                          "fonts",
                          "Priyo.ttf"
                        )}') format('truetype');
                    }
                    @font-face {
                        font-family: 'Baloo';
                        src: url('${path.join(
                          process.cwd(),
                          "public",
                          "fonts",
                          "Balooda.ttf"
                        )}') format('truetype');
                    }
                    #title {
                        font-family: 'Priyo';
                        font-weight: bold;
                    }
                    text{
                    font-family: 'Balooda';
                    }
                </style>
                <text x="50%" id="title" y="10%" font-size="80" fill="#A72120" text-anchor="middle" dominant-baseline="middle">
                    ${formattedText}
                </text>
                <text x="50%" y="70%" font-size="60" fill="#000000" text-anchor="middle" dominant-baseline="middle">
                    Muztahidul Islam
                </text>
            </svg>`
        ),
        gravity: "center",
      },
    ])
    .toFile(outputImagePath);

  return new NextResponse(
    JSON.stringify({ url: process.env.NEXT_PUBLIC_URL + "/public/output.jpg" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};