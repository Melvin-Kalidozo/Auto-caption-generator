interface CaptionSettingsProps {
    fontSize: string;
    fontColor: string;
    fontWeight: boolean;
    fontItalic: boolean;
    fontUnderline: boolean;
    fontStrikeOut: boolean;
    borderStyle: string;
    outline: string;
    shadow: string;
    isShadowEnabled: boolean;
    isOutlineEnabled: boolean;
    alignment: string;
    captionText: string;
    setFontSize: (value: string) => void;
    setFontColor: (value: string) => void;
    setFontWeight: (value: boolean) => void;
    setFontItalic: (value: boolean) => void;
    setFontUnderline: (value: boolean) => void;
    setFontStrikeOut: (value: boolean) => void;
    setBorderStyle: (value: string) => void;
    setOutline: (value: string) => void;
    setShadow: (value: string) => void;
    setIsShadowEnabled: (value: boolean) => void;
    setIsOutlineEnabled: (value: boolean) => void;
    setAlignment: (value: string) => void;
    setCaptionText: (value: string) => void;
  }
  
  export default function CaptionSettings({
    fontSize, fontColor, fontWeight, fontItalic, fontUnderline, fontStrikeOut,
    borderStyle, outline, shadow, isShadowEnabled, isOutlineEnabled, alignment, captionText,
    setFontSize, setFontColor, setFontWeight, setFontItalic, setFontUnderline, setFontStrikeOut,
    setBorderStyle, setOutline, setShadow, setIsShadowEnabled, setIsOutlineEnabled, setAlignment, setCaptionText,
  }: CaptionSettingsProps) {
    const showShadowColorSelector = isShadowEnabled || borderStyle !== "None";
    const showOutlineColorSelector = isOutlineEnabled || borderStyle !== "None";
  
    return (
      <div>
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
        {/* Additional settings for shadow, outline, alignment, and caption text */}
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
      </div>
    );
  }
  