import React, { useState, useCallback } from 'react';
import SrtInput from './components/SrtInput';
import Settings from './components/Settings';
import DictionaryView from './components/DictionaryView';
import TranslationView from './components/TranslationView';
import { SubtitleEntry, Dictionary, WordSelection } from './types';
import { parseSrt } from './services/srtParser';
import { buildSrt } from './services/srtBuilder';
import { detectLanguage, translateText } from './services/geminiService';

function App() {
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [contextLinesBefore, setContextLinesBefore] = useState(2);
  const [contextLinesAfter, setContextLinesAfter] = useState(2);
  const [dictionary, setDictionary] = useState<Dictionary>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<number, boolean>>(new Map());
  const [selection, setSelection] = useState<WordSelection | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingOriginalId, setEditingOriginalId] = useState<number | null>(null);
  const [useTranslatedContext, setUseTranslatedContext] = useState(true);

  const handleSrtContent = useCallback(async (content: string) => {
    if (!content.trim()) {
        setSubtitles([]);
        setSourceLanguage('');
        return;
    }
    const parsedSubtitles = parseSrt(content);
    setSubtitles(parsedSubtitles);
    if (parsedSubtitles.length > 0) {
      const sampleText = parsedSubtitles.slice(0, 5).map(s => s.originalText).join(' ');
      const lang = await detectLanguage(sampleText);
      setSourceLanguage(lang);
    } else {
      setSourceLanguage('');
    }
  }, []);

  const handleTranslate = useCallback(async (index: number) => {
    const entry = subtitles[index];
    if (!entry) return;

    setLoadingStates(prev => new Map(prev).set(entry.id, true));

    const contextMapper = (s: SubtitleEntry) => 
        useTranslatedContext ? (s.translatedText || s.originalText) : s.originalText;

    const contextBefore = subtitles
      .slice(Math.max(0, index - contextLinesBefore), index)
      .map(contextMapper);
    
    const contextAfter = subtitles
      .slice(index + 1, index + 1 + contextLinesAfter)
      .map(contextMapper);

    try {
      const translated = await translateText(
        entry.originalText,
        contextBefore,
        contextAfter,
        dictionary,
        sourceLanguage
      );

      setSubtitles(prev => 
        prev.map(s => s.id === entry.id ? { ...s, translatedText: translated, isEdited: false } : s)
      );
    } catch (error) {
      console.error(`Failed to translate line ${entry.id}:`, error);
    } finally {
      setLoadingStates(prev => new Map(prev).set(entry.id, false));
    }
  }, [subtitles, contextLinesBefore, contextLinesAfter, dictionary, sourceLanguage, useTranslatedContext]);
  
  const handleWordSelect = (lineId: number, cleanWord: string, type: 'original' | 'translated') => {
    if (!cleanWord) {
      setSelection(null);
      return;
    }

    if (!selection || selection.type === type) {
      setSelection({ lineId, word: cleanWord, type });
      return;
    }

    if (selection.lineId !== lineId) {
       setSelection({ lineId, word: cleanWord, type });
       return;
    }

    // We have a pair
    const originalWord = type === 'original' ? cleanWord : selection.word;
    const translatedWord = type === 'translated' ? cleanWord : selection.word;
    
    setDictionary(prev => new Map(prev).set(originalWord, translatedWord));
    setSelection(null);
  };

  const handleSaveEdit = (id: number, newText: string) => {
    setSubtitles(prev => prev.map(s => s.id === id ? { ...s, translatedText: newText, isEdited: true } : s));
    setEditingId(null);
  };

  const handleSaveEditOriginal = (id: number, newText: string) => {
    setSubtitles(prev => prev.map(s => s.id === id ? { ...s, originalText: newText } : s));
    setEditingOriginalId(null);
  }

  const handleExport = (type: 'translated' | 'original') => {
    const content = buildSrt(subtitles, type);
    const blob = new Blob([content], { type: 'text/srt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleExportDictionary = () => {
    const obj = Object.fromEntries(dictionary);
    const content = JSON.stringify(obj, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dictionary.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportDictionary = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const obj = JSON.parse(text);
        if (typeof obj !== 'object' || obj === null) throw new Error("Invalid JSON format");

        if (window.confirm("This will replace your current dictionary. Continue?")) {
            const newDictionary = new Map(Object.entries(obj));
            setDictionary(newDictionary);
        }
      } catch (error) {
        alert("Failed to import dictionary. Please ensure it's a valid JSON file.");
        console.error("Dictionary import error:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-dark min-h-screen text-gray-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SRT Translator</h1>
          <p className="text-lg text-brand-light">Translate subtitles to Amazigh with AI assistance and a custom dictionary.</p>
        </header>

        <main className="space-y-6">
          <SrtInput onSrtContent={handleSrtContent} />
          {subtitles.length > 0 && (
            <>
              <Settings
                contextLinesBefore={contextLinesBefore}
                setContextLinesBefore={setContextLinesBefore}
                contextLinesAfter={contextLinesAfter}
                setContextLinesAfter={setContextLinesAfter}
                useTranslatedContext={useTranslatedContext}
                setUseTranslatedContext={setUseTranslatedContext}
              />
              <DictionaryView 
                dictionary={dictionary} 
                onDictionaryUpdate={setDictionary}
                onImportDictionary={handleImportDictionary}
                onExportDictionary={handleExportDictionary}
                sourceLanguage={sourceLanguage}
              />
              <TranslationView
                subtitles={subtitles}
                loadingStates={loadingStates}
                onTranslate={handleTranslate}
                selection={selection}
                onWordSelect={handleWordSelect}
                editingId={editingId}
                onEnterEdit={setEditingId}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingId(null)}
                editingOriginalId={editingOriginalId}
                onEnterEditOriginal={setEditingOriginalId}
                onSaveEditOriginal={handleSaveEditOriginal}
                onCancelEditOriginal={() => setEditingOriginalId(null)}
                onExportTranslated={() => handleExport('translated')}
                onExportSource={() => handleExport('original')}
              />
            </>
          )}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-medium">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
