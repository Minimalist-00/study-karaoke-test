export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: {
    images: {
      url: string;
    }[];
  };
}