import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import { exec } from 'child_process';

// Constants
const ASSEMBLYAI_API_KEY = 'fb8ede8de7a848338d975c4dcf1bc885'; // Replace with your actual API token
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';

// Initialize Axios instance
const apiClient = axios.create({
  baseURL: ASSEMBLYAI_API_URL,
  headers: {
    Authorization: ASSEMBLYAI_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Function to upload a local file to the AssemblyAI API
async function uploadFile(filePath: string): Promise<string | null> {
  console.log(`Uploading file: ${filePath}`);

  try {
    const data = fs.readFileSync(filePath);
    const response = await apiClient.post('/upload', data, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return response.status === 200 ? response.data['upload_url'] : null;
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    return null;
  }
}

// Function to transcribe audio using AssemblyAI API
async function transcribeAudio(audioUrl: string): Promise<any> {
  console.log(`Transcribing audio at URL: ${audioUrl}`);

  try {
    const transcriptResponse = await apiClient.post('/transcript', {
      audio_url: audioUrl,
      speaker_labels: true,
    });

    const transcriptId = transcriptResponse.data.id;
    let transcriptStatus;

    do {
      console.log(`Polling transcript status for ID: ${transcriptId}`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      const statusResponse = await apiClient.get(`/transcript/${transcriptId}`);
      transcriptStatus = statusResponse.data.status;
      console.log(`Transcript status: ${transcriptStatus}`);
    } while (transcriptStatus !== 'completed' && transcriptStatus !== 'error');

    if (transcriptStatus === 'error') {
      throw new Error('Error transcribing audio');
    }

    return apiClient.get(`/transcript/${transcriptId}`);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

function splitDialogueText(text: string, maxLength: number, overlapIndicator: string = '|'): string[] {
  const words = text.split(/(\s+|\b)/); // Split by spaces and word boundaries, preserving punctuation
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    // Handle overlap indicators (e.g., |) by splitting immediately
    if (word === overlapIndicator) {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      return;
    }

    // Check if adding the word exceeds the max length
    if (currentLine.length + word.length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = '';
    }

    currentLine += word;

    // If word is a pause indicator, split here
    if (word.match(/[.,?!]/)) {
      lines.push(currentLine.trim());
      currentLine = '';
    }
  });

  // Add any remaining text as the last line
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}


function formatTime(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeInSeconds % 60).toFixed(3).replace('.', ',');
  return `${hours}:${minutes}:${seconds}`;
}

function formatToSRT(utterances: { start: number; end: number; speaker: string; text: string }[]): string {
  let srtContent = '';
  let counter = 1;
  

  for (const utterance of utterances) {
    const startTime = utterance.start / 1000; // Convert to seconds
    const endTime = utterance.end / 1000; // Convert to seconds
    const duration = endTime - startTime;

    // Split the text into segments based on maximum length
    const segments = splitDialogueText(utterance.text, 50); // Use 50 characters for each segment
    const segmentDuration = duration / segments.length;

    let currentStartTime = startTime;

    for (let i = 0; i < segments.length; i++) {
      const currentEndTime = currentStartTime + segmentDuration;

      // Adjust the segment end time to avoid overlap and ensure captions stay on screen
      const adjustedEndTime = Math.min(currentEndTime, endTime);

      srtContent += `${counter}\n${formatTime(currentStartTime)} --> ${formatTime(adjustedEndTime)}\n${segments[i]}\n\n`;
      counter++;

      currentStartTime = adjustedEndTime; // Move to the next segment time
    }
  }

  return srtContent;
}





// Function to format milliseconds to SRT time format
// function formatTime(milliseconds: number): string {
//   const date = new Date(milliseconds);
//   const hours = String(date.getUTCHours()).padStart(2, '0');
//   const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//   const seconds = String(date.getUTCSeconds()).padStart(2, '0');
//   const millisecondsFormatted = String(date.getUTCMilliseconds()).padStart(3, '0');
//   return `${hours}:${minutes}:${seconds},${millisecondsFormatted}`;
// }

async function generateCaptions(
  audioBuffer: Buffer,
  fontSize: string,
  fontColor: string,
  fontStyle: string,
  fontWeight: boolean,
  fontItalic: boolean,
  fontUnderline: boolean,
  fontStrikeOut: boolean,
  spacing: number,
  angle: number,
  borderStyle: string,
  outline: string,
  shadow: string,
  alignment: string,
  shadowToogle: string,
  outlineToogle: string
): Promise<{ srtFilePath: string; assFilePath: string }> {

  const uploadsDir = path.join('public', 'uploads');
  const processedDir = path.join(uploadsDir, 'processed');
  const audioFilePath = path.join(uploadsDir, 'audio.wav');
  const processedAudioFilePath = path.join(processedDir, 'processed_audio.wav');
  const srtFilePath = path.join(processedDir, 'captions.srt');
  const assFilePath = path.join(processedDir, 'captions.ass');

  const normalizePath = (p: string) => p.replace(/\\/g, '/');

  const normalizedUploadsDir = normalizePath(uploadsDir);
  const normalizedProcessedDir = normalizePath(processedDir);
  const normalizedAudioFilePath = normalizePath(audioFilePath);
  const normalizedProcessedAudioFilePath = normalizePath(processedAudioFilePath);
  const normalizedSrtFilePath = normalizePath(srtFilePath);
  const normalizedAssFilePath = normalizePath(assFilePath);

  console.log('Generating captions...');
  console.log('Audio buffer received. Processing...');

  try {
    // Ensure directories exist
    if (!fs.existsSync(normalizedUploadsDir)) {
      fs.mkdirSync(normalizedUploadsDir, { recursive: true });
    }
    if (!fs.existsSync(normalizedProcessedDir)) {
      fs.mkdirSync(normalizedProcessedDir, { recursive: true });
    }

    // Save the audio buffer to a file
    fs.writeFileSync(normalizedAudioFilePath, audioBuffer);
    console.log(`Audio file saved at: ${normalizedAudioFilePath}`);

    // Process the audio file
    console.log('Processing audio file...');
    await new Promise<void>((resolve, reject) => {
      ffmpeg(normalizedAudioFilePath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .audioFilters('aformat=sample_fmts=s16:sample_rates=16000')
        .save(normalizedProcessedAudioFilePath)
        .on('end', () => {
          console.log(`Processed audio file saved at: ${normalizedProcessedAudioFilePath}`);
          resolve();
        })
        .on('error', (err: any) => {
          console.error('Error processing audio file:', err);
          reject(err);
        });
    });

    // Upload the processed audio file
    const audioUrl = await uploadFile(normalizedProcessedAudioFilePath);
    if (!audioUrl) {
      throw new Error('Failed to upload audio file');
    }
    console.log('Audio uploaded successfully. URL:', audioUrl);

    // Transcribe the uploaded audio
    const transcriptData = await transcribeAudio(audioUrl);

    

    // Extract the spoken text without any reference to the speaker
    const cleanedTranscript = transcriptData.data.utterances.map((utterance: any) => ({
      start: utterance.start,
      end: utterance.end,
      text: utterance.text,  // Retain only the spoken text
    }));

    // Save the SRT file
    fs.writeFileSync(normalizedSrtFilePath, formatToSRT(cleanedTranscript));
    console.log(`SRT file saved at: ${normalizedSrtFilePath}`);


    // Convert the SRT file to ASS format
    await new Promise<void>((resolve, reject) => {
      ffmpeg(normalizedSrtFilePath)
        .output(normalizedAssFilePath)
        .on('end', () => {
          console.log(`ASS file saved at: ${normalizedAssFilePath}`);
          resolve();
        })
        .on('error', (err: any) => {
          console.error('Error converting SRT to ASS:', err);
          reject(err);
        })
        .run();
    });

    // Add custom styling to the ASS file
    addStylingToAssFile(normalizedAssFilePath, fontSize, fontColor,
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
      outlineToogle);

    return { srtFilePath: normalizedSrtFilePath, assFilePath: normalizedAssFilePath };
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}



function hexToAssColor(hex: string): string {
  const color = hex.replace('#', '');
  const bgrColor = color.length === 6 ? color.match(/.{2}/g)!.reverse().join('') : '';
  return `&H00${bgrColor}`;
}

// Modify existing ASS file with custom styling
function addStylingToAssFile(
  assFilePath: string,
  fontSize: string,
  fontColor: string,
  fontStyle: string,
  fontWeight: boolean,
  fontItalic: boolean,
  fontUnderline: boolean,
  fontStrikeOut: boolean,
  spacing: number,
  angle: number,
  borderStyle: string,
  outline: string,
  shadow: string,
  alignment: string,
  shadowToogle: string,
  outlineToogle: string
): void {
  // Read the existing ASS file content
  let fileContent = fs.readFileSync(assFilePath, 'utf8');

  // Log the original file content
  console.log('Original ASS file content:');
  console.log(fileContent);

  // Define the style string to replace
  const styleLine = `Style: Default,Arial,${fontSize},${hexToAssColor(fontColor)},&H0,${hexToAssColor(outline)},${hexToAssColor(shadow)},${fontWeight ? 1 : 0},${fontItalic ? 1 : 0},${fontUnderline ? 1 : 0},${fontStrikeOut ? 1 : 0},100,100,0,0,${borderStyle === 'None' ? 1 : 3},${outlineToogle},${shadowToogle},2,10,10,10,1`;

  // Find the style section
  const styleSectionRegex = /(\[V4\+ Styles\][\s\S]*?)(\[.*?\])/;
  const match = fileContent.match(styleSectionRegex);

  if (match) {
    // Replace the style section with the new style
    const updatedContent = fileContent.replace(match[1], `${match[1]}${styleLine}\n`);

    // Log the updated file content
    console.log('Updated ASS file content:');
    console.log(updatedContent);

    // Write the updated content back to the file
    fs.writeFileSync(assFilePath, updatedContent, 'utf8');
  } else {
    throw new Error('Style section not found in the ASS file.');
  }
}



export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Handling POST request');
  try {
    const formData = await req.formData();
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

    console.log(`shadowToogle value ..............: ${shadowToogle}`);

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

    if (!videoFile) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
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
      outlineToogle
    );

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const originalVideoPath = path.join(uploadsDir, 'original_video.mp4');
    const captionedVideoPath = path.join(uploadsDir, 'captioned_video.mp4');

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
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'An error occurred while processing the video' }, { status: 500 });
  }
}
