import React, { useState, useEffect } from 'react';
import { SubtitleEntry, WordSelection } from '../types';
import { TranslateIcon, EditIcon, SaveIcon } from './icons';

interface SubtitleItemProps {
  entry: SubtitleEntry;
  isLoading: boolean;
  selection: WordSelection | null;
  isEditing: boolean;
  isEditingOriginal: boolean;
  onTranslate: () => void;
  onWordSelect: (word: string, type: 'original' | 'translated') => void;
  onEnterEdit: () => void;
  onSaveEdit: (newText: string) => void;
  onCancelEdit: () => void;
  onEnterEditOriginal: () => void;
  onSaveEditOriginal: (newText: string) => void;
  onCancelEditOriginal: () => void;
}

const Word: React.FC<{
    text: string;
    isSelected: boolean;
    onClick: () => void;
    isOriginal: boolean;
    isClickable: boolean;
}> = ({ text, isSelected, onClick, isOriginal, isClickable }) => {
    const selectionClass = isOriginal 
        ? 'bg-blue-500/50 hover:bg-blue-500/70' 
        : 'bg-green-500/50 hover:bg-green-500/70';
    
    const baseClasses = `transition-colors duration-150 px-1 rounded`;
    const interactiveClasses = isClickable ? `cursor-pointer ${isSelected ? selectionClass : 'hover:bg-gray-medium'}` : '';

    return (
        <span
            onClick={isClickable ? onClick : undefined}
            className={`${baseClasses} ${interactiveClasses}`}
        >
            {text}
        </span>
    );
}

const SubtitleItem: React.FC<SubtitleItemProps> = ({ 
    entry, 
    isLoading, 
    onTranslate, 
    selection, 
    onWordSelect,
    isEditing,
    onEnterEdit,
    onSaveEdit,
    onCancelEdit,
    isEditingOriginal,
    onEnterEditOriginal,
    onSaveEditOriginal,
    onCancelEditOriginal,
}) => {
  const [editText, setEditText] = useState(entry.translatedText || '');
  const [editOriginalText, setEditOriginalText] = useState(entry.originalText);

  useEffect(() => {
      setEditText(entry.translatedText || '');
  }, [entry.translatedText]);

  useEffect(() => {
    setEditOriginalText(entry.originalText);
  }, [entry.originalText]);

  const handleSave = () => onSaveEdit(editText);
  const handleSaveOriginal = () => onSaveEditOriginal(editOriginalText);
  
  const renderTextWithWords = (text: string, type: 'original' | 'translated') => {
    const isMappable = type === 'original' || (type === 'translated' && entry.isEdited);
    
    const words = text.split(/(\s+|[.,!?؟،؛])/);

    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?؟،؛]/g, '').trim();
      const isThisSelected = selection?.lineId === entry.id && selection.word === cleanWord && selection.type === type;
      const isClickable = isMappable && cleanWord.length > 0;

      return (
        <Word
            key={`${entry.id}-${type}-${index}`}
            text={word}
            isSelected={!!isThisSelected}
            onClick={() => onWordSelect(cleanWord, type)}
            isOriginal={type === 'original'}
            isClickable={isClickable}
        />
      );
    });
  };

  return (
    <div className="bg-gray-medium/30 p-4 rounded-lg flex gap-4">
      <div className="text-center font-mono text-sm text-gray-light pt-1 w-10">
        {entry.id}
      </div>
      <div className="flex-grow min-w-0">
        <div className="font-mono text-xs text-brand-light mb-2">
          {entry.startTime} → {entry.endTime}
        </div>
        <div className="bg-gray-dark p-3 rounded-md mb-2 relative group">
            {isEditingOriginal ? (
                <textarea
                    value={editOriginalText}
                    onChange={(e) => setEditOriginalText(e.target.value)}
                    dir="auto"
                    className="w-full h-20 p-3 bg-gray-dark border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg text-white"
                />
            ) : (
                <p className="text-lg text-white" dir="auto">
                    {renderTextWithWords(entry.originalText, 'original')}
                </p>
            )}
             {!entry.translatedText && !isEditingOriginal && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEnterEditOriginal} className="p-1 bg-gray-medium/50 rounded-full hover:bg-gray-medium">
                        <EditIcon className="w-4 h-4 text-white"/>
                    </button>
                </div>
             )}
        </div>
        
        {entry.translatedText ? (
            isEditing ? (
                 <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    dir="ltr"
                    className="w-full h-20 p-3 bg-gray-dark border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-primary transition duration-200 text-lg text-white"
                />
            ) : (
                <div className="bg-gray-dark p-3 rounded-md border-l-4 border-brand-primary min-h-[5.5rem] flex items-center">
                    <p className="text-lg text-white" dir="ltr">
                        {renderTextWithWords(entry.translatedText, 'translated')}
                    </p>
                </div>
            )
        ) : (
             <div className="h-14"></div>
        )}
      </div>
      <div className="w-32 flex-shrink-0 flex flex-col items-center justify-center gap-2">
        {isLoading ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isEditingOriginal ? (
            <>
                <button onClick={handleSaveOriginal} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition w-full">
                    <SaveIcon className="w-5 h-5" />
                    <span>Save</span>
                </button>
                <button onClick={onCancelEditOriginal} className="text-gray-light hover:text-white text-sm transition">Cancel</button>
            </>
        ) : entry.translatedText ? (
            isEditing ? (
                <>
                    <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition w-full">
                        <SaveIcon className="w-5 h-5" />
                        <span>Save</span>
                    </button>
                    <button onClick={onCancelEdit} className="text-gray-light hover:text-white text-sm transition">Cancel</button>
                </>
            ) : (
                <button onClick={onEnterEdit} className="flex items-center justify-center gap-2 bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-4 rounded-md transition w-full">
                    <EditIcon className="w-5 h-5" />
                    <span>Edit</span>
                </button>
            )
        ) : (
          <button
            onClick={onTranslate}
            className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md transition w-full"
          >
            <TranslateIcon className="w-5 h-5" />
            <span>Translate</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SubtitleItem;