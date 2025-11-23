import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Feed } from './components/Feed';
import { Profile } from './components/Profile';
import { UploadOverlay } from './components/UploadOverlay';
import { FriendsView } from './components/FriendsView';
import { Settings } from './components/Settings';
import { Splash } from './components/Splash';
import { Auth } from './components/Auth';
import { generateDailyPrompt, generateAIComment } from './services/geminiService';
import * as storage from './services/storage';
import { DailyPrompt, Friend, VlogPost, UserProfile } from './types';
import { Home, Film, Bell, Plus, Users, Settings as SettingsIcon, Loader2 } from 'lucide-react';

type ViewState = 'home' | 'feed' | 'friends' | 'settings' | 'profile';
type AppState = 'splash' | 'auth' | 'app';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [view, setView] = useState<ViewState>('home');
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [posts, setPosts] = useState<VlogPost[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize Data *after* Auth or during load if already authed
  const loadAppData = async (user: UserProfile) => {
    setCurrentUser(user);
    
    // Load Friends & Posts
    const loadedFriends = storage.getFriends();
    const loadedPosts = await storage.getPosts();
    setFriends(loadedFriends);
    setPosts(loadedPosts);

    // AI Prompt
    try {
        const initialPrompt = await generateDailyPrompt();
        setPrompt(initialPrompt);
    } catch (e) {
        console.error("Failed to fetch prompt");
    }
    
    setAppState('app');
  };

  const handleSplashComplete = async () => {
    await storage.init();
    const user = storage.getUser();
    if (user) {
        await loadAppData(user);
    } else {
        setAppState('auth');
    }
  };

  const handleAuthSuccess = async (user: UserProfile) => {
      await loadAppData(user);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    await storage.updateUser(updatedUser);
    setCurrentUser(updatedUser);
    showNotification("Profile updated!");
  };

  const handleUpload = async (file: File) => {
     if (!currentUser) return;

     // Create optimistic post
     const newPost: VlogPost = {
         id: Math.random().toString(36).substr(2, 9),
         userId: currentUser.id,
         userName: currentUser.name,
         userAvatar: currentUser.avatar,
         thumbnailUrl: URL.createObjectURL(file), // Using video as thumb for now
         timestamp: Date.now(),
         promptTitle: prompt?.title || 'Daily Vlog',
         likes: 0,
         caption: 'Just uploaded!',
         videoUrl: URL.createObjectURL(file) // Optimistic URL
     };
     
     // Update UI immediately
     setPosts([newPost, ...posts]);
     setView('feed'); 
     
     // Save to DB
     await storage.savePost(newPost, file);
     
     // AI Interaction
     if (prompt?.title) {
        const comment = await generateAIComment(prompt.title);
        showNotification(comment);
     }
  };

  const handleAddFriend = async (code: string) => {
    try {
        const newFriend = await storage.addFriendByCode(code);
        setFriends([...friends, newFriend]);
        showNotification(`Added ${newFriend.name}!`);
    } catch (e: any) {
        showNotification(e.message || "Failed to add friend");
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const NavButton = ({ target, icon: Icon }: { target: ViewState; icon: any }) => (
    <button 
        onClick={() => setView(target)}
        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
            view === target 
            ? 'text-lime-400' 
            : 'text-zinc-500 hover:text-white'
        }`}
    >
        <Icon size={26} strokeWidth={view === target ? 2.5 : 2} />
    </button>
  );

  // --- RENDER STATES ---

  if (appState === 'splash') {
      return <Splash onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
      return <Auth onLogin={handleAuthSuccess} />;
  }

  if (!currentUser) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <Loader2 className="animate-spin text-lime-400" size={40} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-lime-400 selection:text-black flex flex-col">
      
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-40 bg-black/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center left-0 right-0">
         <button onClick={() => setView('profile')} className="group flex items-center gap-3">
             <img src={currentUser.avatar} className="w-9 h-9 rounded-full border border-zinc-700 object-cover" alt="Me" />
             <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{currentUser.name}</span>
         </button>
         
         <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-zinc-900 rounded-full transition-colors">
                <Bell size={24} className="text-zinc-400 hover:text-white transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-400 rounded-full border border-black"></span>
            </button>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-28 px-4 w-full mx-auto max-w-xl relative">
        {notification && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 text-white px-5 py-3 rounded-2xl font-bold shadow-2xl animate-fade-in-down flex items-center gap-3 w-max max-w-[90%]">
                <span className="w-2 h-2 bg-lime-400 rounded-full shrink-0"></span>
                <span className="truncate text-sm">{notification}</span>
            </div>
        )}

        <div className="transition-opacity duration-300">
            {view === 'home' && (
                <Dashboard 
                    prompt={prompt} 
                    setPrompt={setPrompt} 
                    friends={friends} 
                    onOpenCamera={() => setIsUploadOpen(true)}
                />
            )}
            
            {view === 'friends' && (
                <FriendsView 
                    friends={friends}
                    userCode={currentUser.friendCode}
                    onAddFriend={handleAddFriend}
                />
            )}
            
            {view === 'feed' && (
                <Feed posts={posts} />
            )}

            {view === 'settings' && (
                <Settings 
                    user={currentUser} 
                    onUpdateUser={handleUpdateUser} 
                />
            )}

            {view === 'profile' && (
                <Profile 
                    user={currentUser} 
                    posts={posts.filter(p => p.userId === currentUser.id)} 
                />
            )}
        </div>
      </main>

      {/* Full Width Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-zinc-900 pb-safe">
        <nav className="flex items-center justify-between px-6 py-2 w-full max-w-xl mx-auto">
            <NavButton target="home" icon={Home} />
            <NavButton target="friends" icon={Users} />
            
            <button 
                onClick={() => setIsUploadOpen(true)}
                className="mb-1 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            <NavButton target="feed" icon={Film} />
            <NavButton target="settings" icon={SettingsIcon} />
        </nav>
      </div>

      <UploadOverlay 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUpload={handleUpload}
        promptTitle={prompt?.title || 'Daily Vlog'}
      />
    </div>
  );
};

export default App;