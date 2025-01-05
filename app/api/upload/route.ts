// handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '@/components/captionGenerator';
import { exec } from 'child_process';
import fs from 'fs';


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    console.log('Handling POST request');
      const videoFile = formData.get('video') as File;
      const fontSize = formData.get('fontSize') as string;
      const fontColor = formData.get('fontColor') as string;
      const fontStyle = formData.get('fontStyle') as string;
      const fontWeight = formData.get('fontWeight') === 'true';
      const fontItalic = formData.get('fontItalic') === 'true';
      const fontUnderline = formData.get('fontUnderline') === 'true';
      const fontStrikeOut = formData.get('fontStrikeOut') === 'true';
      const spacing = parseFloat(formData.get('spacing') as string);
      const angle = parseFloat(formData.get('angle') as string);
      const borderStyle = formData.get('borderStyle') as string;
      const outline = formData.get('outline') as string;
      const shadow = formData.get('shadow') as string;
      const shadowToogle = formData.get('shadowToogle') as string;
      const outlineToogle = formData.get('outlineToogle') as string;
      const alignment = formData.get('alignment') as string;
      const neonEffect = formData.get('neonEffect') as string;

      console.log(`shadowToogle value ..............: ${shadowToogle}`);
      console.log(`outlineToogle value ..............: ${outlineToogle}`);

      console.log(`borderStyle value ..............: ${borderStyle}`);

      if (shadowToogle === "0") {

      }

      console.log(`fontSize: ${fontSize}`);
      console.log(`fontColor: ${fontColor}`);
      console.log(`fontStyle: ${fontStyle}`);
      console.log(`fontWeight: ${fontWeight}`);
      console.log(`fontItalic: ${fontItalic}`);
      console.log(`fontUnderline: ${fontUnderline}`);
      console.log(`fontStrikeOut: ${fontStrikeOut}`);
      console.log(`spacing: ${spacing}`);
      console.log(`angle: ${angle}`);
      console.log(`borderStyle: ${borderStyle}`);
      console.log(`outline: ${outline}`);
      console.log(`shadow: ${shadow}`);
      console.log(`alignment: ${alignment}`);

      // Log the retrieved data
      console.log('Video File:', videoFile);
      console.log('Font Size:', fontSize);
      console.log('Font Color:', fontColor);;

      const buffer = Buffer.from(await videoFile.arrayBuffer());

      const uploadsDir = 'public/uploads';
      const originalVideoPath = `${uploadsDir}/original_video.mp4`;
      const captionedVideoPath = `${uploadsDir}/captioned_video.mp4`;

      if (!videoFile) {
        console.log('No file uploaded');
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      console.log('File buffer received. Generating captions...');
      const { assFilePath } = await generateCaptions(buffer, fontSize, fontColor,
        fontStyle,
        fontWeight,
        fontItalic,
        fontUnderline,
        fontStrikeOut,
        spacing,
        angle,
        borderStyle,
        outline,
        shadow,
        alignment,
        shadowToogle,
        outlineToogle,neonEffect
      );

      // Clear existing files
      if (fs.existsSync(originalVideoPath)) {
        fs.unlinkSync(originalVideoPath);
      }

      if (fs.existsSync(captionedVideoPath)) {
        fs.unlinkSync(captionedVideoPath);
      }

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(originalVideoPath, buffer);
      console.log(`Video file saved at: ${originalVideoPath}`);

      await new Promise<void>((resolve, reject) => {
        const command = `ffmpeg -i "${originalVideoPath}" -vf ass="${assFilePath}" "${captionedVideoPath}"`;

        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            reject(error);
          } else {
            console.log('FFmpeg command executed successfully');
            resolve();
          }
        });
      });

      // Return the path to the captioned video
      const captionedVideoUrl = `/uploads/captioned_video.mp4`;

      return NextResponse.json({
        message: 'Video processed and captions added successfully!',
        downloadLink: captionedVideoUrl,
      });
      
    } catch (error) {
      return NextResponse.json({ error: 'An error occurred while processing the video' }, { status: 500 });
    }
  }
