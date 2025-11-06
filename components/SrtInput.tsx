import React, { useState } from 'react';

interface SrtInputProps {
  onSrtContent: (content: string) => void;
}

const SrtInput: React.FC<SrtInputProps> = ({ onSrtContent }) => {
  const [srtText, setSrtText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSrtText(content);
        setFileName(file.name);
        onSrtContent(content); // Process immediately on file upload
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSrtText(event.target.value);
  };
  
  const handleLoadSample = async () => {
    const sampleSrt = `1
00:00:01,000 --> 00:00:04,000
Hello, world. This is a sample subtitle.

2
00:00:05,500 --> 00:00:08,500
It helps you get started quickly.
`;
    setSrtText(sampleSrt);
    onSrtContent(sampleSrt);
    setFileName("sample.srt");
  }

  return (
    <div className="bg-gray-medium/50 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">1. Load SRT File</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <textarea
            value={srtText}
            onChange={handleTextChange}
            placeholder="Paste your SRT content here..."
            className="w-full h-48 bg-gray-dark border border-gray-light/20 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 text-base"
          />
        </div>
        <div className="flex flex-col justify-start items-stretch gap-2 w-full md:w-56">
           <button onClick={() => onSrtContent(srtText)} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md transition">
            Process Pasted Text
          </button>
          <label htmlFor="file-upload" className="w-full text-center bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-4 rounded-md transition cursor-pointer">
            {fileName || 'Upload .srt File'}
          </label>
          <input id="file-upload" type="file" accept=".srt" onChange={handleFileChange} className="hidden" />
           <button onClick={handleLoadSample} className="w-full bg-gray-light/20 hover:bg-gray-light/40 text-white font-semibold py-2 px-4 rounded-md transition">
            Load Sample
          </button>
        </div>
      </div>
    </div>
  );
};

export default SrtInput;