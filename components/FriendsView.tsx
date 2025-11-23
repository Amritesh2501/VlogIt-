import React, { useState } from 'react';
import { Friend } from '../types';
import { Search, Users, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

interface FriendsViewProps {
  friends: Friend[];
  userCode: string;
  onAddFriend: (code: string) => Promise<void>;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ friends, userCode, onAddFriend }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(friendCodeInput.trim()) {
        setIsLoading(true);
        await onAddFriend(friendCodeInput);
        setIsLoading(false);
        setFriendCodeInput('');
        setActiveTab('list');
    }
  };

  return (
    <div className="pt-4 px-2 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-black text-white tracking-tighter">Friends</h2>
         <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            <button 
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500'}`}
            >
                My Crew
            </button>
            <button 
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'add' ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20' : 'text-zinc-500'}`}
            >
                Add New
            </button>
         </div>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 flex flex-col">
                    <span className="text-3xl font-bold text-white block leading-none mb-1.5">{friends.length}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Total</span>
                </div>
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 flex flex-col">
                    <span className="text-3xl font-bold text-lime-400 block leading-none mb-1.5">{friends.filter(f => f.hasVlogged).length}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Vlogged Today</span>
                </div>
            </div>

            {/* List */}
            {friends.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                    <p className="text-base font-medium">No friends yet.</p>
                    <p className="text-xs mt-2 opacity-70">Tap "Add New" to invite your squad.</p>
                </div>
            ) : (
                <div className="space-y-3 pb-32">
                    {friends.map(friend => (
                        <div key={friend.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className={`relative w-12 h-12 rounded-full p-[2px] ${friend.hasVlogged ? 'bg-lime-400' : 'bg-zinc-700'}`}>
                                    <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base leading-none mb-1.5">{friend.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 font-medium uppercase tracking-wide">Streak: {friend.streak}</span>
                                    </div>
                                </div>
                            </div>
                            {friend.hasVlogged ? (
                                <Check size={20} className="text-lime-400" />
                            ) : (
                                <div className="w-2 h-2 bg-zinc-800 rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      ) : (
        <div className="space-y-8 pb-32">
            {/* Search Code */}
            <div>
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Add by ID</label>
                 <form onSubmit={handleAddSubmit} className="relative group">
                     <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search size={20} className="text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
                     </div>
                     <input 
                        type="text" 
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                        placeholder="Try: SARAH1..."
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-20 focus:outline-none focus:border-lime-400/50 transition-all font-mono uppercase text-lg"
                        disabled={isLoading}
                     />
                     <button 
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-2 bottom-2 bg-lime-400 text-black px-4 rounded-xl font-bold text-xs hover:bg-lime-300 transition-colors disabled:opacity-50 flex items-center gap-2"
                     >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'ADD'}
                     </button>
                 </form>
                 <div className="mt-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex items-start gap-3">
                    <AlertCircle size={18} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Use codes like <code className="text-lime-400 font-bold">SARAH1</code> or <code className="text-lime-400 font-bold">DAVE99</code> to add demo friends.
                    </p>
                 </div>
            </div>

            {/* Your Code Card */}
            <div className="p-8 bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] border border-zinc-800 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Users size={120} /></div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2">Your Friend ID</p>
                <h3 className="text-5xl font-mono font-black text-white mb-8 tracking-wider">{userCode}</h3>
                <button 
                    onClick={handleCopyCode}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-3"
                >
                    {copied ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy ID</>}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};