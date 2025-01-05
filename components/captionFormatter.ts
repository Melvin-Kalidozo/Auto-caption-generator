export function formatToSRT(words: { text: string; start: number; end: number }[]): string {
    if (!Array.isArray(words) || words.length === 0) {
        console.error('Invalid words array');
        throw new Error('Invalid words array');
    }


    let srtContent = '';
    let counter = 1;
    let sentenceText = '';
    let sentenceStart: number | null = null;

    for (const word of words) {
        if (!word || typeof word.start !== 'number' || typeof word.end !== 'number') {
            continue;
        }

        const startTime = word.start / 1000; // Convert to seconds
        const endTime = word.end / 1000; // Convert to seconds

        sentenceText += word.text + ' ';
        
        // Check for end of sentence based on punctuation
        if (/[.!?]$/.test(word.text.trim())) {
            if (sentenceStart !== null) {
                srtContent += `${counter}\n${formatTime(sentenceStart / 1000)} --> ${formatTime(endTime)}\n${sentenceText.trim()}\n\n`;
                counter++;
                sentenceText = '';
                sentenceStart = null;
            }
        } else if (/,+$/.test(word.text.trim())) {
            // Handle comma as a break for new subtitle
            if (sentenceStart !== null) {
                srtContent += `${counter}\n${formatTime(sentenceStart / 1000)} --> ${formatTime(endTime)}\n${sentenceText.trim()}\n\n`;
                counter++;
                sentenceText = '';
                sentenceStart = null;
            }
        } else if (sentenceStart === null) {
            sentenceStart = word.start;
        }
    }

    // If there's any remaining text that hasn't been added (in case there's no final punctuation mark)
    if (sentenceText.trim() && sentenceStart !== null) {
        srtContent += `${counter}\n${formatTime(sentenceStart / 1000)} --> ${formatTime(words[words.length - 1].end / 1000)}\n${sentenceText.trim()}\n\n`;
    }

    return srtContent;
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
