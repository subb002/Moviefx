
import { Movie, User, UserRole } from './types';

export const CATEGORIES = [
  'Trending Now',
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Horror',
  'Documentary'
];

export const DUMMY_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'The Cyber Frontier',
    description: 'In a world dominated by AI, one hacker must choose between freedom and the ultimate digital paradise.',
    category: 'Sci-Fi',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '2h 15m',
    rating: 8.5,
    releaseYear: 2024,
    languages: ['English', 'Telugu', 'Spanish', 'Hindi'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Echoes of Silence',
    description: 'A psychological thriller about a detective who can hear the whispers of the past in abandoned buildings.',
    category: 'Drama',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1h 48m',
    rating: 7.9,
    releaseYear: 2023,
    languages: ['English', 'French', 'Telugu'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Urban Chase',
    description: 'Adrenaline-fueled heist across the neon-lit streets of Neo-Tokyo.',
    category: 'Action',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '1h 55m',
    rating: 8.2,
    releaseYear: 2024,
    languages: ['Japanese', 'English', 'Telugu'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'The Laugh Factory',
    description: 'A struggling stand-up comedian accidentally becomes the leader of a small underground revolution.',
    category: 'Comedy',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1h 30m',
    rating: 7.5,
    releaseYear: 2024,
    languages: ['English', 'Hindi'],
    isFeatured: false
  },
  {
    id: '5',
    title: 'Laugh Out Loud',
    description: 'Four friends embark on a road trip where everything that can go wrong, does go wrong, hilariously.',
    category: 'Comedy',
    thumbnail: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '1h 45m',
    rating: 7.2,
    releaseYear: 2023,
    languages: ['English', 'Telugu'],
    isFeatured: false
  }
];

export const DUMMY_USERS: User[] = [
  {
    id: 'u1',
    username: 'john_doe',
    role: UserRole.USER,
    isBlocked: false,
    canDownload: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'u2',
    username: 'admin',
    role: UserRole.ADMIN,
    isBlocked: false,
    canDownload: true,
    createdAt: '2023-12-01'
  }
];
