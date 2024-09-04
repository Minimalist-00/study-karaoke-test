import { artists } from '@/utils/data/mockData';
import React from 'react';

type SetlistItem = {
  song: {
    id: number;
    title: string;
    artistId: number;
  };
  type: 'common' | 'respect' | 'selfDisclosure';
};

type SetlistDisplayProps = {
  setlist: SetlistItem[];
};

const SetlistDisplay: React.FC<SetlistDisplayProps> = ({ setlist }) => {
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
  );
};

export default SetlistDisplay;