import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

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

async function generateCaptions(audioBuffer: Buffer): Promise<string> {
  const uploadsDir = path.join('public', 'uploads');
  const processedDir = path.join(uploadsDir, 'processed');
  const audioFilePath = path.join(uploadsDir, 'audio.wav');
  const processedAudioFilePath = path.join(processedDir, 'processed_audio.wav');
  const srtFilePath = path.join(processedDir, 'captions.srt');

  console.log('Generating captions...');
  console.log('Audio buffer received. Processing...');

  try {
    // Ensure directories exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }

    // Save the audio buffer to a file
    fs.writeFileSync(audioFilePath, audioBuffer);
    console.log(`Audio file saved at: ${audioFilePath}`);

    // Process the audio file
    console.log('Processing audio file...');
    await new Promise<void>((resolve, reject) => {
      ffmpeg(audioFilePath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .audioFilters('aformat=sample_fmts=s16:sample_rates=16000')
        .save(processedAudioFilePath)
        .on('end', () => {
          console.log(`Processed audio file saved at: ${processedAudioFilePath}`);
          resolve();
        })
        .on('error', (err: any) => {
          console.error('Error processing audio file:', err);
          reject(err);
        });
    });

    // Upload the processed audio file
    const audioUrl = await uploadFile(processedAudioFilePath);
    if (!audioUrl) {
      throw new Error('Failed to upload audio file');
    }
    console.log('Audio uploaded successfully. URL:', audioUrl);

    // Transcribe the uploaded audio
    const transcriptData = await transcribeAudio(audioUrl);
    console.log('Transcript data received:', transcriptData.data);

    // Save the SRT file
    fs.writeFileSync(srtFilePath, formatToSRT(transcriptData.data.utterances));
    console.log(`SRT file saved at: ${srtFilePath}`);

    return srtFilePath;
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}

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

function formatTime(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const millisecondsFormatted = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds},${millisecondsFormatted}`;
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
    const srtFilePath = await generateCaptions(buffer);

    return NextResponse.json({ captionFile: path.basename(srtFilePath) });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Error generating captions' }, { status: 500 });
  }
}
