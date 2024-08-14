// audioProcessor.ts
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export async function processAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFilters('aformat=sample_fmts=s16:sample_rates=16000')
      .save(outputPath)
      .on('end', ()=>{resolve()})
      .on('error', reject);
  });
}
