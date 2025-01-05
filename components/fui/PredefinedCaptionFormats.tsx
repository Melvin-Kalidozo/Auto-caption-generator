import React from "react";

interface PredefinedCaptionFormatsProps {
  predefinedFormats: any[];
  handleFormatChange: (index: number) => void;
}

export default function PredefinedCaptionFormats({
  predefinedFormats,
  handleFormatChange,
}: PredefinedCaptionFormatsProps) {
  return (
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
              fontWeight:
                format.label && format.label.includes("Bold") ? "bold" : "normal",
              textShadow: format.isShadowEnabled
                ? `2px 2px 4px ${format.shadow}`
                : "none",
              border: format.isOutlineEnabled
                ? `2px solid ${format.outline}`
                : "none",
            }}
          >
            {format.label}
          </div>
        </label>
      ))}
    </div>
  );
}
