import React from 'react';

type SetlistGeneratorProps = {
  hour: number;
  setHour: (hour: number) => void;
  onGenerate: () => void;
  setlistLength: number;
};

const SetlistGenerator: React.FC<SetlistGeneratorProps> = ({ hour, setHour, onGenerate, setlistLength }) => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center">
        <label htmlFor="hour" className="mr-2">利用時間:</label>
        <input
          id="hour"
          type="range"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          min="0.5"
          max="6"
          step="0.5"
          className="w-30"
        />
        <span className="w-20 text-right">{hour.toFixed(1)} 時間</span>
      </div>
      <button
        onClick={onGenerate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {setlistLength > 0 ? 'セットリストを再生成' : 'セットリストを生成'}
      </button>
    </div>
  );
};

export default SetlistGenerator;