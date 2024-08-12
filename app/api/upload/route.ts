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

// Function to format transcript data to SRT format
function formatToSRT(utterances: { start: number; end: number; speaker: string; text: string }[]): string {
  console.log('Formatting transcript data to SRT format');
  let srtContent = '';
  let counter = 1;

  for (const utterance of utterances) {
    const startTime = formatTime(utterance.start);
    const endTime = formatTime(utterance.end);

    srtContent += `${counter}\n${startTime} --> ${endTime}\nSpeaker ${utterance.speaker}: ${utterance.text}\n\n`;
    counter++;
  }

  return srtContent;
}

// Function to format milliseconds to SRT time format
function formatTime(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const millisecondsFormatted = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds},${millisecondsFormatted}`;
}

// Function to generate captions and convert SRT to ASS
async function generateCaptions(audioBuffer: Buffer): Promise<{ srtFilePath: string; assFilePath: string }> {
  
  const uploadsDir = path.join('public', 'uploads');
  const processedDir = path.join(uploadsDir, 'processed');
  const audioFilePath = path.join(uploadsDir, 'audio.wav');
  const processedAudioFilePath = path.join(processedDir, 'processed_audio.wav');
  const srtFilePath = path.join(processedDir, 'captions.srt');
  const assFilePath = path.join(processedDir, 'captions.ass');

  // Replace backslashes with forward slashes
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

    // Save the SRT file
    fs.writeFileSync(normalizedSrtFilePath, formatToSRT(transcriptData.data.utterances));
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

    return { srtFilePath: normalizedSrtFilePath, assFilePath: normalizedAssFilePath };
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Handling POST request');
  try {
    const formData = await req.formData();
    const videoFile = formData.get('video') as File;

    if (!videoFile) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    console.log('File buffer received. Generating captions...');
    const { assFilePath } = await generateCaptions(buffer);

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
