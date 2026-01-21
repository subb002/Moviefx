
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  rating: number;
  releaseYear: number;
  languages: string[];
  isFeatured?: boolean;
}

export interface User {
  id: string;
  username: string;
  password?: string; // Added for mock/demo cross-device matching
  role: UserRole;
  isBlocked: boolean;
  canDownload: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PlaybackState {
  movieId: string;
  currentTime: number;
}
