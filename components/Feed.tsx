import React from 'react';
import { VlogPost } from '../types';
import { Heart, MessageSquare, Share2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedProps {
  posts: VlogPost[];
}

export const Feed: React.FC<FeedProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600 font-medium">
        <p className="text-lg">It's quiet here...</p>
        <p className="text-sm mt-2 opacity-50">Be the first to vlog.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 pt-4">
        {/* Header */}
        <div className="px-2 flex items-center justify-between">
             <h2 className="text-3xl font-black text-white tracking-tighter">Feed</h2>
             <span className="text-xs font-bold bg-zinc-900 text-lime-400 px-3 py-1 rounded-full border border-zinc-800 uppercase tracking-wide">
                Live
             </span>
        </div>

      {posts.map((post) => (
        <div key={post.id} className="relative flex flex-col gap-3">
          {/* Post Header */}
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <div className="relative">
                    <img 
                    src={post.userAvatar} 
                    alt={post.userName} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-black bg-zinc-800" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-lime-400 rounded-full border-2 border-black"></div>
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm leading-none mb-1">{post.userName}</h3>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{formatDistanceToNow(post.timestamp)} ago</span>
                </div>
             </div>
          </div>

          {/* Media Card */}
          <div className="relative aspect-[3/4] bg-zinc-900 rounded-[1.5rem] overflow-hidden border border-zinc-800/50 group shadow-2xl">
            {post.videoUrl ? (
                 <video 
                    src={post.videoUrl} 
                    className="w-full h-full object-cover" 
                    poster={post.thumbnailUrl}
                    controls
                    playsInline
                 />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                    <AlertCircle size={32} className="mb-3 opacity-50"/>
                    <p className="text-xs">Media unavailable</p>
                </div>
            )}
            
            {/* Prompt Tag */}
            <div className="absolute top-4 left-4 pointer-events-none">
                 <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="w-2 h-2 bg-lime-400 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-xs font-bold text-white">{post.promptTitle}</span>
                 </div>
            </div>

            {/* Bottom Actions Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-24 pointer-events-none transition-opacity duration-300">
               {post.caption && (
                   <p className="text-white text-sm font-medium mb-4 line-clamp-2 text-shadow-md leading-relaxed">{post.caption}</p>
               )}
               
               <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-5">
                      <button className="flex items-center gap-2 group p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                          <Heart size={24} className="text-white group-hover:text-lime-400 transition-colors" />
                          <span className="text-sm font-bold text-white">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 group p-2 hover:bg-white/10 rounded-full transition-colors">
                          <MessageSquare size={24} className="text-white group-hover:text-lime-400 transition-colors" />
                      </button>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors -mr-2">
                      <Share2 size={24} className="text-white hover:text-lime-400 transition-colors" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};