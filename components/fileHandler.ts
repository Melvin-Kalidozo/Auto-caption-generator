// fileHandler.ts
import fs from 'fs';
import path from 'path';
import apiClient from './apiClient';

export function ensureDirectories(...dirs: string[]): void {
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export function saveBufferToFile(buffer: Buffer, filePath: string): void {
  fs.writeFileSync(filePath, buffer);
}

export async function uploadFile(filePath: string): Promise<string | null> {
  try {
    const data = fs.readFileSync(filePath);
    const response = await apiClient.post('/upload', data, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });
    return response.status === 200 ? response.data['upload_url'] : null;
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    return null;
  }
}
