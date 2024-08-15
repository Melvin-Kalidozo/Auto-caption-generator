"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import Header from "@/components/fui/header"
import { AiOutlineUpload, AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";

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
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);

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

  const handleRemoveFile = () => {
    // Revoke the existing object URL
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    if (captionedVideoUrl) {
      URL.revokeObjectURL(captionedVideoUrl);
    }
    // Clear the file and preview
    setFile(null);
    setVideoPreview(null);
    setCaptionedVideoUrl(null)
    setUploadStatus(null)
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
    { label: "Default", fontSize: "18", fontColor: "#FFFFFF", border: "None", shadow: "", outline: "#000000", isShadowEnabled: false, isOutlineEnabled: true, fontWeight: "normal", fontItalic: "no", fontUnderline: "none", imageUrl: "/captionImages/0.png" },
    { label: "Black", fontSize: "18", fontColor: "#000000", border: "None", shadow: "", outline: "#FFFFFF", isShadowEnabled: false, isOutlineEnabled: true, fontWeight: "normal", fontItalic: "no", fontUnderline: "none", imageUrl: "/captionImages/1.png" },
    { label: "Blue Shadow", fontSize: "18", fontColor: "#0000FF", border: "None", shadow: "#0000FF", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: false, fontWeight: "normal", fontItalic: "no", fontUnderline: "none", imageUrl: "/captionImages/2.png" },
    { label: "Green Outline", fontSize: "18", fontColor: "#00FF00", border: "None", shadow: "", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: false, fontWeight: "", fontItalic: "no", fontUnderline: "none", imageUrl: "/captionImages/3.png" },
    { label: "RED Outline", fontSize: "18", fontColor: "#FFFFFF", border: "None", shadow: "", outline: "#ff0000", isShadowEnabled: false, isOutlineEnabled: true, fontWeight: "", fontItalic: "", fontUnderline: "", imageUrl: "/captionImages/4.png" },
    { label: "Shadowed Red Outline", fontSize: "18", fontColor: "#000000", border: "None", shadow: "", outline: "#0011ff", isShadowEnabled: false, isOutlineEnabled: true, fontWeight: "normal", fontItalic: "", fontUnderline: "", imageUrl: "/captionImages/5.png" },


    { label: "Bold Italic Green Outline", fontSize: "18", fontColor: "#FFFFFF", border: "solid", shadow: "#000000", outline: "#000000", isShadowEnabled: false, isOutlineEnabled: true, fontWeight: "bold", fontItalic: "yes", fontUnderline: "none", imageUrl: "/captionImages/7.png" },

    { label: "Underlined Blue Shadow", fontSize: "18", fontColor: "#FFFFFF", border: "solid", shadow: "#0000FF", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: false, fontWeight: "normal", fontItalic: "no", fontUnderline: "underline", imageUrl: "/captionImages/6.png" },
    { label: "Bold Italic Green Outline", fontSize: "18", fontColor: "#FFFFFF", border: "solid", shadow: "#00FF00", outline: "#000000", isShadowEnabled: true, isOutlineEnabled: true, fontWeight: "bold", fontItalic: "yes", fontUnderline: "none", imageUrl: "/captionImages/8.png" },

    { label: "white Outline", fontSize: "18", fontColor: "#000000", shadow: "#ff0000", border: "solid", outline: "#FFFFFF", isShadowEnabled: true, isOutlineEnabled: true, fontWeight: "bold", fontItalic: "yes", fontUnderline: "none", imageUrl: "/captionImages/9.png" },
  ];




  const handleFormatChange = (formatIndex: number) => {
    const selectedFormat = predefinedFormats[formatIndex];
    setFontSize(selectedFormat.fontSize);
    setFontColor(selectedFormat.fontColor);
    setShadow(selectedFormat.shadow);
    setOutline(selectedFormat.outline);
    setIsShadowEnabled(selectedFormat.isShadowEnabled);
    setIsOutlineEnabled(selectedFormat.isOutlineEnabled);
    setBorderStyle(selectedFormat.border);

    if (selectedFormat.fontWeight === "normal") {
      setFontWeight(true)
    }


    // setFontItalic(selectedFormat.fontItalic);
    // setFontUnderline(selectedFormat.fontUnderline);
    setSelectedFormatIndex(formatIndex); // Update the selected format index
  };


  return (
    <div>
      {/* Caption preview
      <div className="mt-4">
        <p className="text-gray-300">Caption Preview:</p>
        <div
          style={{ ...previewStyle, ...backPreview }}
          className="border p-4 mr-4 bg-[#353535]"
        >
          {captionText}
        </div>
      </div> */}

      <Header />
      <div className="pt-6 grid-background min-h-screen flex flex-col items-center justify-center bg-[#202124]">
        {captionedVideoUrl && (
          <h3 className="text-gray-30 mb-4 w-[80%]">Captioned Video Preview:</h3>
        )}
        <div
          className="border-dashed border-2 w-[80%] border-[#0078D4] rounded-sm bg-[#353535]"
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
            {!videoPreview && !captionedVideoUrl && (
              <p className="text-[#0078D4] p-[10em]">Drag & drop or click here to upload a video</p>
            )}
          </label>

          {videoPreview && !captionedVideoUrl && (
            <div className="m-auto w-[100%] flex justify-center items-center">
              <video
                src={videoPreview}
                controls
                className="w-full h-[500px] rounded-sm "
              />

            </div>
          )}

          {captionedVideoUrl && (
            <div className="">

              <div className="m-auto w-[100%] flex justify-center items-center">
                <video
                  src={captionedVideoUrl}
                  controls
                  className="w-full h-[500px] rounded-sm "
                />

              </div>
            </div>
          )}




        </div>

        {uploadStatus && (
          <p className={`w-[80%] mt-4 ${uploadStatus.includes("failed") ? "text-red-500" : "text-green-500"}`}>
            {uploadStatus}
          </p>
        )}

        {videoPreview && !captionedVideoUrl && (
          <div className="mb-4 w-[80%] m-auto mt-6">
            <p className="text-gray-300 mb-2 text-[1.2rem]"> <span className=" text-[#0078D4] font-bold">Select</span> Caption Format:</p>
            <div className="flex overflow-x-auto scrollbar-none space-x-4">
              {predefinedFormats.map((format, index) => (
                <label
                  key={index}
                  onClick={() => handleFormatChange(index)}
                  className={`text-gray-300 flex flex-col justify-center items-center cursor-pointer transition-transform duration-200 transform hover:scale-95 ${selectedFormatIndex === index ? "border-2 border-[#0078D4]" : "border-2 border-[#30363D]"
                    }`}
                  style={{
                    minWidth: "400px",
                    height: "100%",
                    padding: ".5em",
                  }}
                >
                  <img
                    src={format.imageUrl}
                    alt={format.label}
                    style={{
                      width: "100%",
                      height: "100%", // Adjust as needed for visibility
                      objectFit: "contain", // Space between image and text
                    }}
                  />

                </label>
              ))}

            </div>
          </div>
        )}


        <div className="flex w-[80%] mt-4 space-x-4">
          {videoPreview && !captionedVideoUrl && (
            <button
              onClick={handleUpload}
              className="flex items-center bg-[#353535] text-white mb-5 p-2 rounded-lg hover:bg-gray-700"
            >
              <AiOutlineUpload className="text-gray-400 mr-2" />
              Upload Video
            </button>
          )}

          {captionedVideoUrl && !videoPreview && (
            <a
              href={captionedVideoUrl}
              download
              className="flex items-center bg-[#353535] text-white mb-5 p-2 rounded-lg hover:bg-gray-700"
            >
              <AiOutlineDownload className="text-gray-400 mr-2" />
              Download Captioned Video
            </a>
          )}

          {(videoPreview || captionedVideoUrl) && (
            <button
              onClick={handleRemoveFile}
              className="flex items-center bg-[#353535] text-white mb-5 p-2 rounded-lg hover:bg-gray-700"
            >
              <AiOutlineDelete className="text-gray-400 mr-2" />
              Remove File
            </button>
          )}
        </div>

      </div>
    </div>

  );
}
