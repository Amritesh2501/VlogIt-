export interface VlogPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl?: string; // Blob URL for playback
  videoBlobId?: string; // ID for IndexedDB retrieval
  thumbnailUrl: string;
  timestamp: number;
  promptTitle: string;
  caption?: string;
  likes: number;
}

export interface DailyPrompt {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  hasVlogged: boolean;
  streak: number;
  friendCode?: string;
  lastVlogTimestamp?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  password?: string;
  avatar: string;
  streak: number;
  bio?: string;
  friendCode: string;
}