export type Song = {
  id: number;
  title: string;
  artistId: number;
};

export type MatchType = 'common' | 'respect' | 'selfDisclosure';

export type SetlistItem = {
  song: {
    id: number;
    title: string;
    artistId: number;
  };
  type: 'common' | 'respect' | 'selfDisclosure';
};

export type SetlistDisplayProps = {
  setlist: SetlistItem[];
};

export type SetlistGeneratorProps = {
  hour: number;
  setHour: (hour: number) => void;
  onGenerate: () => void;
  setlistLength: number;
};
