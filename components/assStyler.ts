import fs from 'fs';

function hexToAssColor(hex: string): string {
  const color = hex.replace('#', '');
  const bgrColor = color.length === 6 ? color.match(/.{2}/g)!.reverse().join('') : '';
  return `&H00${bgrColor}`;
}

// Modify existing ASS file with custom styling
export function addStylingToAssFile(
  assFilePath: string,
  fontSize: string,
  fontColor: string,
  fontStyle: string,
  fontWeight: boolean,
  fontItalic: boolean,
  fontUnderline: boolean,
  fontStrikeOut: boolean,
  spacing: number,
  angle: number,
  borderStyle: string,
  outline: string,
  shadow: string,
  alignment: string,
  shadowToogle: string,
  outlineToogle: string,
  neonEffect: string
): void {
  // Read the existing ASS file content
  let fileContent = fs.readFileSync(assFilePath, 'utf8');

  // Log the original file content
  console.log('Original ASS file content:');
  console.log(fileContent);

  // Define the style string to replace
  const styleLine = `Style: Default,Arial,${fontSize},${hexToAssColor(fontColor)},&H0,${hexToAssColor(outline)},${hexToAssColor(shadow)},${fontWeight ? 1 : 0},${fontItalic ? 1 : 0},${fontUnderline ? 1 : 0},${fontStrikeOut ? 1 : 0},100,100,0,0,${borderStyle},${outlineToogle},${shadowToogle},2,30,30,30,1`;

  // Find the style section
  const styleSectionRegex = /(\[V4\+ Styles\][\s\S]*?)(\[.*?\])/;
  const match = fileContent.match(styleSectionRegex);

  if (match) {
    // Replace the style section with the new style
    fileContent = fileContent.replace(match[1], `${match[1]}${styleLine}\n`);

    // Log the updated file content
    console.log('Updated ASS file content:');
    console.log(fileContent);
  } else {
    throw new Error('Style section not found in the ASS file.');
  }

  // Conditionally add {\fade(200,200)\blur5} just before every text in the dialogue
  if (neonEffect === "yes") {
    const dialogueLineRegex = /^Dialogue: \d,\d{1}:\d{2}:\d{2}\.\d{2},\d{1}:\d{2}:\d{2}\.\d{2},Default,,0,0,0,,(.*)$/gm;
    fileContent = fileContent.replace(dialogueLineRegex, (match, p1) => {
      return match.replace(p1, `{\\fade(20,20)\\blur10}${p1}`);
    });
  }

  // Log the final updated content
  console.log('Final updated ASS file content:');
  console.log(fileContent);

  // Write the final updated content back to the file
  fs.writeFileSync(assFilePath, fileContent, 'utf8');
}
