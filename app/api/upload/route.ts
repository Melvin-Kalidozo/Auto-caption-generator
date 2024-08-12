import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer"; // Import Buffer to convert Uint8Array

export const config = {
  api: {
    bodyParser: false, // Disable body parsing
  },
};

export async function POST(req: NextRequest) {
  const chunks: Buffer[] = [];

  const reader = req.body?.getReader();
  if (!reader) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  let result;
  while (!(result = await reader.read()).done) {
    const chunk = Buffer.from(result.value); // Convert Uint8Array to Buffer
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const videoPath = path.join(process.cwd(), "public/uploads");
  const filename = `video_${Date.now()}.mp4`;

  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath, { recursive: true });
  }

  fs.writeFileSync(path.join(videoPath, filename), buffer);

  return NextResponse.json({ message: "Video uploaded successfully", filename });
}
