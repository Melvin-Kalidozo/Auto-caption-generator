"use client";

import { useState, DragEvent, ChangeEvent } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [captionedVideoUrl, setCaptionedVideoUrl] = useState<string | null>(null);

  // State variables for custom caption settings
  const [fontSize, setFontSize] = useState<string>("16");
  const [fontColor, setFontColor] = useState<string>("#FFFFFF");
  const [fontStyle, setFontStyle] = useState<string>("Normal");
  const [fontWeight, setFontWeight] = useState<boolean>(false);
  const [fontItalic, setFontItalic] = useState<boolean>(false);
  const [fontUnderline, setFontUnderline] = useState<boolean>(false);
  const [fontStrikeOut, setFontStrikeOut] = useState<boolean>(false);
  const [borderStyle, setBorderStyle] = useState<string>("None");
  const [outline, setOutline] = useState<string>("#000000");
  const [shadow, setShadow] = useState<string>("#000000");
  const [alignment, setAlignment] = useState<string>("Center");
  const [captionText, setCaptionText] = useState<string>("Sample Caption");
  const [isShadowEnabled, setIsShadowEnabled] = useState<boolean>(false);
  const [isOutlineEnabled, setIsOutlineEnabled] = useState<boolean>(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      const previewUrl = URL.createObjectURL(droppedFile);
      setVideoPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
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
      formData.append("fontSize", fontSize);
      formData.append("fontColor", fontColor);
      formData.append("fontStyle", fontStyle);
      formData.append("fontWeight", String(fontWeight));
      formData.append("fontItalic", String(fontItalic));
      formData.append("fontUnderline", String(fontUnderline));
      formData.append("fontStrikeOut", String(fontStrikeOut));
      formData.append("borderStyle", borderStyle);
      formData.append("outline", outline);
      formData.append("shadow", shadow);
      formData.append("shadowToogle", isShadowEnabled ? "1" : "0");
      formData.append("outlineToogle", isOutlineEnabled ? "1" : "0");
      formData.append("alignment", alignment);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setCaptionedVideoUrl(result.downloadLink);
          setUploadStatus("Upload successful!");
          setVideoPreview(null);
        } else {
          setUploadStatus("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        setUploadStatus("Upload failed");
      }
    }
  };

  const previewStyle = {
    fontSize: `${fontSize}px`,
    color: fontColor,
    fontWeight: fontWeight ? "bold" : "normal",
    fontStyle: fontItalic ? "italic" : "normal",
    textDecoration: `${fontUnderline ? "underline" : "none"} ${fontStrikeOut ? "line-through" : "none"}`,
    textShadow: `2px 2px 4px ${shadow}`,
    border: borderStyle === "None" ? "none" : `2px ${borderStyle} ${outline}`,
    textAlign: alignment.toLowerCase() as "left" | "center" | "right",
  };

  const backPreview = {
    backgroundColor: borderStyle === "None" ? "transparent" : outline,
    boxShadow: borderStyle !== "None" ? `3px 5px 0px 0px ${shadow}` : "none",
  };

  // Determine when to show the color selectors
  const showShadowColorSelector = isShadowEnabled || borderStyle !== "None";
  const showOutlineColorSelector = isOutlineEnabled || borderStyle !== "None";

  const predefinedFormats = [
    { label: "Default", fontSize: "16", fontColor: "#FFFFFF", shadow: "", outline: "", isShadowEnabled: false, isOutlineEnabled: false },
    { label: "Bold Red", fontSize: "20", fontColor: "#FF0000", shadow: "#000000", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: true },
    { label: "Blue Shadow", fontSize: "18", fontColor: "#0000FF", shadow: "#0000FF", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: false },
    { label: "Green Outline", fontSize: "16", fontColor: "#00FF00", shadow: "#000000", outline: "#00FF00", isShadowEnabled: false, isOutlineEnabled: true },
  ];

  const handleFormatChange = (formatIndex: number) => {
    const selectedFormat = predefinedFormats[formatIndex];
    setFontSize(selectedFormat.fontSize);
    setFontColor(selectedFormat.fontColor);
    setShadow(selectedFormat.shadow);
    setOutline(selectedFormat.outline);
    setIsShadowEnabled(selectedFormat.isShadowEnabled);
    setIsOutlineEnabled(selectedFormat.isOutlineEnabled);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Caption preview */}
      <div className="mt-4">
        <p className="text-gray-300">Caption Preview:</p>
        <div
          style={{ ...previewStyle, ...backPreview }}
          className="border p-4 mr-4 bg-gray-800"
        >
          {captionText}
        </div>
      </div>

      <div
        className="border-dashed border-4 border-gray-700 p-12 rounded-lg bg-gray-800"
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
          <p className="text-gray-400">Drag & drop or click here to upload a video</p>
        </label>

        {videoPreview && !captionedVideoUrl && (
          <div className="mt-4">
            <video
              src={videoPreview}
              controls
              className="w-full max-w-md h-auto rounded-lg mb-4"
            />

            {/* Predefined caption formats */}
            <div className="mb-4">
              <p className="text-gray-300">Select Caption Format:</p>
              {predefinedFormats.map((format, index) => (
                <label key={index} className="block text-gray-300">
                  <input
                    type="radio"
                    name="captionFormat"
                    defaultChecked={index === 0}
                    onChange={() => handleFormatChange(index)}
                    className="mr-2"
                  />
                  <div
                    style={{
                      fontSize: `${format.fontSize}px`,
                      color: format.fontColor,
                      fontWeight: format.label.includes("Bold") ? "bold" : "normal",
                      textShadow: format.isShadowEnabled ? `2px 2px 4px ${format.shadow}` : "none",
                      border: format.isOutlineEnabled ? `2px solid ${format.outline}` : "none",
                    }}
                  >
                    {format.label}
                  </div>
                </label>
              ))}
            </div>

            {/* Custom caption settings */}
            <div className="mb-4">
              <label className="block text-gray-300">Font Size:</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Font Color:</label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-full p-2 border rounded-lg"
                style={{ backgroundColor: fontColor }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Font Weight:</label>
              <input
                type="checkbox"
                checked={fontWeight}
                onChange={(e) => setFontWeight(e.target.checked)}
                className="mr-2"
              />
              Bold
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Font Style:</label>
              <input
                type="checkbox"
                checked={fontItalic}
                onChange={(e) => setFontItalic(e.target.checked)}
                className="mr-2"
              />
              Italic
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Underline:</label>
              <input
                type="checkbox"
                checked={fontUnderline}
                onChange={(e) => setFontUnderline(e.target.checked)}
                className="mr-2"
              />
              Underline
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Shadow:</label>
              <select
                value={isShadowEnabled ? "1" : "0"}
                onChange={(e) => setIsShadowEnabled(e.target.value === "1")}
                className="w-full p-2 border rounded-lg bg-gray-700 text-white"
              >
                <option value="0">No Shadow</option>
                <option value="1">Shadow</option>
              </select>
            </div>

            <div className="mb-4 flex items-center">
              <label className="text-gray-300 mr-2">Enable Outline:</label>
              <input
                type="checkbox"
                checked={isOutlineEnabled}
                onChange={(e) => setIsOutlineEnabled(e.target.checked)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Alignment:</label>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700 text-white"
              >
                <option value="Left">Left</option>
                <option value="Center">Center</option>
                <option value="Right">Right</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Caption Text:</label>
              <input
                type="text"
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700 text-white"
              />
            </div>

            {showShadowColorSelector && (
              <div className="mb-4">
                <label className="block text-gray-300">Shadow Color:</label>
                <input
                  type="color"
                  value={shadow}
                  onChange={(e) => setShadow(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  style={{ backgroundColor: shadow }}
                />
              </div>
            )}

            {showOutlineColorSelector && (
              <div className="mb-4">
                <label className="block text-gray-300">Outline Color:</label>
                <input
                  type="color"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  style={{ backgroundColor: outline }}
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 text-white p-2 rounded-lg"
            >
              Upload Video
            </button>
          </div>
        )}

        {captionedVideoUrl && (
          <div className="mt-4">
            <h3 className="text-gray-300">Captioned Video Preview:</h3>
            <video
              src={captionedVideoUrl}
              controls
              className="w-full max-w-md h-auto rounded-lg"
            />
          </div>
        )}

        {captionedVideoUrl && (
          <div className="mt-4">
            <a
              href={captionedVideoUrl}
              download
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Captioned Video
            </a>
          </div>
        )}

        {uploadStatus && (
          <p className={`mt-4 ${uploadStatus.includes("failed") ? "text-red-500" : "text-green-500"}`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
}
