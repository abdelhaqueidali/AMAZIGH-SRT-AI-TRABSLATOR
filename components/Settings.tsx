import React from 'react';

interface SettingsProps {
  contextLinesBefore: number;
  setContextLinesBefore: (lines: number) => void;
  contextLinesAfter: number;
  setContextLinesAfter: (lines: number) => void;
  useTranslatedContext: boolean;
  setUseTranslatedContext: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  contextLinesBefore, 
  setContextLinesBefore,
  contextLinesAfter,
  setContextLinesAfter,
  useTranslatedContext,
  setUseTranslatedContext
}) => {
  return (
    <div className="bg-gray-medium/50 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">2. Translation Settings</h2>
      <p className="mb-4 text-gray-light">Configure context window size and translation behavior.</p>
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center">
          <label htmlFor="context-before" className="mb-2 font-semibold">Context Before</label>
          <input
            id="context-before"
            type="number"
            min="0"
            max="5"
            value={contextLinesBefore}
            onChange={(e) => setContextLinesBefore(parseInt(e.target.value, 10))}
            className="w-24 text-center bg-gray-dark border border-gray-light/20 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="context-after" className="mb-2 font-semibold">Context After</label>
          <input
            id="context-after"
            type="number"
            min="0"
            max="5"
            value={contextLinesAfter}
            onChange={(e) => setContextLinesAfter(parseInt(e.target.value, 10))}
            className="w-24 text-center bg-gray-dark border border-gray-light/20 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
          />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-light/20">
        <label htmlFor="use-translated-context" className="flex items-center gap-3 cursor-pointer group">
            <input
                id="use-translated-context"
                type="checkbox"
                checked={useTranslatedContext}
                onChange={(e) => setUseTranslatedContext(e.target.checked)}
                className="h-5 w-5 rounded bg-gray-dark border-gray-light/30 text-brand-primary focus:ring-brand-primary focus:ring-offset-gray-medium focus:ring-2"
            />
            <span className="font-medium text-gray-light group-hover:text-white transition">Use translated lines for context</span>
        </label>
        <p className="text-sm text-gray-light mt-1 ml-8">When enabled, previously translated lines will be used as context, potentially improving flow.</p>
      </div>
    </div>
  );
};

export default Settings;
