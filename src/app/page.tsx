'use client';

import { generateSetlist } from '@/utils/setlist/setlists';
import { useState } from 'react';

export default function Home() {
  const [setlist, setSetlist] = useState<any[]>([]);

  const handleGenerateSetlist = () => {
    const hour = 2; // 利用時間を指定
    const userId = 1; // ユーザーAを明示的に指定
    const newSetlist = generateSetlist(hour, userId);
    setSetlist(newSetlist);
    console.log('Generated Setlist:', newSetlist);
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-6">
      <h1 className="text-4xl font-bold mb-8">karaoke setlist</h1>
      <button
        onClick={handleGenerateSetlist}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {setlist.length > 0 ? 'セットリストを再生成' : 'セットリストを生成'}
      </button>
      {setlist.length > 0 && (
        <div>
          <ul>
            {setlist.map((song, index) => (
              <li key={index} className="mb-2">
                {index + 1}. {song.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}