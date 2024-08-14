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
    outlineToogle: string
  ): void {
    // Read the existing ASS file content
    let fileContent = fs.readFileSync(assFilePath, 'utf8');
  
    // Log the original file content
    console.log('Original ASS file content:');
    console.log(fileContent);
  
    // Define the style string to replace
    const styleLine = `Style: Default,Arial,${fontSize},${hexToAssColor(fontColor)},&H0,${hexToAssColor(outline)},${hexToAssColor(shadow)},${fontWeight ? 1 : 0},${fontItalic ? 1 : 0},${fontUnderline ? 1 : 0},${fontStrikeOut ? 1 : 0},100,100,0,0,${borderStyle === 'None' ? 1 : 3},${outlineToogle},${shadowToogle},2,10,10,10,1`;
  
    // Find the style section
    const styleSectionRegex = /(\[V4\+ Styles\][\s\S]*?)(\[.*?\])/;
    const match = fileContent.match(styleSectionRegex);
  
    if (match) {
      // Replace the style section with the new style
      const updatedContent = fileContent.replace(match[1], `${match[1]}${styleLine}\n`);
  
      // Log the updated file content
      console.log('Updated ASS file content:');
      console.log(updatedContent);
  
      // Write the updated content back to the file
      fs.writeFileSync(assFilePath, updatedContent, 'utf8');
    } else {
      throw new Error('Style section not found in the ASS file.');
    }
  }