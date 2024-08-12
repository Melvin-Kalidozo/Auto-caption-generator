"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setVideoPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setVideoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (file) {
      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("video", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadStatus(`Upload successful: ${result.filename}`);
        } else {
          setUploadStatus("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        setUploadStatus("Upload failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="border-dashed border-4 border-gray-300 p-12 rounded-lg bg-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          
          <p className="text-gray-500">Drag & drop or click here to upload a video</p>
        </label>

        {videoPreview && (
          <div className="mt-4">
            <video
              src={videoPreview}
              controls
              className="w-full max-w-md h-auto rounded-lg mb-4"
            />
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Upload Video
            </button>
          </div>
        )}

        {uploadStatus && (
          <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
}
