
import { SubtitleEntry } from '../types';

export const parseSrt = (srtContent: string): SubtitleEntry[] => {
  const subtitles: SubtitleEntry[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;

    const id = parseInt(lines[0], 10);
    const timeLine = lines[1];
    const textLines = lines.slice(2).join('\n');

    const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (id && timeMatch) {
      subtitles.push({
        id,
        startTime: timeMatch[1],
        endTime: timeMatch[2],
        originalText: textLines.trim(),
      });
    }
  }
  return subtitles;
};
