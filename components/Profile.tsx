import React from 'react';
import { VlogPost, UserProfile } from '../types';
import { Grid, Flame, Heart } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  posts: VlogPost[];
}

export const Profile: React.FC<ProfileProps> = ({ user, posts }) => {
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0);

  return (
    <div className="flex flex-col pt-4 animate-in fade-in duration-500">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
           <div className="relative mb-5 group">
              <div className="absolute inset-0 bg-lime-400 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-zinc-800 to-black border border-zinc-800">
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 bg-zinc-900 text-lime-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-zinc-700">
                  LVL {Math.floor(user.streak / 5) + 1}
              </div>
           </div>
           
           <h2 className="text-2xl font-black text-white tracking-tight mb-2">{user.name}</h2>
           <p className="text-zinc-500 text-sm font-medium max-w-[250px] leading-relaxed mb-6">{user.bio || "No bio yet."}</p>

           {/* Stats Cards */}
           <div className="grid grid-cols-3 gap-3 w-full max-w-sm px-2">
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{posts.length}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Vlogs</span>
              </div>
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-lime-400/5"></div>
                  <span className="text-2xl font-black text-lime-400 flex items-center gap-1.5">
                      {user.streak} <Flame size={16} fill="currentColor" />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Streak</span>
              </div>
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{totalLikes}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Likes</span>
              </div>
           </div>
        </div>

        {/* Content Tabs */}
        <div className="w-full mt-4">
           <div className="flex items-center justify-center gap-12 border-b border-zinc-900 mb-6 px-4">
              <button className="pb-4 border-b-2 border-lime-400 text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Grid size={16} /> History
              </button>
              <button className="pb-4 border-b-2 border-transparent text-zinc-600 text-sm font-bold uppercase tracking-widest hover:text-zinc-400">
                  Drafts
              </button>
           </div>

           {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
                  <Grid size={40} className="mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No vlogs yet</p>
              </div>
           ) : (
               <div className="grid grid-cols-3 gap-1 pb-32">
                  {posts.map(post => (
                      <div key={post.id} className="relative aspect-[3/4] bg-zinc-900 overflow-hidden cursor-pointer group">
                          <img 
                              src={post.thumbnailUrl} 
                              alt={post.promptTitle} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Heart size={10} className="text-white" fill="white" />
                               <span className="text-[10px] text-white font-bold">{post.likes}</span>
                          </div>
                      </div>
                  ))}
               </div>
           )}
        </div>
    </div>
  );
};