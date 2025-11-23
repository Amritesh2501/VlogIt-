import React, { useRef, useState } from 'react';
import { UserProfile } from '../types';
import { Bell, Shield, Moon, LogOut, ChevronRight, Github, Twitter, Info, Camera, Loader2 } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processAvatar(file);
    }
  };

  const processAvatar = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
            // Resize image to max 400x400 to save storage space
            const elem = document.createElement('canvas');
            const maxWidth = 400;
            const scaleFactor = maxWidth / img.width;
            const width = Math.min(img.width, maxWidth);
            const height = img.height * (img.width > maxWidth ? scaleFactor : 1);
            
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const base64 = elem.toDataURL('image/jpeg', 0.8);
            
            // Update User
            onUpdateUser({
                ...user,
                avatar: base64
            });
            setUploading(false);
        };
    };
  };

  return (
    <div className="pt-4 px-2 animate-in fade-in duration-500 pb-32">
      <h2 className="text-4xl font-black text-white mb-10 tracking-tighter">Settings</h2>

      <div className="space-y-8">
        {/* Account Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-5">Account</h3>
          <div className="flex items-center gap-5 mb-8">
             <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                 <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-lime-400 relative">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50' : ''}`} 
                    />
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 size={24} className="text-lime-400 animate-spin" />
                        </div>
                    )}
                 </div>
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera size={24} className="text-white" />
                 </div>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                 />
             </div>
             <div>
                <h4 className="font-bold text-white text-2xl">{user.name}</h4>
                <p className="text-sm text-zinc-500">{user.bio}</p>
             </div>
          </div>
          <button 
            onClick={handleAvatarClick}
            className="w-full py-4 bg-zinc-800 rounded-2xl text-base font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-white"
          >
            Change Profile Picture
          </button>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
            {[
                { icon: Bell, label: 'Notifications', value: 'On' },
                { icon: Shield, label: 'Privacy', value: 'Friends Only' },
                { icon: Moon, label: 'Dark Mode', value: 'Always' }
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-zinc-800 rounded-full text-lime-400">
                            <item.icon size={22} />
                        </div>
                        <span className="font-medium text-white text-lg">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                        <span className="text-sm font-medium">{item.value}</span>
                        <ChevronRight size={20} />
                    </div>
                </div>
            ))}
        </div>

        {/* Credits */}
        <div className="pt-10 pb-4 flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-6 bg-lime-400/5 border border-lime-400/20 rounded-2xl w-full">
                <p className="text-zinc-400 text-xs mb-2 uppercase tracking-widest">Designed & Developed by</p>
                <p className="text-white font-bold text-xl tracking-tight">Amritesh Tiwari</p>
            </div>
            
            <div className="flex gap-6">
                <button className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"><Github size={24} /></button>
                <button className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"><Twitter size={24} /></button>
                <button className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"><Info size={24} /></button>
            </div>
            
            <p className="text-xs text-zinc-700 font-medium">Version 2.0.1 • Neon Build</p>
        </div>
        
        <button className="w-full py-5 rounded-2xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-3 mb-8 text-lg">
            <LogOut size={22} />
            Log Out
        </button>
      </div>
    </div>
  );
};