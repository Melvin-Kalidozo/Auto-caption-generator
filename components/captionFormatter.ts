function splitDialogueText(text: string, maxLength: number, overlapIndicator: string = '|'): string[] {
    const words = text.split(/(\s+|\b)/); // Split by spaces and word boundaries, preserving punctuation
    const lines: string[] = [];
    let currentLine = '';
  
    words.forEach(word => {
      // Handle overlap indicators (e.g., |) by splitting immediately
      if (word === overlapIndicator) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        return;
      }
  
      // Check if adding the word exceeds the max length
      if (currentLine.length + word.length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
  
      currentLine += word;
  
      // If word is a pause indicator, split here
      if (word.match(/[.,?!]/)) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
    });
  
    // Add any remaining text as the last line
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  
    return lines;
  }
  
  
  function formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toFixed(3).replace('.', ',');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  export default function formatToSRT(utterances: { start: number; end: number; speaker: string; text: string }[]): string {
    let srtContent = '';
    let counter = 1;
    
  
    for (const utterance of utterances) {
      const startTime = utterance.start / 1000; // Convert to seconds
      const endTime = utterance.end / 1000; // Convert to seconds
      const duration = endTime - startTime;
  
      // Split the text into segments based on maximum length
      const segments = splitDialogueText(utterance.text, 50); // Use 50 characters for each segment
      const segmentDuration = duration / segments.length;
  
      let currentStartTime = startTime;
  
      for (let i = 0; i < segments.length; i++) {
        const currentEndTime = currentStartTime + segmentDuration;
  
        // Adjust the segment end time to avoid overlap and ensure captions stay on screen
        const adjustedEndTime = Math.min(currentEndTime, endTime);
  
        srtContent += `${counter}\n${formatTime(currentStartTime)} --> ${formatTime(adjustedEndTime)}\n${segments[i]}\n\n`;
        counter++;
  
        currentStartTime = adjustedEndTime; // Move to the next segment time
      }
    }
  
    return srtContent;
  }