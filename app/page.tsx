"use client";

import { useState, DragEvent, ChangeEvent, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [captionedVideoUrl, setCaptionedVideoUrl] = useState<string | null>(null);

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
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      const previewUrl = URL.createObjectURL(droppedFile);
      setVideoPreview(previewUrl);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(previewUrl);
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
          setCaptionedVideoUrl(result.downloadLink);
          setUploadStatus("Upload successful!");
          console.log('Upload successful:', result);

          // Remove the video preview after upload
          setVideoPreview(null);
        } else {
          const result = await response.json();
          console.error('Upload failed:', result.error, result.details);
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
        className="border-dashed border-4 border-gray-300 p-12 rounded-lg bg-white flex flex-col items-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="mb-4 text-center">
          <p>Drag and drop your video here, or</p>
          <p className="text-blue-500 underline">choose a file</p>
        </div>
        {videoPreview && <video src={videoPreview} controls width="300" />}
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
          disabled={uploadStatus === "Uploading..."}
        >
          {uploadStatus === "Uploading..." ? "Uploading..." : "Upload Video"}
        </button>
        {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        {captionedVideoUrl && (
          <a
            href={captionedVideoUrl}
            download
            className="mt-4 bg-green-500 text-white p-2 rounded inline-block"
          >
            Download Captioned Video
          </a>
        )}
      </div>
    </div>
  );
}
