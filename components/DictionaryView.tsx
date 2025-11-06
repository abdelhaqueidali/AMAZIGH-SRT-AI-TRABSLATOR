import React, { useState } from 'react';
import { Dictionary } from '../types';
import { TrashIcon, PlusIcon, DownloadIcon, ImportIcon } from './icons';

interface DictionaryViewProps {
  dictionary: Dictionary;
  onDictionaryUpdate: (newDictionary: Dictionary) => void;
  onImportDictionary: (file: File) => void;
  onExportDictionary: () => void;
  sourceLanguage: string;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ dictionary, onDictionaryUpdate, onImportDictionary, onExportDictionary, sourceLanguage }) => {
  const [sourceWord, setSourceWord] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceWord.trim() && translatedWord.trim()) {
      const newDictionary = new Map(dictionary);
      newDictionary.set(sourceWord.trim(), translatedWord.trim());
      onDictionaryUpdate(newDictionary);
      setSourceWord('');
      setTranslatedWord('');
    }
  };

  const handleRemoveEntry = (key: string) => {
    const newDictionary = new Map(dictionary);
    newDictionary.delete(key);
    onDictionaryUpdate(newDictionary);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportDictionary(file);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="bg-gray-medium/50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">3. Custom Dictionary</h2>
        <div className="flex gap-2">
            <label htmlFor="import-dict" className="flex items-center gap-2 bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-3 rounded-md transition cursor-pointer text-sm">
                <ImportIcon className="w-4 h-4" />
                <span>Import</span>
                <input id="import-dict" type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
             <button onClick={onExportDictionary} className="flex items-center gap-2 bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-3 rounded-md transition text-sm">
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
            </button>
        </div>
      </div>
      <p className="mb-4 text-gray-light text-sm">Add specific translations or click words in the translation view to create pairs.</p>
      
      <form onSubmit={handleAddEntry} className="flex gap-4 mb-4 items-end">
        <div className="flex-grow">
          <label htmlFor="source-word" className="block text-sm font-medium mb-1">{sourceLanguage || 'Source'}</label>
          <input
            id="source-word"
            type="text"
            value={sourceWord}
            onChange={(e) => setSourceWord(e.target.value)}
            className="w-full bg-gray-dark border border-gray-light/20 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            placeholder="e.g., house"
          />
        </div>
        <div className="text-2xl pb-2">→</div>
        <div className="flex-grow">
          <label htmlFor="translated-word" className="block text-sm font-medium mb-1">Amazigh (Tifinagh)</label>
          <input
            id="translated-word"
            type="text"
            dir="ltr"
            value={translatedWord}
            onChange={(e) => setTranslatedWord(e.target.value)}
            className="w-full bg-gray-dark border border-gray-light/20 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            placeholder="e.g., ⵜⵉⴳⵎⵎⵉ"
          />
        </div>
        <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold p-2.5 rounded-md transition h-10">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>

      <div className="max-h-60 overflow-y-auto pr-2">
        {Array.from(dictionary.entries()).length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-light/20">
                <th className="py-2 pr-2 font-semibold">{sourceLanguage || 'Source'}</th>
                <th className="py-2 px-2 font-semibold">Amazigh (Tifinagh)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(dictionary.entries()).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-light/10">
                  <td className="py-2 pr-2">{key}</td>
                  <td className="py-2 px-2" dir="ltr">{value}</td>
                  <td>
                    <button onClick={() => handleRemoveEntry(key)} className="p-1 text-gray-light hover:text-red-500 transition">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-light py-4">Your dictionary is empty.</p>
        )}
      </div>
    </div>
  );
};

export default DictionaryView;