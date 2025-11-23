import { UserProfile, VlogPost, Friend } from '../types';

const DB_NAME = 'VlogItDB';
const DB_VERSION = 1;
const STORE_MEDIA = 'media';
const KEY_USER = 'vlogit_user'; // Current active session
const KEY_USERS_DB = 'vlogit_users_db'; // "Server" database of users
const KEY_FRIENDS = 'vlogit_friends';
const KEY_POSTS = 'vlogit_posts';

// --- Directory Users (Simulated Backend for search) ---
const DIRECTORY_USERS: Friend[] = [
  { id: 'u2', name: 'Sarah J.', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sarah', hasVlogged: true, streak: 12, friendCode: 'SARAH1', lastVlogTimestamp: Date.now() },
  { id: 'u3', name: 'Mike Chen', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Mike', hasVlogged: false, streak: 5, friendCode: 'MIKE88', lastVlogTimestamp: 0 },
  { id: 'u4', name: 'Emma W.', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Emma', hasVlogged: false, streak: 28, friendCode: 'EMMA23', lastVlogTimestamp: 0 },
  { id: 'u5', name: 'David Lee', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=David', hasVlogged: true, streak: 3, friendCode: 'DAVE99', lastVlogTimestamp: Date.now() },
];

// --- IndexedDB Helpers (for Video Blobs) ---
let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA);
      }
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
  return dbPromise;
};

const storeMedia = async (id: string, file: Blob): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MEDIA, 'readwrite');
    const store = transaction.objectStore(STORE_MEDIA);
    const request = store.put(file, id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getMedia = async (id: string): Promise<Blob | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MEDIA, 'readonly');
    const store = transaction.objectStore(STORE_MEDIA);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// --- User Database Helpers ---

const getUsersDB = (): Record<string, UserProfile> => {
    const data = localStorage.getItem(KEY_USERS_DB);
    return data ? JSON.parse(data) : {};
};

const saveUsersDB = (db: Record<string, UserProfile>) => {
    localStorage.setItem(KEY_USERS_DB, JSON.stringify(db));
};

// --- Storage Service API ---

export const init = async () => {
  await initDB();
};

export const getUser = (): UserProfile | null => {
  const data = localStorage.getItem(KEY_USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
};

export const updateUser = async (updatedUser: UserProfile): Promise<void> => {
    // Update current session
    saveUser(updatedUser);
    
    // Update DB
    const db = getUsersDB();
    // Try to find the user in the DB by email or ID
    let foundKey: string | undefined;
    
    if (updatedUser.email && db[updatedUser.email]) {
        foundKey = updatedUser.email;
    } else {
        foundKey = Object.keys(db).find(key => db[key].id === updatedUser.id);
    }

    if(foundKey) {
        db[foundKey] = updatedUser;
        saveUsersDB(db);
    }
};

// New: Register with Email/Password
export const registerUser = async (email: string, password: string, name: string): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const db = getUsersDB();
    if (db[email]) {
        throw new Error("User already exists");
    }

    const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name,
        email: email,
        password: password, // In a real app, hash this!
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${name}`,
        streak: 0,
        bio: 'Just vibing.',
        friendCode: `VLOG${Math.floor(1000 + Math.random() * 9000)}`
    };

    db[email] = newUser;
    saveUsersDB(db);
    saveUser(newUser); // Set as current active session
    saveFriends([]); // Start with 0 friends for this new user
    return newUser;
};

// New: Login with Email/Password
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 800));

    const db = getUsersDB();
    const user = db[email];

    if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
    }

    saveUser(user);
    // In a real app, we would fetch friends associated with this ID. 
    // For this demo, we'll keep the local friends list simple or reset it if needed.
    return user;
};

// New: Google Login Simulation
export const loginWithGoogle = async (): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate a Google User
    const googleEmail = "google_user@gmail.com";
    const db = getUsersDB();
    
    let user = db[googleEmail];
    
    if (!user) {
        user = {
            id: `user_google_${Date.now()}`,
            name: "Google User",
            email: googleEmail,
            avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=GoogleUser`,
            streak: 0,
            bio: 'Vlogging via Google',
            friendCode: `G${Math.floor(1000 + Math.random() * 9000)}`
        };
        db[googleEmail] = user;
        saveUsersDB(db);
    }
    
    saveUser(user);
    return user;
};

export const getFriends = (): Friend[] => {
  const data = localStorage.getItem(KEY_FRIENDS);
  return data ? JSON.parse(data) : [];
};

export const saveFriends = (friends: Friend[]) => {
  localStorage.setItem(KEY_FRIENDS, JSON.stringify(friends));
};

export const addFriendByCode = async (code: string): Promise<Friend> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const found = DIRECTORY_USERS.find(u => u.friendCode === code.toUpperCase());
  if (!found) {
    throw new Error('User not found');
  }

  const currentFriends = getFriends();
  if (currentFriends.some(f => f.id === found.id)) {
    throw new Error('Already friends');
  }

  const newFriends = [...currentFriends, found];
  saveFriends(newFriends);
  return found;
};

export const getPosts = async (): Promise<VlogPost[]> => {
  const data = localStorage.getItem(KEY_POSTS);
  const posts: VlogPost[] = data ? JSON.parse(data) : [];

  const hydratedPosts = await Promise.all(posts.map(async (post) => {
    if (post.videoBlobId && !post.videoUrl) {
      const blob = await getMedia(post.videoBlobId);
      if (blob) {
        return { ...post, videoUrl: URL.createObjectURL(blob) };
      }
    }
    return post;
  }));

  return hydratedPosts.sort((a, b) => b.timestamp - a.timestamp);
};

export const savePost = async (post: VlogPost, file: File) => {
  const blobId = `vid_${post.id}`;
  await storeMedia(blobId, file);

  const postToSave = {
    ...post,
    videoBlobId: blobId,
    videoUrl: undefined 
  };

  const data = localStorage.getItem(KEY_POSTS);
  const currentPosts: VlogPost[] = data ? JSON.parse(data) : [];
  localStorage.setItem(KEY_POSTS, JSON.stringify([postToSave, ...currentPosts]));
  
  const user = getUser();
  if (user) {
    const lastPost = currentPosts[0];
    const isNewDay = !lastPost || new Date(lastPost.timestamp).getDate() !== new Date().getDate();
    if (isNewDay) {
        user.streak += 1;
        saveUser(user);
    }
  }
};