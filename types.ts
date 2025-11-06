export interface SubtitleEntry {
  id: number;
  startTime: string;
  endTime: string;
  originalText: string;
  translatedText?: string;
  isEdited?: boolean;
}

export type Dictionary = Map<string, string>;

export interface WordSelection {
  lineId: number;
  word: string;
  type: 'original' | 'translated';
}