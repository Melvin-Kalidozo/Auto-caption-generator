interface UploadStatusProps {
    captionedVideoUrl: string;
    uploadStatus: string;
    uploadProgress: number;
  }
  
  export default function UploadStatus({
    captionedVideoUrl,
    uploadStatus,
    uploadProgress,
  }: UploadStatusProps) {
    return (
      <div className="mt-4">
        <p className="text-gray-300">{uploadStatus}</p>
        {uploadStatus === "Uploading" && (
          <progress value={uploadProgress} max="100" className="w-full h-2 bg-gray-700" />
        )}
        {captionedVideoUrl && (
          <a
            href={captionedVideoUrl}
            download
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Download Captioned Video
          </a>
        )}
      </div>
    );
  }
  