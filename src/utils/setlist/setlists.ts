/*
 * セットリストを生成するアルゴリズム
*/

import { MatchType, Song } from '@/types/setlist';
import { songs, users } from '@/utils/data/mockData';

// グローバル変数として分類結果を保持
const classifiedSongs: Record<MatchType, Song[]> = {
  common: [],
  respect: [],
  selfDisclosure: []
};

// 即時実行関数で全曲を分類
(function classifyAllSongs() {
  const user = users[0];  // ユーザーAとする
  const otherUser = users[1];  // ユーザーBとする

  for (const song of songs) {
    const userLikesSong = user.favoriteSongs.includes(song.id);
    const otherUserLikesSong = otherUser.favoriteSongs.includes(song.id);
    const userLikesArtist = user.favoriteArtists.includes(song.artistId);
    const otherUserLikesArtist = otherUser.favoriteArtists.includes(song.artistId);

    if (isCommon(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      classifiedSongs.common.push(song);
    } else if (isRespect(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      classifiedSongs.respect.push(song);
    } else if (isSelfDisclosure(userLikesSong, otherUserLikesSong, userLikesArtist, otherUserLikesArtist)) {
      classifiedSongs.selfDisclosure.push(song);
    }
  }

  // 分類結果を表示
  //   console.log('全曲の分類結果:');
  //   Object.entries(classifiedSongs).forEach(([category, songs]) => {
  //     console.log(`\n${category.toUpperCase()}:`);
  //     songs.forEach(song => {
  //       const artist = artists.find(a => a.id === song.artistId);
  //       console.log(`- ${song.title} (${artist ? artist.name : 'Unknown Artist'})`);
  //     });
  //   }
  // );
})();

export function generateSetlist(hour: number, userId: number) {
  const songsPerHour = 6;
  const totalSongs = Math.round(hour * songsPerHour);

  const setlist: { song: Song; type: MatchType }[] = [];
  const pattern = generateFlexiblePattern(totalSongs);

  const shuffledCommon = shuffleArray([...classifiedSongs.common]);
  const shuffledRespect = shuffleArray([...classifiedSongs.respect]);
  const shuffledSelfDisclosure = shuffleArray([...classifiedSongs.selfDisclosure]);

  for (let i = 0; i < totalSongs; i++) {
    const desiredType = pattern[i];
    let selectedSong: Song | undefined;
    let actualType: MatchType = desiredType;

    switch (desiredType) {
      case 'common':
        selectedSong = shuffledCommon.pop();
        if (!selectedSong) {
          selectedSong = shuffledRespect.pop();
          if (selectedSong) {
            actualType = 'respect';
          } else {
            selectedSong = shuffledSelfDisclosure.pop();
            if (selectedSong) actualType = 'selfDisclosure';
          }
        }
        break;
      case 'respect':
        selectedSong = shuffledRespect.pop();
        if (!selectedSong) {
          selectedSong = shuffledCommon.pop();
          if (selectedSong) {
            actualType = 'common';
          } else {
            selectedSong = shuffledSelfDisclosure.pop();
            if (selectedSong) actualType = 'selfDisclosure';
          }
        }
        break;
      case 'selfDisclosure':
        selectedSong = shuffledSelfDisclosure.pop();
        if (!selectedSong) {
          selectedSong = shuffledCommon.pop();
          if (selectedSong) {
            actualType = 'common';
          } else {
            selectedSong = shuffledRespect.pop();
            if (selectedSong) actualType = 'respect';
          }
        }
        break;
    }

    if (selectedSong) {
      setlist.push({ song: selectedSong, type: actualType });
    }
  }
  return setlist;
}

// その他の関数（generateFlexiblePattern, isCommon, isRespect, isSelfDisclosure, shuffleArray）は変更なし

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