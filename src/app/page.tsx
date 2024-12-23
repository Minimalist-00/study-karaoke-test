'use client';

import Footer from '@/components/Footer';
import SetlistDisplay from '@/components/SetlistDisplay';
import SetlistGenerator from '@/components/SetlistGenerator';
import { SetlistItem } from '@/types/setlist';
import { generateSetlist } from '@/utils/setlist/setlists';
import { useState } from 'react';

export default function Home() {
  const [setlist, setSetlist] = useState<SetlistItem[]>([]);
  const [hour, setHour] = useState<number>(2);

  const handleGenerateSetlist = () => {
    const userId = 1;
    const newSetlist = generateSetlist(hour, userId);
    setSetlist(newSetlist);
  };

  return (
    <main className="flex min-h-screen flex-col items-center pb-10">
      <h1 className="text-4xl font-bold mb-8">karaoke Recommend</h1>
      <SetlistGenerator
        hour={hour}
        setHour={setHour}
        onGenerate={handleGenerateSetlist}
        setlistLength={setlist.length}
      />
      {setlist.length > 0 && <SetlistDisplay setlist={setlist} />}
      <Footer />
    </main>
  );
}