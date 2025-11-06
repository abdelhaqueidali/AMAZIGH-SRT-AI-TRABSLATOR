import { SubtitleEntry } from '../types';

export const buildSrt = (subtitles: SubtitleEntry[], type: 'translated' | 'original'): string => {
  return subtitles.map(entry => {
    let text = entry.originalText;
    if (type === 'translated') {
      text = entry.translatedText || entry.originalText;
    }
    return `${entry.id}\n${entry.startTime} --> ${entry.endTime}\n${text}`;
  }).join('\n\n');
};
