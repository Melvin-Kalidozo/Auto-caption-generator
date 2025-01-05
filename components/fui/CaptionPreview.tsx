import React from "react";

interface CaptionPreviewProps {
  previewStyle: React.CSSProperties;
  backPreview: React.CSSProperties;
  captionText: string;
}

export default function CaptionPreview({
  previewStyle,
  backPreview,
  captionText,
}: CaptionPreviewProps) {
  return (
    <div className="mt-4">
      <p className="text-gray-300">Caption Preview:</p>
      <div
        style={{ ...previewStyle, ...backPreview }}
        className="border p-4 mr-4 bg-gray-800"
      >
        {captionText}
      </div>
    </div>
  );
}
