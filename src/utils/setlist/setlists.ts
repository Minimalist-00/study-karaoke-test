/*
 * セットリストを生成するアルゴリズム
*/

import { songs, users } from '@/utils/data/mockData';

type Song = {
  id: number;
  title: string;
  artistId: number;
};

type MatchType = 'common' | 'respect' | 'selfDisclosure';

export function generateSetlist(hour: number, userId: number) {
  const songsPerHour = 6; // 1時間あたりの曲数
  const totalSongs = Math.round(hour * songsPerHour);

  const user = users.find(u => u.id === userId);
  const otherUser = users.find(u => u.id !== userId);

  if (!user || !otherUser) {
    throw new Error('User not found');
  }

  const commonSongs = findMatchingSongs(user, otherUser, 'common');
  const respectSongs = findMatchingSongs(user, otherUser, 'respect');
  const selfDisclosureSongs = findMatchingSongs(user, otherUser, 'selfDisclosure');

  const setlist: { song: Song; type: MatchType }[] = [];
  const pattern = generateFlexiblePattern(totalSongs);

  for (let i = 0; i < totalSongs; i++) {
    const matchType = pattern[i];
    let selectedSong: Song | undefined;

    switch (matchType) {
      case 'common':
        selectedSong = commonSongs.pop();
        if (!selectedSong) selectedSong = respectSongs.pop() || selfDisclosureSongs.pop();
        break;
      case 'respect':
        selectedSong = respectSongs.pop();
        if (!selectedSong) selectedSong = commonSongs.pop() || selfDisclosureSongs.pop();
        break;
      case 'selfDisclosure':
        selectedSong = selfDisclosureSongs.pop();
        if (!selectedSong) selectedSong = commonSongs.pop() || respectSongs.pop();
        break;
    }

    if (selectedSong) {
      setlist.push({ song: selectedSong, type: matchType });
    }
  }

  return setlist;
}

function generateFlexiblePattern(totalSongs: number): MatchType[] {
  const pattern: MatchType[] = [];
  let commonCount = 0;
  let respectCount = 0;
  let selfDisclosureCount = 0;

  for (let i = 0; i < totalSongs; i++) {
    const totalCount = commonCount + respectCount + selfDisclosureCount;
    const commonRatio = commonCount / totalCount || 0;
    const respectRatio = respectCount / totalCount || 0;
    const selfDisclosureRatio = selfDisclosureCount / totalCount || 0;

    let nextType: MatchType;

    if (i < 3 || i === totalSongs - 1) {
      // 最初の3曲は必ず 'common'
      nextType = 'common';
    } else if (commonRatio < 0.5) {
      // 'common' の割合が50%未満の場合、'common' を優先
      nextType = 'common';
    } else if (respectRatio < 0.2) {
      // 'respect' の割合が20%未満の場合、'respect' を優先
      nextType = 'respect';
    } else if (selfDisclosureRatio < 0.2) {
      // 'selfDisclosure' の割合が20%未満の場合、'selfDisclosure' を優先
      nextType = 'selfDisclosure';
    } else {
      // それ以外の場合、ランダムに選択（ただし、同じタイプが3回連続しないようにする）
      const lastTwo = pattern.slice(-2);
      const availableTypes = ['common', 'respect', 'selfDisclosure'].filter(
        type => !lastTwo.every(t => t === type)
      ) as MatchType[];
      nextType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }

    pattern.push(nextType);

    switch (nextType) {
      case 'common':
        commonCount++;
        break;
      case 'respect':
        respectCount++;
        break;
      case 'selfDisclosure':
        selfDisclosureCount++;
        break;
    }
  }

  return pattern;
}

function findMatchingSongs(user: typeof users[0], otherUser: typeof users[0], matchType: MatchType): Song[] {
  const matchingSongs: Song[] = [];

  for (const song of songs) {
    const userLikesSong = user.favoriteSongs.includes(song.id);
    const otherUserLikesSong = otherUser.favoriteSongs.includes(song.id);
    const userLikesArtist = user.favoriteArtists.includes(song.artistId);
    const otherUserLikesArtist = otherUser.favoriteArtists.includes(song.artistId);

    if (matchType === 'common' && isCommon(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      matchingSongs.push(song);
    } else if (matchType === 'respect' && isRespect(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      matchingSongs.push(song);
    } else if (matchType === 'selfDisclosure' && isSelfDisclosure(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      matchingSongs.push(song);
    }
  }

  return shuffleArray(matchingSongs);
}

function isCommon(userLikesSong: boolean, otherUserLikesSong: boolean, userLikesArtist: boolean, otherUserLikesArtist: boolean): boolean {
  return (
    (userLikesSong && otherUserLikesSong) ||
    (userLikesSong && otherUserLikesSong && userLikesArtist && otherUserLikesArtist) ||
    (userLikesSong && otherUserLikesSong && userLikesArtist && !otherUserLikesArtist) ||
    (userLikesSong && otherUserLikesSong && !userLikesArtist && otherUserLikesArtist) ||
    (userLikesSong && otherUserLikesSong && !userLikesArtist && !otherUserLikesArtist)
  );
}

function isRespect(userLikesSong: boolean, otherUserLikesSong: boolean, userLikesArtist: boolean, otherUserLikesArtist: boolean): boolean {
  return (
    (!userLikesSong && otherUserLikesSong && userLikesArtist && otherUserLikesArtist) ||
    (!userLikesSong && otherUserLikesSong && !userLikesArtist && otherUserLikesArtist) ||
    (!userLikesSong && otherUserLikesSong && userLikesArtist && !otherUserLikesArtist) ||
    (!userLikesSong && otherUserLikesSong && !userLikesArtist && !otherUserLikesArtist) ||
    (userLikesSong && otherUserLikesSong && !userLikesArtist && otherUserLikesArtist) ||
    (!userLikesSong && !otherUserLikesSong && !userLikesArtist && otherUserLikesArtist)
  );
}

function isSelfDisclosure(userLikesSong: boolean, otherUserLikesSong: boolean, userLikesArtist: boolean, otherUserLikesArtist: boolean): boolean {
  return (
    (userLikesSong && !otherUserLikesSong && userLikesArtist && otherUserLikesArtist) ||
    (userLikesSong && otherUserLikesSong && userLikesArtist && !otherUserLikesArtist) ||
    (userLikesSong && !otherUserLikesSong && !userLikesArtist && otherUserLikesArtist) ||
    (userLikesSong && !otherUserLikesSong && userLikesArtist && !otherUserLikesArtist) ||
    (userLikesSong && !otherUserLikesSong && !userLikesArtist && !otherUserLikesArtist) ||
    (!userLikesSong && !otherUserLikesSong && userLikesArtist && !otherUserLikesArtist)
  );
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}