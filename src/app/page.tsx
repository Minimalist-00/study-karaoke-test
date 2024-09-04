'use client';

import { artists } from '@/utils/data/mockData';
import { generateSetlist } from '@/utils/setlist/setlists';
import { useState } from 'react';

type SetlistItem = {
  song: {
    id: number;
    title: string;
    artistId: number;
  };
  type: 'common' | 'respect' | 'selfDisclosure';
};

export default function Home() {
  const [setlist, setSetlist] = useState<SetlistItem[]>([]);
  const [hour, setHour] = useState<number>(2); // デフォルトを2時間に設定

  const handleGenerateSetlist = () => {
    const userId = 1; // ユーザーAを明示的に指定
    const newSetlist = generateSetlist(hour, userId);
    setSetlist(newSetlist);
    console.log('Generated Setlist:', newSetlist);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'common':
        return '共通';
      case 'respect':
        return '尊重';
      case 'selfDisclosure':
        return '自己開示';
      default:
        return '';
    }
  };

  const getArtistName = (artistId: number) => {
    const artist = artists.find(a => a.id === artistId);
    return artist ? artist.name : 'Unknown Artist';
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">karaoke setlist</h1>
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
        onClick={handleGenerateSetlist}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {setlist.length > 0 ? 'セットリストを再生成' : 'セットリストを生成'}
      </button>
      {setlist.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">セットリスト ({setlist.length} 曲)</h2>
          <ul className="space-y-2">
            {setlist.map((item, index) => (
              <li key={index} className="border-b pb-2">
                <span className="font-bold">{index + 1}.</span>{' '}
                <span className="font-semibold">{item.song.title}</span>{' '}
                <span className="text-gray-600">- {getArtistName(item.song.artistId)}</span>{' '}
                <span className={`font-bold ${item.type === 'common' ? 'text-green-600' :
                  item.type === 'respect' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                  ({getTypeLabel(item.type)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}