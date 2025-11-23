import React, { useState } from 'react';
import { DailyPrompt, Friend } from '../types';
import { RefreshCw, Video, Sparkles, Zap, Plus } from 'lucide-react';
import { generateDailyPrompt } from '../services/geminiService';
import { format } from 'date-fns';

interface DashboardProps {
  prompt: DailyPrompt | null;
  setPrompt: (prompt: DailyPrompt) => void;
  friends: Friend[];
  onOpenCamera: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ prompt, setPrompt, friends, onOpenCamera }) => {
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  const handleNewPrompt = async () => {
    setLoadingPrompt(true);
    const newPrompt = await generateDailyPrompt();
    setPrompt(newPrompt);
    setLoadingPrompt(false);
  };

  const vloggedCount = friends.filter(f => f.hasVlogged).length;

  return (
    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Date */}
      <div className="flex justify-between items-end px-2">
         <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">{format(new Date(), 'EEEE, MMM do')}</p>
            <h2 className="text-4xl font-black text-white tracking-tighter">Daily <span className="text-lime-400">Vlog</span></h2>
         </div>
      </div>

      {/* Main Prompt Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-lime-400/10 rounded-[2rem] blur-2xl group-hover:bg-lime-400/20 transition-all duration-700"></div>
        <div className="relative bg-[#111] border border-zinc-800 rounded-[2rem] p-7 flex flex-col min-h-[340px] shadow-2xl justify-between overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <Zap size={200} fill="white" />
          </div>

          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/5 border border-lime-400/20">
                    <Sparkles size={12} className="text-lime-400" />
                    <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">AI Generated</span>
                 </div>
                 <button 
                    onClick={handleNewPrompt}
                    disabled={loadingPrompt}
                    className="p-2 text-zinc-600 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
                 >
                    <RefreshCw size={18} className={loadingPrompt ? 'animate-spin' : ''} />
                 </button>
             </div>

             {loadingPrompt ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-zinc-800 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded-lg w-full"></div>
                    <div className="h-4 bg-zinc-800 rounded-lg w-2/3"></div>
                </div>
             ) : (
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{prompt?.title || "Loading..."}</h3>
                    <p className="text-zinc-400 font-medium text-lg leading-relaxed max-w-[95%]">
                        {prompt?.description || "Fetching today's vibe..."}
                    </p>
                    <div className="inline-block mt-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                            prompt?.difficulty === 'Hard' ? 'border-red-500/30 text-red-500' : 
                            prompt?.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-500' : 
                            'border-lime-500/30 text-lime-500'
                        }`}>
                            {prompt?.difficulty} Mode
                        </span>
                    </div>
                 </div>
             )}
          </div>

          <div className="relative z-10 mt-8">
             <button 
                onClick={onOpenCamera}
                className="group w-full bg-lime-400 hover:bg-lime-300 text-black font-black text-base py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-lg shadow-lime-400/10"
             >
                <Video size={18} className="text-black" />
                <span className="tracking-wide">RECORD NOW</span>
             </button>
          </div>
        </div>
      </div>

      {/* Mini Status */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-zinc-900/40 p-5 rounded-[1.5rem] border border-zinc-800/50 flex flex-col justify-between h-32">
             <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Friends Done</span>
             <div className="flex items-baseline gap-1.5">
                 <span className="text-3xl font-black text-white">{vloggedCount}</span>
                 <span className="text-sm text-zinc-600 font-medium">/ {friends.length}</span>
             </div>
             <div className="flex -space-x-3 overflow-hidden items-center">
                 {friends.length > 0 ? (
                    friends.filter(f => f.hasVlogged).slice(0, 4).map(f => (
                        <img key={f.id} src={f.avatar} className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" alt={f.name} />
                    ))
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center">
                        <Plus size={14} className="text-zinc-500" />
                    </div>
                 )}
                 {friends.filter(f => f.hasVlogged).length > 4 && (
                     <span className="text-[10px] text-zinc-600 ml-3 font-medium">+{friends.filter(f => f.hasVlogged).length - 4}</span>
                 )}
             </div>
         </div>

         <div className="bg-zinc-900/40 p-5 rounded-[1.5rem] border border-zinc-800/50 flex flex-col justify-between h-32">
             <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Time Left</span>
             <div className="flex items-baseline gap-1.5">
                 <span className="text-3xl font-black text-white">04</span>
                 <span className="text-sm text-zinc-600 font-medium">hrs</span>
             </div>
             <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2">
                 <div className="bg-lime-400 h-1.5 rounded-full w-[80%]"></div>
             </div>
         </div>
      </div>
    </div>
  );
};