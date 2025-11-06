import React from 'react';
import { SubtitleEntry, WordSelection } from '../types';
import SubtitleItem from './SubtitleItem';
import { DownloadIcon } from './icons';

interface TranslationViewProps {
  subtitles: SubtitleEntry[];
  loadingStates: Map<number, boolean>;
  selection: WordSelection | null;
  editingId: number | null;
  editingOriginalId: number | null;
  onTranslate: (index: number) => void;
  onWordSelect: (lineId: number, word: string, type: 'original' | 'translated') => void;
  onEnterEdit: (id: number) => void;
  onSaveEdit: (id: number, newText: string) => void;
  onCancelEdit: () => void;
  onEnterEditOriginal: (id: number) => void;
  onSaveEditOriginal: (id: number, newText: string) => void;
  onCancelEditOriginal: () => void;
  onExportTranslated: () => void;
  onExportSource: () => void;
}

const TranslationView: React.FC<TranslationViewProps> = ({ 
    subtitles, 
    loadingStates, 
    onTranslate, 
    selection, 
    onWordSelect,
    editingId,
    onEnterEdit,
    onSaveEdit,
    onCancelEdit,
    editingOriginalId,
    onEnterEditOriginal,
    onSaveEditOriginal,
    onCancelEditOriginal,
    onExportTranslated,
    onExportSource,
}) => {
  if (subtitles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-medium/50 rounded-lg p-4">
       <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
            <div >
                <h2 className="text-xl font-bold text-white">4. Translate & Refine</h2>
                <p className="text-gray-light text-sm">After translating, click 'Edit' to refine. Once saved, click words to add them to the dictionary.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={onExportSource}
                    className="flex items-center gap-2 bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Export Source SRT</span>
                </button>
                <button 
                    onClick={onExportTranslated}
                    className="flex items-center gap-2 bg-brand-primary/80 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Export Translated SRT</span>
                </button>
            </div>
       </div>
      <div className="space-y-4">
        {subtitles.map((entry, index) => (
          <SubtitleItem
            key={entry.id}
            entry={entry}
            isLoading={loadingStates.get(entry.id) || false}
            isEditing={editingId === entry.id}
            isEditingOriginal={editingOriginalId === entry.id}
            onTranslate={() => onTranslate(index)}
            selection={selection}
            onWordSelect={(word, type) => onWordSelect(entry.id, word, type)}
            onEnterEdit={() => onEnterEdit(entry.id)}
            onSaveEdit={(newText) => onSaveEdit(entry.id, newText)}
            onCancelEdit={onCancelEdit}
            onEnterEditOriginal={() => onEnterEditOriginal(entry.id)}
            onSaveEditOriginal={(newText) => onSaveEditOriginal(entry.id, newText)}
            onCancelEditOriginal={onCancelEditOriginal}
          />
        ))}
      </div>
    </div>
  );
};

export default TranslationView;