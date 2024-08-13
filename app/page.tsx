"use client";

import { useState, DragEvent, ChangeEvent, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [srtUrl, setSrtUrl] = useState<string | null>(null);
  const [assUrl, setAssUrl] = useState<string | null>(null);

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
      setVideoPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
      setVideoPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a video file first.");
      return;
    }

    setUploadStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      const result = await response.json();
      console.log(result);

      if (result.error) {
        setUploadStatus("Failed to generate captions.");
      } else {
        setSrtUrl(result.srtUrl);
        setAssUrl(result.assUrl);
        setUploadStatus("Captions generated and uploaded successfully.");
      }
    } catch (error) {
      console.error(error);
      setUploadStatus("An error occurred while uploading.");
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-2xl font-bold mb-4">Upload Video for Transcription</h1>
      <input type="file" accept="video/*" onChange={handleChange} />
      {videoPreview && (
        <div className="mt-4">
          <video controls src={videoPreview} className="w-full max-w-md" />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload and Generate Captions
      </button>
      {uploadStatus && <p className="mt-4 text-lg">{uploadStatus}</p>}
      {srtUrl && (
        <p className="mt-2 text-blue-600">
          <a href={srtUrl} target="_blank" rel="noopener noreferrer">
            Download SRT Captions
          </a>
        </p>
      )}
      {assUrl && (
        <p className="mt-2 text-blue-600">
          <a href={assUrl} target="_blank" rel="noopener noreferrer">
            Download ASS Captions
          </a>
        </p>
      )}
    </div>
  );
}
