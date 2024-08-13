import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase'; // Adjust the path to your firebase.ts
import ffmpeg from 'fluent-ffmpeg';
import { Buffer } from 'buffer';
import { exec } from 'child_process';

const ASSEMBLYAI_API_KEY = 'fb8ede8de7a848338d975c4dcf1bc885';
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';

const apiClient = axios.create({
  baseURL: ASSEMBLYAI_API_URL,
  headers: {
    Authorization: ASSEMBLYAI_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Function to upload a file to Firebase Storage
async function uploadFileToFirebase(
  file: Blob,
  folder: string,
  fileName: string
): Promise<string | null> {
  try {
    console.log(`Uploading file to Firebase: ${folder}/${fileName}`);
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const metadata = { contentType: file.type };
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`File uploaded to Firebase. Download URL: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
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
    console.log(`Transcript ID: ${transcriptId}`);
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

  console.log('SRT format content generated.');
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

// Function to convert SRT to ASS format
function convertSrtToAss(srtContent: string): string {
  console.log('Converting SRT to ASS format...');
  return srtContent.replace(/,/g, '.');
}

// Function to generate captions and upload them to Firebase
async function generateCaptionsAndUpload(
  file: Blob,
  folder: string
): Promise<{ srtUrl: string; assUrl: string } | null> {
  try {
    console.log('Uploading audio file to Firebase...');
    const audioUrl = await uploadFileToFirebase(file, folder, 'uploaded_audio.wav');
    
    if (!audioUrl) {
      throw new Error('Failed to upload audio to Firebase');
    }

    console.log('Transcribing audio...');
    const transcript = await transcribeAudio(audioUrl);
    const srtContent = formatToSRT(transcript.data.utterances);

    const srtBuffer = Buffer.from(srtContent, 'utf-8');
    console.log('Uploading SRT file to Firebase...');
    const srtUrl = await uploadFileToFirebase(new Blob([srtBuffer]), folder, 'captions.srt');
    if (!srtUrl) {
      throw new Error('Failed to upload SRT to Firebase');
    }

    const assContent = convertSrtToAss(srtContent);
    const assBuffer = Buffer.from(assContent, 'utf-8');
    console.log('Uploading ASS file to Firebase...');
    const assUrl = await uploadFileToFirebase(new Blob([assBuffer]), folder, 'captions.ass');
    if (!assUrl) {
      throw new Error('Failed to upload ASS to Firebase');
    }

    console.log('Captions generated and uploaded successfully.');
    return { srtUrl, assUrl };
  } catch (error) {
    console.error('Error generating captions:', error);
    return null;
  }
}

// Function to add captions to a video using FFmpeg
async function addCaptionsToVideo(
  videoFile: Blob,
  assUrl: string,
  folder: string
): Promise<Blob | null> {
  try {
    console.log('Downloading ASS file from Firebase...');
    const assResponse = await fetch(assUrl);
    if (!assResponse.ok) {
      throw new Error('Failed to download ASS file');
    }
    const assContent = await assResponse.text();

    // Upload the video to Firebase Storage to get a file path
    const videoUrl = await uploadFileToFirebase(videoFile, folder, 'original_video.mp4');
    if (!videoUrl) {
      throw new Error('Failed to upload video to Firebase');
    }

    console.log('Adding captions to video...');
    return new Promise<Blob>((resolve, reject) => {
      const originalVideoPath = 'original_video.mp4';
      const assFilePath = 'captions.ass';
      const captionedVideoPath = 'output_with_captions.mp4';

      // Create a command to add captions using FFmpeg
      const command = `ffmpeg -i "${videoUrl}" -vf ass="${assUrl}" "save directly to w"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          reject(error);
        } else {
          console.log('FFmpeg command executed successfully');

          // Assuming that the output file is stored locally, convert it to a Blob and resolve it
          const outputFile = captionedVideoPath;
          resolve(new Blob([Buffer.from(outputFile)], { type: 'video/mp4' }));
        }
      });
    });
  } catch (error) {
    console.error('Error adding captions to video:', error);
    return null;
  }
}


// Handle POST requests to generate captions, add them to the video, and upload files
export async function POST(req: NextRequest) {
  try {
    console.log('Handling POST request...');
    const formData = await req.formData();
    const videoFile = formData.get('video') as Blob; // Ensure 'video' matches the field name in the form

    // console.log("uploading video ...")
    // const videoUrl = await uploadFileToFirebase(videoFile, folder, 'uploaded_video.mp4');

    if (!videoFile) {
      console.error('No video file provided in the request.');
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    console.log('File received. Generating captions and uploading...');
    const folder = 'your_folder_name';
    const result = await generateCaptionsAndUpload(videoFile, folder);

    if (!result) {
      console.error('Failed to generate captions.');
      return NextResponse.json({ error: 'Failed to generate captions' }, { status: 500 });
    }

    console.log('Adding captions to video...');
    const videoWithCaptions = await addCaptionsToVideo(videoFile, result.srtUrl, folder);
    if (!videoWithCaptions) {
      console.error('Failed to add captions to video.');
      return NextResponse.json({ error: 'Failed to add captions to video' }, { status: 500 });
    }

    console.log('Uploading video with captions to Firebase...');
    const videoUrl = await uploadFileToFirebase(videoWithCaptions, folder, 'video_with_captions.mp4');
    if (!videoUrl) {
      console.error('Failed to upload video with captions to Firebase.');
      return NextResponse.json({ error: 'Failed to upload video with captions' }, { status: 500 });
    }

    console.log('Returning response with video URL.');
    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
