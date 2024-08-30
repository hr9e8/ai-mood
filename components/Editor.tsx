'use client';
import { updateEntry } from '@/utils/api';
import { useState, useEffect } from 'react';
import { useAutosave } from 'react-autosave';

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  useEffect(() => {
    if (entry) {
      setValue(entry.content);
      setAnalysis(entry.analysis);
    }
  }, [entry]);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      if (entry) {
        setIsLoading(true);
        const updated = await updateEntry(entry.id, _value);
        setIsLoading(false);
        if (updated && updated.analysis) {
          setAnalysis(updated.analysis);
        }
      }
    },
  });
  if (!entry) {
    return <div>Entry not found</div>;
  }

  const { mood, summary, color, subject, negative } = analysis;
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
    { name: 'Color', value: color },
  ];

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>...loading</div>}
        <textarea
          className="w-full h-full p-8 text-xl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
