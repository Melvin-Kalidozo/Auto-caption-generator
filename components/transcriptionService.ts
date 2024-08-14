// transcriptionService.ts
import apiClient from './apiClient';

export async function transcribeAudio(audioUrl: string): Promise<any> {
  try {
    const transcriptResponse = await apiClient.post('/transcript', {
      audio_url: audioUrl,
      speaker_labels: true,
    });

    const transcriptId = transcriptResponse.data.id;
    let transcriptStatus;

    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const statusResponse = await apiClient.get(`/transcript/${transcriptId}`);
      transcriptStatus = statusResponse.data.status;
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
