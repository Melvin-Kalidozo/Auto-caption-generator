import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { uploadFile } from './fileHandler';
import { transcribeAudio } from './transcriptionService';
import formatToSRT from './captionFormatter';
import { addStylingToAssFile } from './assStyler';

export async function generateCaptions(
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
  shadowToggle: string,
  outlineToggle: string
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
      console.log(`Created directory: ${normalizedUploadsDir}`);
    }
    if (!fs.existsSync(normalizedProcessedDir)) {
      fs.mkdirSync(normalizedProcessedDir, { recursive: true });
      console.log(`Created directory: ${normalizedProcessedDir}`);
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
    console.log('Audio transcription completed.');

    // Extract the spoken text without any reference to the speaker
    const cleanedTranscript = transcriptData.data.utterances.map((utterance: any) => ({
      start: utterance.start,
      end: utterance.end,
      text: utterance.text,  // Retain only the spoken text
    }));
    console.log('Cleaned transcript generated.');

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
    console.log('Adding custom styling to the ASS file...');
    addStylingToAssFile(
      normalizedAssFilePath,
      fontSize,
      fontColor,
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
      shadowToggle,
      outlineToggle
    );
    console.log('Custom styling added to the ASS file.');

    return { srtFilePath: normalizedSrtFilePath, assFilePath: normalizedAssFilePath };
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
}
